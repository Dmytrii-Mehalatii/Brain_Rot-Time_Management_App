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
};

const UserStatsContext = createContext<UserStatsContextType | null>(null);

export function UserStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<AppType[]>([]);
  const [formatedTime, setFormatedTime] = useState<string | null>(null);
  const [timeInMinutes, setTimeInMinutes] = useState(0);

  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklyTimeInMinutes, setWeeklyTimeInMinutes] = useState(0);

  useEffect(() => {
    const handleGetStats = () => {
      const data = UsageStats.getStats();
      setStats(data);
    };

    async function handleGetFormatedTime() {
      const data = await UsageStats.sumTime();

      setFormatedTime(data.formatted);
    }

    async function handleGetTimeInMinutes() {
      const data = await UsageStats.sumTime();
      setTimeInMinutes(data.totalMinutes);
    }

    async function handleGetWeeklyTimeInMinutes() {
      const weeklyData = UsageStats.getWeeklyTime();
      weeklyData[1].value = 100;
      weeklyData[2].value = 620;
      weeklyData[3].value = 390;
      weeklyData[5].value = 814;
      setWeeklyData(weeklyData);
      let sum = 0;
      for (let i = 0; i < weeklyData.length; i++) {
        sum += weeklyData[i].value;
      }
      setWeeklyTimeInMinutes(sum);
    }

    handleGetStats();
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
