import UsageStats from "@/modules/usage-stats";
import { DailyStreakType, WeeklyStreakType } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type UserStreakStatsContextType = {
  dailyStreak: DailyStreakType;
  weeklyStreak: WeeklyStreakType[];
};

const UserStreakStatsContext = createContext<UserStreakStatsContextType | null>(
  null,
);

function getUserStreakStats(): UserStreakStatsContextType {
  const dailyStreak = UsageStats.getDailyStreak();
  const weeklyStreak = UsageStats.getWeeklyStreak();

  return {
    dailyStreak,
    weeklyStreak,
  };
}

export function UserStreakStatsProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState<UserStreakStatsContextType>(() =>
    getUserStreakStats(),
  );
  useEffect(() => {
    const updatedStreakStats = () => {
      setStreak((prev) => {
        const next = getUserStreakStats();

        if (JSON.stringify(prev) === JSON.stringify(next)) {
          return prev;
        }

        return next;
      });
    };

    updatedStreakStats();
  }, []);

  const value = useMemo(() => streak, [streak]);

  return (
    <UserStreakStatsContext.Provider value={value}>
      {children}
    </UserStreakStatsContext.Provider>
  );
}

export default function useStreakStats() {
  const ctx = useContext(UserStreakStatsContext);
  if (!ctx) {
    throw new Error(
      "useStreakStats must be used within UserStreakStatsProvider",
    );
  }
  return ctx;
}
