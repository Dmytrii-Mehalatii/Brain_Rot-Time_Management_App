import { NativeModule, requireNativeModule } from "expo";
import type {
  AppUsageStat,
  DailyStreak,
  TotalTime,
  UsageStatsModuleEvents,
  WeeklyDayTime,
  WeeklyStreakDay,
} from "./types";

export * from "./types";

/**
 * Android-only bridge to UsageStatsManager (see android/…/UsageStatsModule.kt).
 * Every call is synchronous and returns empty data until usage access is granted.
 */
declare class UsageStatsModule extends NativeModule<UsageStatsModuleEvents> {
  hasPermission(): boolean;
  /** Opens the system "Usage access" settings screen. */
  requestPermission(): string;
  getStats(): AppUsageStat[];
  sumTime(): TotalTime;
  getWeeklyTime(): WeeklyDayTime[];
  getWeeklyAppStats(): AppUsageStat[];
  getDailyStreak(): DailyStreak;
  getWeeklyStreak(): WeeklyStreakDay[];
}

export default requireNativeModule<UsageStatsModule>("UsageStats");
