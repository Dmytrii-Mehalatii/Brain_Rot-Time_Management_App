import { requireNativeModule } from "expo-modules-core";

const UsageStats = requireNativeModule("UsageStats");

export function hasPermission(): boolean {
  return UsageStats.hasPermission();
}

export function requestPermission(): string {
  return UsageStats.requestPermission();
}

export function getStats(): {
  appName: string;
  appIndex: number;
  category: string;
  seconds: number;
}[] {
  return UsageStats.getStats();
}

export function getTotalTimeSpent(): {
  formatted: string;
  totalMinutes: number;
} {
  return UsageStats.sumTime();
}

export function getWeeklyTime(): {
  dayIndex: number;
  label: string;
  value: number;
}[] {
  return UsageStats.getWeeklyTime();
}

export function getWeeklyAppStats(): {
  packageName: string;
  appName: string;
  appIndex: number;
  category: string;
  seconds: number;
  icon: string;
}[] {
  return UsageStats.getWeeklyAppStats();
}

export function getDailyStreak(): {
  streak: number;
  todayMinutes: number;
  successToday: boolean;
  limitMinutes: number;
} {
  return UsageStats.getDailyStreak();
}

export function getWeeklyStreak(): {
  day: string;
  minutes: number;
  success: boolean;
}[] {
  return UsageStats.getWeeklyStreak();
}

export default UsageStats;
