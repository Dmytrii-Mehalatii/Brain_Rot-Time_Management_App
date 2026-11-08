import UsageStats from "@/modules/usage-stats";
import type { AppUsageStat, WeeklyDayTime } from "@/types";
import { createStrictContext } from "@/utils/createStrictContext";
import type { PropsWithChildren } from "react";
import { useUsageSnapshot } from "./useUsageSnapshot";

type WeeklyStats = {
  /** Last seven days, oldest first. */
  days: WeeklyDayTime[];
  totalMinutes: number;
  /** Apps ranked by time spent over the last seven days. */
  apps: AppUsageStat[];
};

const [WeeklyStatsContextProvider, useWeeklyStats] =
  createStrictContext<WeeklyStats>("WeeklyStatsProvider");

function readWeeklyStats(): WeeklyStats {
  const days = UsageStats.getWeeklyTime();
  return {
    days,
    totalMinutes: days.reduce((sum, day) => sum + day.value, 0),
    apps: UsageStats.getWeeklyAppStats(),
  };
}

const isEmpty = (stats: WeeklyStats) => stats.days.length === 0;

export function WeeklyStatsProvider({ children }: PropsWithChildren) {
  const stats = useUsageSnapshot(readWeeklyStats, isEmpty);
  return (
    <WeeklyStatsContextProvider value={stats}>
      {children}
    </WeeklyStatsContextProvider>
  );
}

export { useWeeklyStats };
