package expo.modules.usagestats

import java.io.ByteArrayOutputStream
import android.app.AppOpsManager
import android.app.usage.UsageStats
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
import java.net.URL

class UsageStatsModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("UsageStats")

    Function("hasPermission") {
      val context = appContext.reactContext
      return@Function context?.let { hasUsagePermission(it) } ?: false
    }

    Function("requestPermission") {
      val context = appContext.reactContext ?: return@Function "no_context"
      val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
      "permission_requested"
    }

    Function("getStats") {
      val context = appContext.reactContext ?: return@Function emptyList<Map<String, Any>>()

      if (!hasUsagePermission(context)) {
        return@Function emptyList<Map<String, Any>>()
      }

      return@Function getStatsInternal(context)
    }

Function("sumTime") {
    val context = appContext.reactContext ?: return@Function mapOf("formatted" to "0h 0m", "totalMinutes" to 0L)

    if (!hasUsagePermission(context)) {
        return@Function mapOf("formatted" to "0h 0m", "totalMinutes" to 0L)
    }

    return@Function getTotalTimeInternal(context)
}

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

  private fun hasUsagePermission(context: Context): Boolean {
      val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
      val mode = appOps.checkOpNoThrow(
          AppOpsManager.OPSTR_GET_USAGE_STATS,
          android.os.Process.myUid(),
          context.packageName
      )
      return mode == AppOpsManager.MODE_ALLOWED
  }

private fun getTotalTimeInternal(context: Context): Map<String, Any> {
    val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
        ?: return mapOf("formatted" to "0h 0m", "totalMinutes" to 0L)

    val endTime = System.currentTimeMillis()
    val startTime = endTime - 1000L * 3600 * 24

    val stats = usm.queryUsageStats(
        UsageStatsManager.INTERVAL_DAILY,
        startTime,
        endTime
    ) ?: return mapOf("formatted" to "0h 0m", "totalMinutes" to 0L)

    val totalMs = stats.sumOf { it.totalTimeInForeground }

    val totalMinutes = totalMs / 1000 / 60
    val hours = totalMinutes / 60
    val minutes = totalMinutes % 60

    val finalValueText = "${hours}h ${minutes}m"
    return mapOf(
        "formatted" to finalValueText,
        "totalMinutes" to totalMinutes
    )
}


private fun getStatsInternal(context: Context): List<Map<String, Any>> {
    val result = mutableListOf<Map<String, Any>>()

    val usm = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
      ?: return emptyList()

    val endTime = System.currentTimeMillis()
    val startTime = endTime - 1000L * 3600 * 24

    val stats = usm.queryUsageStats(
      UsageStatsManager.INTERVAL_DAILY,
      startTime,
      endTime
    ) ?: return emptyList()

    val pm = context.packageManager

    for (usage in stats) {
      val time = usage.totalTimeInForeground
      if (time <= 10) continue

      try {
        val appInfo = pm.getApplicationInfo(usage.packageName, 0)
        val appName = pm.getApplicationLabel(appInfo).toString()
        val iconBase64 = drawableToBase64(pm.getApplicationIcon(appInfo))

        result.add(
          mapOf(
            "packageName" to usage.packageName,
            "appName" to appName,
            "seconds" to time / 1000,
            "icon" to iconBase64
          )
        )
      } catch (_: Exception) {}
    }

    return result
  }
}