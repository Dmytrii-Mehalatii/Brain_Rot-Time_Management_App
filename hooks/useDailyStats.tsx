import UsageStats from "@/modules/usage-stats";
import type { AppUsageStat } from "@/types";
import { createStrictContext } from "@/utils/createStrictContext";
import type { PropsWithChildren } from "react";
import { useUsageSnapshot } from "./useUsageSnapshot";

type DailyStats = {
  /** Today's apps ranked by time spent. */
  apps: AppUsageStat[];
  /** Today's total as "Xh Ym". */
  formattedTime: string;
  totalMinutes: number;
};

const [DailyStatsContextProvider, useDailyStats] =
  createStrictContext<DailyStats>("DailyStatsProvider");

function readDailyStats(): DailyStats {
  const { formatted, totalMinutes } = UsageStats.sumTime();
  return {
    apps: UsageStats.getStats(),
    formattedTime: formatted,
    totalMinutes,
  };
}

const isEmpty = (stats: DailyStats) => stats.apps.length === 0;

export function DailyStatsProvider({ children }: PropsWithChildren) {
  const stats = useUsageSnapshot(readDailyStats, isEmpty);
  return (
    <DailyStatsContextProvider value={stats}>
      {children}
    </DailyStatsContextProvider>
  );
}

export { useDailyStats };
