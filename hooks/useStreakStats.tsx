import UsageStats from "@/modules/usage-stats";
import type { DailyStreak, WeeklyStreakDay } from "@/types";
import { createStrictContext } from "@/utils/createStrictContext";
import type { PropsWithChildren } from "react";
import { useUsageSnapshot } from "./useUsageSnapshot";

type StreakStats = {
  dailyStreak: DailyStreak;
  /** Last seven days, oldest first. */
  weeklyStreak: WeeklyStreakDay[];
};

const [StreakStatsContextProvider, useStreakStats] =
  createStrictContext<StreakStats>("StreakStatsProvider");

function readStreakStats(): StreakStats {
  return {
    dailyStreak: UsageStats.getDailyStreak(),
    weeklyStreak: UsageStats.getWeeklyStreak(),
  };
}

const isEmpty = (stats: StreakStats) => stats.weeklyStreak.length === 0;

export function StreakStatsProvider({ children }: PropsWithChildren) {
  const stats = useUsageSnapshot(readStreakStats, isEmpty);
  return (
    <StreakStatsContextProvider value={stats}>
      {children}
    </StreakStatsContextProvider>
  );
}

export { useStreakStats };
