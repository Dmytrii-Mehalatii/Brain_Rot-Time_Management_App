import { requireNativeModule } from "expo-modules-core";

const UsageStats = requireNativeModule("UsageStats");

export function hasPermission(): boolean {
  return UsageStats.hasPermission();
}

export function requestPermission(): string {
  return UsageStats.requestPermission();
}

export function getStats(): { appName: string; seconds: number }[] {
  return UsageStats.getStats();
}

export function getTotalTimeSpent(): number {
  return UsageStats.getTotalTimeSpent();
}

export default UsageStats;
