package expo.modules.usagestats

import java.io.ByteArrayOutputStream;
import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.events.EventEmitter
import expo.modules.kotlin.events.EventsDefinition
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.content.pm.ApplicationInfo
import android.util.Base64
import java.util.Calendar
import org.json.JSONObject

class UsageStatsModule : Module() {

    override fun definition() = ModuleDefinition {
        Name("UsageStats")

        Events("onPermissionChanged")

        Function("hasPermission") {
            val context = appContext.reactContext ?: return@Function false
            hasUsagePermission(context)
        }

        Function("requestPermission") {
            val context = appContext.reactContext ?: return@Function "no_context"
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
            "permission_requested"
        }

        Function("getStats") {
            val context = appContext.reactContext ?: return@Function emptyList<Map<String, Any>>()
            if (!hasUsagePermission(context)) {
                return@Function emptyList<Map<String, Any>>()
            }
            getStatsInternal(context)
        }

        Function("sumTime") {
            val context = appContext.reactContext ?: return@Function mapOf("formatted" to "0h 0m", "totalMinutes" to 0L)
            if (!hasUsagePermission(context)) {
                return@Function mapOf("formatted" to "0h 0m", "totalMinutes" to 0L)
            }
            getTotalTimeInternal(context)
        }

        Function("getWeeklyTime") {
            val context = appContext.reactContext ?: return@Function emptyList<Map<String, Any>>()
            if (!hasUsagePermission(context)) {
                return@Function emptyList<Map<String, Any>>()
            }
            getWeeklyTimeInternal(context)
        }

        Function("getWeeklyAppStats") {
            val context = appContext.reactContext ?: return@Function emptyList<Map<String, Any>>()
            if (!hasUsagePermission(context)) {
                return@Function emptyList<Map<String, Any>>()
            }
            getWeeklyAppStatsInternal(context)
        }

        Function("getDailyStreak") {
            val context = appContext.reactContext ?: return@Function emptyMap<String, Any>()
            if (!hasUsagePermission(context)) {
              return@Function emptyMap<String, Any>()
            }
            getDailyStreak(context)
        }

        Function("getWeeklyStreak") {
          val context = appContext.reactContext ?: return@Function emptyList<Map<String, Any>>()
          if (!hasUsagePermission(context)) {
            return@Function emptyList<Map<String, Any>>()
          }
          getWeeklyStreakData(context)
        }

        OnCreate {
            val context = appContext.reactContext ?: return@OnCreate

            val handler = android.os.Handler(android.os.Looper.getMainLooper())

            val runnable = object : Runnable {
                override fun run() {
                    checkPermissionAndEmit(context)
                    handler.postDelayed(this, 1000)
                }
            }

            handler.post(runnable)
        }
    }

    private var lastPermissionState: Boolean? = null

    private fun checkPermissionAndEmit(context: Context) {

        val current = hasUsagePermission(context)

        if (lastPermissionState == null) {
            lastPermissionState = current
            return
        }
        
        if (current != lastPermissionState) {
            lastPermissionState = current
            sendEvent(
                "onPermissionChanged",
                mapOf("granted" to current)
            )
        }
    }

    private fun getTodayStartTime(): Long {
        return Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
    }

    private fun getDayRange(dayOffset: Int): Pair<Long, Long> {
        val cal = Calendar.getInstance()

        cal.set(Calendar.HOUR_OF_DAY, 0)
        cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0)
        cal.set(Calendar.MILLISECOND, 0)

        cal.add(Calendar.DAY_OF_YEAR, -dayOffset)
        val start = cal.timeInMillis

        cal.add(Calendar.DAY_OF_YEAR, 1)
        val end = cal.timeInMillis

        return start to end
    }


    private fun hasUsagePermission(context: Context): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            android.os.Process.myUid(),
            context.packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun getAppDurationsFromEvents(
        usm: UsageStatsManager,
        startTime: Long,
        endTime: Long
    ): Map<String, Long> {

        val events = usm.queryEvents(startTime, endTime)
        val event = UsageEvents.Event()

        val durations = mutableMapOf<String, Long>()
        val lastStart = mutableMapOf<String, Long>()

        val MAX_SESSION = 1000L * 60 * 60
        val STALE_THRESHOLD = 1000L * 60 * 60

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            val pkg = event.packageName ?: continue

            when (event.eventType) {

                UsageEvents.Event.MOVE_TO_FOREGROUND -> {
                    if (!lastStart.containsKey(pkg)) {
                        lastStart[pkg] = event.timeStamp
                    }
                }

                UsageEvents.Event.MOVE_TO_BACKGROUND -> {
                    val start = lastStart[pkg]
                    if (start != null) {
                        var duration = event.timeStamp - start

                        if (duration > MAX_SESSION) {
                            duration = MAX_SESSION
                        }

                        if (duration > 0) {
                            durations[pkg] = (durations[pkg] ?: 0L) + duration
                        }

                        lastStart.remove(pkg)
                    }
                }
            }
        }

        val now = System.currentTimeMillis()

        lastStart.forEach { (pkg, start) ->
            val age = now - start

            if (age < STALE_THRESHOLD) {
                var duration = endTime - start

                if (duration > MAX_SESSION) {
                    duration = MAX_SESSION
                }

                if (duration > 0) {
                    durations[pkg] = (durations[pkg] ?: 0L) + duration
                }
            }
        }

        return durations
    }

    private fun getTotalTimeInternal(context: Context): Map<String, Any> {
      val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
        ?: return mapOf("formatted" to "0h 0m", "totalMinutes" to 0L)

      val endTime = System.currentTimeMillis()
      val startTime = getTodayStartTime()


      val blacklistedPackages = listOf("com.google.android.googlequicksearchbox", "com.android.systemui", "com.google.android.googlesdksetup", "com.anonymous.brainrot")
      val appDurations = getAppDurationsFromEvents(usm, startTime, endTime)
    
      val totalMs = appDurations.filter { !blacklistedPackages.contains(it.key) }.values.sum()
      val totalMinutes = totalMs / 1000 / 60
      val hours = totalMinutes / 60
      val minutes = totalMinutes % 60

      return mapOf(
        "formatted" to "${hours}h ${minutes}m",
        "totalMinutes" to totalMinutes
      )
    }

    private fun getWeeklyTimeInternal(context: Context): List<Map<String, Any>> {
        val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
            ?: return emptyList()

        val blacklistedPackages = listOf(
            "com.google.android.googlequicksearchbox",
            "com.android.systemui",
            "com.google.android.googlesdksetup",
            "com.anonymous.brainrot"
        )

        val result = mutableListOf<Map<String, Any>>()

        for (i in 6 downTo 0) {
            val (start, end) = getDayRange(i)
            val appDurations = getAppDurationsFromEvents(usm, start, end)
        
            val totalMs = appDurations
                .filter { !blacklistedPackages.contains(it.key) }
                .values
                .sum()
        
            val totalMinutes = totalMs / 1000 / 60
            val currentIndex = 6 - i
        
            result.add(
                mapOf(
                    "value" to totalMinutes,
                    "label" to getDayLabel(start, i == 0),
                    "dayIndex" to (currentIndex + 1)
                )
            )
        }

        return result
    }


    private fun getManualCategories(context: Context): Map<String, String> {
        val map = mutableMapOf<String, String>()
        try {
            val jsonString = context.assets.open("app_categories.json").bufferedReader().use { it.readText() }
            val jsonObject = JSONObject(jsonString)
            jsonObject.keys().forEach { key ->
                map[key] = jsonObject.getString(key)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return map
    }

    private fun getCategoryString(category: Int): String {
        return when (category) {
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

    private fun getDayLabel(timeInMillis: Long, isToday: Boolean): String {
        if (isToday) return "Today"

        val cal = Calendar.getInstance()
        cal.timeInMillis = timeInMillis

        return when (cal.get(Calendar.DAY_OF_WEEK)) {
            Calendar.MONDAY -> "Mon"
            Calendar.TUESDAY -> "Tue"
            Calendar.WEDNESDAY -> "Wed"
            Calendar.THURSDAY -> "Thu"
            Calendar.FRIDAY -> "Fri"
            Calendar.SATURDAY -> "Sat"
            Calendar.SUNDAY -> "Sun"
            else -> ""
        }
    }

    private fun getStatsInternal(context: Context): List<Map<String, Any>> {
        val result = mutableListOf<Map<String, Any>>()
        val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager ?: return emptyList()
        val manualMap = getManualCategories(context) 
        
        val cal = Calendar.getInstance()

        cal.set(Calendar.HOUR_OF_DAY, 0)
        cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0)
        cal.set(Calendar.MILLISECOND, 0)
        val startTime = cal.timeInMillis

        cal.add(Calendar.DAY_OF_YEAR, 1)
        val endTime = cal.timeInMillis
        val appDurations = getAppDurationsFromEvents(usm, startTime, endTime)
        val pm = context.packageManager

        val blacklistedPackages = listOf(
            "com.google.android.googlequicksearchbox",
            "com.android.systemui",
            "com.google.android.googlesdksetup",
            "com.anonymous.brainrot"
        )

        val sortedPackages = appDurations.entries
            .filter { !blacklistedPackages.contains(it.key) }
            .sortedByDescending { it.value }

        var displayedRank = 1 
        for ((packageName, timeMs) in sortedPackages) {
            try {
                val appInfo = pm.getApplicationInfo(packageName, 0)
                val appName = pm.getApplicationLabel(appInfo).toString()
                val iconBase64 = drawableToBase64(pm.getApplicationIcon(appInfo))

                val categoryName = manualMap[packageName] ?: run {
                    val categoryId = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                        appInfo.category
                    } else {
                        -1
                    }
                    getCategoryString(categoryId) 
                }

                result.add(
                    mapOf(
                        "packageName" to packageName,
                        "appIndex" to displayedRank,
                        "appName" to appName,
                        "category" to categoryName,
                        "seconds" to timeMs / 1000,
                        "icon" to iconBase64
                    )
                )
                displayedRank++ 
            } catch (_: Exception) {}
        }
        return result
    }

    private fun getWeeklyAppStatsInternal(context: Context): List<Map<String, Any>> {
        val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
            ?: return emptyList()

        val pm = context.packageManager
        val manualMap = getManualCategories(context)

        val blacklistedPackages = listOf(
            "com.google.android.googlequicksearchbox",
            "com.android.systemui",
            "com.google.android.googlesdksetup",
            "com.anonymous.brainrot"
        )

        val weeklyDurations = mutableMapOf<String, Long>()

        for (i in 0..6) {
            val (start, end) = getDayRange(i)
            val dailyDurations = getAppDurationsFromEvents(usm, start, end)

            dailyDurations.forEach { (pkg, duration) ->
                weeklyDurations[pkg] = (weeklyDurations[pkg] ?: 0L) + duration
            }
        }

        val sortedApps = weeklyDurations.entries
            .filter { !blacklistedPackages.contains(it.key) }
            .sortedByDescending { it.value }

        val result = mutableListOf<Map<String, Any>>()
        var rank = 1

        for ((packageName, timeMs) in sortedApps) {
            try {
                val appInfo = pm.getApplicationInfo(packageName, 0)
                val appName = pm.getApplicationLabel(appInfo).toString()
                val iconBase64 = drawableToBase64(pm.getApplicationIcon(appInfo))

                val categoryName = manualMap[packageName] ?: run {
                    val categoryId = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                        appInfo.category
                    } else {
                        -1
                    }
                    getCategoryString(categoryId)
                }

                result.add(
                    mapOf(
                        "packageName" to packageName,
                        "appIndex" to rank,
                        "appName" to appName,
                        "category" to categoryName,
                        "seconds" to timeMs / 1000,
                        "icon" to iconBase64
                    )
                )
                rank++
            } catch (_: Exception) {}
        }

        return result
    }


    private fun drawableToBase64(drawable: Drawable): String {
        val bitmap = if (drawable is BitmapDrawable) {
            drawable.bitmap
        } else {
            val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 96
            val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 96
            Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888).apply {
                val canvas = Canvas(this)
                drawable.setBounds(0, 0, canvas.width, canvas.height)
                drawable.draw(canvas)
            }
        }

        val output = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output)
        return Base64.encodeToString(output.toByteArray(), Base64.NO_WRAP)
    }

    private fun getTotalMinutesForDay(
      context: Context,
      dayOffset: Int
    ): Long {
      val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
        ?: return 0L

      val (start, end) = getDayRange(dayOffset)
      val blacklistedPackages = listOf(
        "com.google.android.googlequicksearchbox",
        "com.android.systemui",
        "com.google.android.googlesdksetup",
        "com.anonymous.brainrot"
      )

      val appDurations = getAppDurationsFromEvents(usm, start, end)
      val totalMs = appDurations
        .filter { !blacklistedPackages.contains(it.key) }
        .values
        .sum()

      return totalMs / 1000 / 60
    }

    private fun getDailyStreak(context: Context): Map<String, Any> {
      val MAX_MINUTES = 240L
      var streak = 0

      for (i in 0..30) {
        val minutes = getTotalMinutesForDay(context, i)
        if (minutes < MAX_MINUTES) {
          streak++
        } else {
          break
        }
      }

      val todayMinutes = getTotalMinutesForDay(context, 0)
      val successToday = todayMinutes < MAX_MINUTES

      return mapOf(
        "streak" to streak,
        "todayMinutes" to todayMinutes,
        "successToday" to successToday,
        "limitMinutes" to MAX_MINUTES
      )
    }

    private fun getWeeklyStreakData(context: Context): List<Map<String, Any>> {
      val MAX_MINUTES = 240L
      val result = mutableListOf<Map<String, Any>>()

      for (i in 6 downTo 0) {
        val minutes = getTotalMinutesForDay(context, i)
        val (start, _) = getDayRange(i)

        result.add(
          mapOf(
            "day" to getDayLabel(start, i == 0),
            "minutes" to minutes,
            "success" to (minutes < MAX_MINUTES)
          )
        )
      }
      return result
    }
}