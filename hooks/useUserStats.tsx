import UsageStats from "@/modules/usage-stats";
import {
  AppType,
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

export function UserStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<AppType[]>([]);
  const [formatedTime, setFormatedTime] = useState<string | null>(null);
  const [timeInMinutes, setTimeInMinutes] = useState(0);

  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklyTimeInMinutes, setWeeklyTimeInMinutes] = useState(0);

  const [weeklyAppsTime, setWeeklyAppsTime] = useState([]);

  const [dailyStreak, setDailyStreak] = useState<DailyStreakType>({
    streak: 0,
    todayMinutes: 0,
    successToday: false,
    limitMinutes: 0,
  });
  const [weeklyStreak, setWeeklyStreak] = useState<WeeklyStreakType[]>([]);

  useEffect(() => {
    const handleGetStats = () => {
      const data = UsageStats.getStats();
      setStats(data);
    };

    const handleGetWeeklyAppsTime = () => {
      const data = UsageStats.getWeeklyAppStats();
      setWeeklyAppsTime(data);
    };

    const handleGetFormatedTime = () => {
      const data = UsageStats.sumTime();

      setFormatedTime(data.formatted);
    };

    const handleGetTimeInMinutes = () => {
      const data = UsageStats.sumTime();
      setTimeInMinutes(data.totalMinutes);
    };

    const handleGetWeeklyTimeInMinutes = () => {
      const weeklyData = UsageStats.getWeeklyTime();
      setWeeklyData(weeklyData);
      let sum = 0;
      for (let i = 0; i < weeklyData.length; i++) {
        sum += weeklyData[i].value;
      }
      setWeeklyTimeInMinutes(sum);
    };

    const handleGetDailyStreak = () => {
      const data = UsageStats.getDailyStreak();
      setDailyStreak(data);
    };

    const handleGetWeeklyStreak = () => {
      const data = UsageStats.getWeeklyStreak();
      setWeeklyStreak(data);
    };

    handleGetStats();
    handleGetWeeklyAppsTime();
    handleGetFormatedTime();
    handleGetTimeInMinutes();
    handleGetWeeklyTimeInMinutes();
    handleGetDailyStreak();
    handleGetWeeklyStreak();

    const interval = setInterval(() => {
      handleGetStats();
      handleGetWeeklyAppsTime();
      handleGetFormatedTime();
      handleGetTimeInMinutes();
      handleGetWeeklyTimeInMinutes();
      handleGetDailyStreak();
      handleGetWeeklyStreak();
    }, 5_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <UserStatsContext.Provider
      value={{
        stats,
        formatedTime,
        timeInMinutes,
        weeklyData,
        weeklyTimeInMinutes,
        weeklyAppsTime,
        dailyStreak,
        weeklyStreak,
      }}>
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
