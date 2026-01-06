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
};

const UserStatsContext = createContext<UserStatsContextType | null>(null);

export function UserStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<AppType[]>([]);
  const [formatedTime, setFormatedTime] = useState(null);
  const [timeInMinutes, setTimeInMinutes] = useState(0);

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

    handleGetStats();
    handleGetFormatedTime();
    handleGetTimeInMinutes();
  }, []);

  return (
    <UserStatsContext.Provider value={{ stats, formatedTime, timeInMinutes }}>
      {children}
    </UserStatsContext.Provider>
  );
}

export default function useUserStats() {
  const ctx = useContext(UserStatsContext);
  if (!ctx) {
    throw new Error("useTheme must be used within useThemeProvider");
  }
  return ctx;
}
