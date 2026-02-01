package expo.modules.usagestats

import java.io.ByteArrayOutputStream
import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
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

    private fun getAppDurationsFromEvents(usm: UsageStatsManager, startTime: Long, endTime: Long): Map<String, Long> {
        val events = usm.queryEvents(startTime, endTime)
        val event = UsageEvents.Event()
        
        val durations = mutableMapOf<String, Long>()
        val lastResumedTime = mutableMapOf<String, Long>()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            val pkg = event.packageName ?: continue

            when (event.eventType) {
                UsageEvents.Event.ACTIVITY_RESUMED -> {
                    lastResumedTime[pkg] = event.timeStamp
                }
                UsageEvents.Event.ACTIVITY_PAUSED -> {
                    val start = lastResumedTime[pkg]
                    if (start != null) {
                        val duration = event.timeStamp - start
                        durations[pkg] = (durations[pkg] ?: 0L) + duration
                        lastResumedTime.remove(pkg)
                    }
                }
            }
        }
        
        lastResumedTime.forEach { (pkg, start) ->
            val duration = endTime - start
            durations[pkg] = (durations[pkg] ?: 0L) + duration
        }

        return durations
    }

    private fun getTotalTimeInternal(context: Context): Map<String, Any> {
      val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
        ?: return mapOf("formatted" to "0h 0m", "totalMinutes" to 0L)

      val endTime = System.currentTimeMillis()
      val startTime = getTodayStartTime()


      val blacklistedPackages = listOf("com.google.android.googlequicksearchbox", "com.android.systemui", "com.google.android.googlesdksetup")
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
        "com.google.android.googlesdksetup"
    )

    val result = mutableListOf<Map<String, Any>>()
    val dayLabels = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")

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
                "label" to dayLabels[currentIndex],
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
            "com.google.android.googlesdksetup"
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
}