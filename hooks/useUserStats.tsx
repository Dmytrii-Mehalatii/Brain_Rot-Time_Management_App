import UsageStats from "@/modules/usage-stats";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type AppType = {
  icon: string;
  appName: string;
  appIndex: number;
  seconds: number;
};

type UserStatsContextType = {
  stats: any;
  formatedTime: string | null;
  timeInMinutes: number;
  weeklyData: any;
  weeklyTimeInMinutes: number;
  weeklyAppsTime: any;
};

const UserStatsContext = createContext<UserStatsContextType | null>(null);

export function UserStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<AppType[]>([]);
  const [formatedTime, setFormatedTime] = useState<string | null>(null);
  const [timeInMinutes, setTimeInMinutes] = useState(0);

  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklyTimeInMinutes, setWeeklyTimeInMinutes] = useState(0);

  const [weeklyAppsTime, setWeeklyAppsTime] = useState([]);

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
      console.log(weeklyData);
      weeklyData[1].value = 100;
      weeklyData[3].value = 520;
      setWeeklyData(weeklyData);
      let sum = 0;
      for (let i = 0; i < weeklyData.length; i++) {
        sum += weeklyData[i].value;
      }
      setWeeklyTimeInMinutes(sum);
    };

    handleGetStats();
    handleGetWeeklyAppsTime();
    handleGetFormatedTime();
    handleGetTimeInMinutes();
    handleGetWeeklyTimeInMinutes();

    const interval = setInterval(handleGetStats, 30_000);

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
