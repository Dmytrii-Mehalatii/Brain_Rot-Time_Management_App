import UsageStats from "@/modules/usage-stats";
import { WeeklyAppsTime, WeeklyDataType } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type UserWeeklyStatsContextType = {
  weeklyData: WeeklyDataType[];
  weeklyTimeInMinutes: number;
  weeklyAppsTime: WeeklyAppsTime[];
};

const UserWeeklyStatsContext = createContext<UserWeeklyStatsContextType | null>(
  null,
);

function getUserWeeklyStats(): UserWeeklyStatsContextType {
  const weeklyData = UsageStats.getWeeklyTime();
  const weeklyTimeInMinutes = weeklyData.reduce(
    (sum: number, item: WeeklyDataType) => sum + item.value,
    0,
  );
  const weeklyAppsTime = UsageStats.getWeeklyAppStats();
  return {
    weeklyData,
    weeklyTimeInMinutes,
    weeklyAppsTime,
  };
}

export function UserWeeklyStatsProvider({ children }: { children: ReactNode }) {
  const [weeklyStats, setWeeklyStats] = useState<UserWeeklyStatsContextType>(
    () => getUserWeeklyStats(),
  );

  useEffect(() => {
    const updatedStats = () => {
      setWeeklyStats((prev) => {
        const next = getUserWeeklyStats();

        if (JSON.stringify(prev) === JSON.stringify(next)) {
          return prev;
        }

        return next;
      });
    };

    const interval = setInterval(updatedStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = useMemo(() => weeklyStats, [weeklyStats]);

  return (
    <UserWeeklyStatsContext.Provider value={value}>
      {children}
    </UserWeeklyStatsContext.Provider>
  );
}

export default function useUserWeeklyStats() {
  const ctx = useContext(UserWeeklyStatsContext);
  if (!ctx) {
    throw new Error(
      "useUserWeeklyStats must be used within UserWeeklyStatsProvider",
    );
  }
  return ctx;
}
