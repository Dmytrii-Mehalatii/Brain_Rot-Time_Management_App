package expo.modules.usagestats

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.os.Build
import android.os.Process
import android.provider.Settings
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

/** A foreground session longer than this almost certainly lost its "paused" event, so it is capped. */
private const val MAX_SESSION_MS = 60 * 60 * 1000L
private const val DAILY_LIMIT_MINUTES = 240L
private const val STREAK_LOOKBACK_DAYS = 30
/** Icons are shown at 48dp at most; 144px covers 3x screens at a fraction of the full-size payload. */
private const val ICON_SIZE_PX = 144

/** System UI and this app itself are not screen time the user chose to spend. */
private val IGNORED_PACKAGES = setOf(
    "com.google.android.googlequicksearchbox",
    "com.android.systemui",
    "com.google.android.googlesdksetup",
    "com.anonymous.brainrot",
)

private val NO_TIME: Map<String, Any> = mapOf("formatted" to "0h 0m", "totalMinutes" to 0L)
private val NO_STREAK: Map<String, Any> = mapOf(
    "streak" to 0,
    "todayMinutes" to 0L,
    "successToday" to true,
    "limitMinutes" to DAILY_LIMIT_MINUTES,
)

class UsageStatsModule : Module() {
    private var lastPermissionState: Boolean? = null

    /** Foreground millis per package for finished days, keyed by day start. Finished days never change. */
    private val finishedDayDurations = mutableMapOf<Long, Map<String, Long>>()

    private val manualCategories: Map<String, String> by lazy { loadManualCategories() }

    private val currentContext: Context?
        get() = appContext.reactContext

    override fun definition() = ModuleDefinition {
        Name("UsageStats")

        Events("onPermissionChanged")

        Function("hasPermission") {
            currentContext?.let { hasUsagePermission(it) } ?: false
        }

        Function("requestPermission") {
            val ctx = currentContext ?: return@Function "no_context"
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            ctx.startActivity(intent)
            "permission_requested"
        }

        Function("getStats") { withPermission(emptyList()) { todayAppStats(it) } }
        Function("sumTime") { withPermission(NO_TIME) { totalTimeToday(it) } }
        Function("getWeeklyTime") { withPermission(emptyList()) { weeklyTime(it) } }
        Function("getWeeklyAppStats") { withPermission(emptyList()) { weeklyAppStats(it) } }
        Function("getDailyStreak") { withPermission(NO_STREAK) { dailyStreak(it) } }
        Function("getWeeklyStreak") { withPermission(emptyList()) { weeklyStreak(it) } }

        OnCreate {
            lastPermissionState = currentContext?.let { hasUsagePermission(it) }
        }

        // Usage access can only be toggled in system Settings, so the app coming
        // back to the foreground is the moment it may have changed.
        OnActivityEntersForeground {
            emitIfPermissionChanged()
        }
    }

    private inline fun <T> withPermission(fallback: T, block: (Context) -> T): T {
        val ctx = currentContext ?: return fallback
        return if (hasUsagePermission(ctx)) block(ctx) else fallback
    }

    private fun emitIfPermissionChanged() {
        val ctx = currentContext ?: return
        val granted = hasUsagePermission(ctx)
        val previous = lastPermissionState
        lastPermissionState = granted
        if (previous != null && previous != granted) {
            sendEvent("onPermissionChanged", mapOf("granted" to granted))
        }
    }

    private fun hasUsagePermission(ctx: Context): Boolean {
        val appOps = ctx.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), ctx.packageName)
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), ctx.packageName)
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun usageStatsManager(ctx: Context): UsageStatsManager? =
        ctx.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager

    // ---- Calendar helpers -------------------------------------------------

    private fun dayStart(daysAgo: Int): Calendar = Calendar.getInstance().apply {
        set(Calendar.HOUR_OF_DAY, 0)
        set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
        add(Calendar.DAY_OF_YEAR, -daysAgo)
    }

    private fun dayLabel(daysAgo: Int): String {
        if (daysAgo == 0) return "Today"
        return SimpleDateFormat("EEE", Locale.ENGLISH).format(dayStart(daysAgo).time)
    }

    // ---- Foreground durations --------------------------------------------

    /** Foreground millis per package for one calendar day. Today's range ends now, not at midnight. */
    private fun durationsForDay(usm: UsageStatsManager, daysAgo: Int): Map<String, Long> {
        val start = dayStart(daysAgo)
        val startMs = start.timeInMillis
        val endMs = start.apply { add(Calendar.DAY_OF_YEAR, 1) }.timeInMillis
        val now = System.currentTimeMillis()

        if (endMs > now) return durationsFromEvents(usm, startMs, now)
        return finishedDayDurations.getOrPut(startMs) { durationsFromEvents(usm, startMs, endMs) }
    }

    private fun durationsFromEvents(usm: UsageStatsManager, startMs: Long, endMs: Long): Map<String, Long> {
        val durations = mutableMapOf<String, Long>()
        val openSince = mutableMapOf<String, Long>()

        fun record(pkg: String, sessionStart: Long, sessionEnd: Long) {
            val duration = (sessionEnd - sessionStart).coerceAtMost(MAX_SESSION_MS)
            if (duration > 0) durations.merge(pkg, duration) { a, b -> a + b }
        }

        val events = usm.queryEvents(startMs, endMs)
        val event = UsageEvents.Event()
        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            val pkg = event.packageName ?: continue
            // ACTIVITY_RESUMED/PAUSED share their values with the pre-API-29 MOVE_TO_FOREGROUND/BACKGROUND.
            when (event.eventType) {
                UsageEvents.Event.ACTIVITY_RESUMED -> openSince.putIfAbsent(pkg, event.timeStamp)
                UsageEvents.Event.ACTIVITY_PAUSED -> openSince.remove(pkg)?.let { record(pkg, it, event.timeStamp) }
            }
        }

        // Sessions still open at the end of the range count up to its end, unless they
        // started so long ago that the matching "paused" event was evidently lost.
        val now = System.currentTimeMillis()
        for ((pkg, sessionStart) in openSince) {
            if (now - sessionStart < MAX_SESSION_MS) record(pkg, sessionStart, endMs)
        }
        return durations
    }

    private fun countedMinutes(durations: Map<String, Long>): Long =
        durations.filterKeys { it !in IGNORED_PACKAGES }.values.sum() / 60_000

    private fun minutesForDay(usm: UsageStatsManager, daysAgo: Int): Long =
        countedMinutes(durationsForDay(usm, daysAgo))

    // ---- Payloads exposed to JavaScript ----------------------------------

    private fun totalTimeToday(ctx: Context): Map<String, Any> {
        val usm = usageStatsManager(ctx) ?: return NO_TIME
        val minutes = minutesForDay(usm, 0)
        return mapOf(
            "formatted" to "${minutes / 60}h ${minutes % 60}m",
            "totalMinutes" to minutes,
        )
    }

    private fun weeklyTime(ctx: Context): List<Map<String, Any>> {
        val usm = usageStatsManager(ctx) ?: return emptyList()
        return (6 downTo 0).map { daysAgo ->
            mapOf(
                "value" to minutesForDay(usm, daysAgo),
                "label" to dayLabel(daysAgo),
                "dayIndex" to 7 - daysAgo,
            )
        }
    }

    private fun todayAppStats(ctx: Context): List<Map<String, Any>> {
        val usm = usageStatsManager(ctx) ?: return emptyList()
        return rankedAppStats(ctx, durationsForDay(usm, 0))
    }

    private fun weeklyAppStats(ctx: Context): List<Map<String, Any>> {
        val usm = usageStatsManager(ctx) ?: return emptyList()
        val weekly = mutableMapOf<String, Long>()
        for (daysAgo in 0..6) {
            for ((pkg, millis) in durationsForDay(usm, daysAgo)) {
                weekly.merge(pkg, millis) { a, b -> a + b }
            }
        }
        return rankedAppStats(ctx, weekly)
    }

    /** Ranks apps by time spent and attaches what the UI shows; apps that are gone are skipped. */
    private fun rankedAppStats(ctx: Context, durations: Map<String, Long>): List<Map<String, Any>> {
        val pm = ctx.packageManager
        return durations.entries
            .filter { it.key !in IGNORED_PACKAGES }
            .sortedByDescending { it.value }
            .mapNotNull { (pkg, millis) -> appStat(pm, pkg, millis) }
            .mapIndexed { index, stat -> stat + ("appIndex" to index + 1) }
    }

    private fun appStat(pm: PackageManager, pkg: String, millis: Long): Map<String, Any>? {
        return try {
            val info = pm.getApplicationInfo(pkg, 0)
            mapOf(
                "packageName" to pkg,
                "appName" to pm.getApplicationLabel(info).toString(),
                "category" to categoryOf(pkg, info),
                "seconds" to millis / 1000,
                "icon" to iconBase64(pm.getApplicationIcon(info)),
            )
        } catch (e: Exception) {
            null
        }
    }

    private fun categoryOf(pkg: String, info: ApplicationInfo): String {
        manualCategories[pkg]?.let { return it }
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return "Undefined"
        return when (info.category) {
            ApplicationInfo.CATEGORY_GAME -> "Game"
            ApplicationInfo.CATEGORY_AUDIO -> "Audio"
            ApplicationInfo.CATEGORY_VIDEO -> "Video"
            ApplicationInfo.CATEGORY_IMAGE -> "Image"
            ApplicationInfo.CATEGORY_SOCIAL -> "Social"
            ApplicationInfo.CATEGORY_NEWS -> "News"
            ApplicationInfo.CATEGORY_MAPS -> "Maps"
            ApplicationInfo.CATEGORY_PRODUCTIVITY -> "Productivity"
            ApplicationInfo.CATEGORY_ACCESSIBILITY -> "Accessibility"
            else -> "Undefined"
        }
    }

    /** Hand-curated overrides for apps whose Play Store category is missing or unhelpful. */
    private fun loadManualCategories(): Map<String, String> {
        val ctx = currentContext ?: return emptyMap()
        return try {
            val json = JSONObject(ctx.assets.open("app_categories.json").bufferedReader().use { it.readText() })
            json.keys().asSequence().associateWith { json.getString(it) }
        } catch (e: Exception) {
            emptyMap()
        }
    }

    private fun iconBase64(drawable: Drawable): String {
        val bitmap = Bitmap.createBitmap(ICON_SIZE_PX, ICON_SIZE_PX, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)

        val output = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output)
        return Base64.encodeToString(output.toByteArray(), Base64.NO_WRAP)
    }

    // ---- Streaks ---------------------------------------------------------

    private fun dailyStreak(ctx: Context): Map<String, Any> {
        val usm = usageStatsManager(ctx) ?: return NO_STREAK
        val todayMinutes = minutesForDay(usm, 0)
        val successToday = todayMinutes < DAILY_LIMIT_MINUTES

        val streak = if (!successToday) 0 else 1 + (1..STREAK_LOOKBACK_DAYS).asSequence()
            .map { minutesForDay(usm, it) }
            .takeWhile { it < DAILY_LIMIT_MINUTES }
            .count()

        return mapOf(
            "streak" to streak,
            "todayMinutes" to todayMinutes,
            "successToday" to successToday,
            "limitMinutes" to DAILY_LIMIT_MINUTES,
        )
    }

    private fun weeklyStreak(ctx: Context): List<Map<String, Any>> {
        val usm = usageStatsManager(ctx) ?: return emptyList()
        return (6 downTo 0).map { daysAgo ->
            val minutes = minutesForDay(usm, daysAgo)
            mapOf(
                "day" to dayLabel(daysAgo),
                "minutes" to minutes,
                "success" to (minutes < DAILY_LIMIT_MINUTES),
            )
        }
    }
}
