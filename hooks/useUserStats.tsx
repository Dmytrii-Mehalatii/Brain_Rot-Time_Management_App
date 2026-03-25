import UsageStats from "@/modules/usage-stats";
import {
  DailyStreakType,
  GenericStatsType,
  WeeklyAppsTime,
  WeeklyDataType,
  WeeklyStreakType,
} from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type UserStatsContextType = {
  stats: GenericStatsType[];
  formatedTime: string | null;
  timeInMinutes: number;
  weeklyData: WeeklyDataType[];
  weeklyTimeInMinutes: number;
  weeklyAppsTime: WeeklyAppsTime[];
  dailyStreak: DailyStreakType;
  weeklyStreak: WeeklyStreakType[];
};

const UserStatsContext = createContext<UserStatsContextType | null>(null);

function getAllStats(): UserStatsContextType {
  const stats = UsageStats.getStats();
  const weeklyAppsTime = UsageStats.getWeeklyAppStats();
  const time = UsageStats.sumTime();

  const formatedTime = time.formatted;
  const timeInMinutes = time.totalMinutes;

  const weeklyData = UsageStats.getWeeklyTime();
  const weeklyTimeInMinutes = weeklyData.reduce(
    (sum: number, item: WeeklyDataType) => sum + item.value,
    0,
  );

  const dailyStreak = UsageStats.getDailyStreak();
  const weeklyStreak = UsageStats.getWeeklyStreak();

  return {
    stats,
    formatedTime,
    timeInMinutes,
    weeklyData,
    weeklyTimeInMinutes,
    weeklyAppsTime,
    dailyStreak,
    weeklyStreak,
  };
}

export function UserStatsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserStatsContextType>(() => getAllStats());

  useEffect(() => {
    const updatedStats = () => {
      setState((prev) => {
        const next = getAllStats();

        if (JSON.stringify(prev) === JSON.stringify(next)) {
          return prev;
        }

        return next;
      });
    };

    const interval = setInterval(updatedStats, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return (
    <UserStatsContext.Provider value={value}>
      {children}
    </UserStatsContext.Provider>
  );
}

export default function useUserStats() {
  const ctx = useContext(UserStatsContext);
  if (!ctx) {
    throw new Error("useUserStats must be used within UserStatsProvider");
  }
  return ctx;
}
