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
import android.util.Base64
import java.util.Calendar

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
    }

    private fun getTodayStartTime(): Long {
        return Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
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


      val blacklistedPackages = listOf("com.google.android.googlequicksearchbox", "com.android.systemui", context.packageName)
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

    private fun getStatsInternal(context: Context): List<Map<String, Any>> {
      val result = mutableListOf<Map<String, Any>>()
      
      val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager ?: return emptyList()
      
      val endTime = System.currentTimeMillis()
      val startTime = getTodayStartTime() 
      
      val appDurations = getAppDurationsFromEvents(usm, startTime, endTime)
      
      val pm = context.packageManager
      val top3Packages = appDurations.entries
          .sortedByDescending { it.value }
          .take(3)

          val blacklistedPackages = listOf(
            "com.google.android.googlequicksearchbox",
            "com.android.systemui")

        for ((packageName, timeMs) in top3Packages) {
          if (blacklistedPackages.contains(packageName)) continue
            try {
                val appInfo = pm.getApplicationInfo(packageName, 0)
                val appName = pm.getApplicationLabel(appInfo).toString()
                val iconBase64 = drawableToBase64(pm.getApplicationIcon(appInfo))

                result.add(
                    mapOf(
                        "packageName" to packageName,
                        "appName" to appName,
                        "seconds" to timeMs / 1000,
                        "icon" to iconBase64
                    )
                )
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