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

export default UsageStats;
