import UsageStats from "@/modules/usage-stats";
import { GenericStatsType } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type UserGenericStatsContextType = {
  stats: GenericStatsType[];
  formatedTime: string | null;
  timeInMinutes: number;
};

const UserStatsContext = createContext<UserGenericStatsContextType | null>(
  null,
);

function getGenericStats(): UserGenericStatsContextType {
  const stats = UsageStats.getStats();

  const time = UsageStats.sumTime();
  const formatedTime = time.formatted;
  const timeInMinutes = time.totalMinutes;

  return {
    stats,
    formatedTime,
    timeInMinutes,
  };
}

export function UserGenericStatsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<UserGenericStatsContextType>(() =>
    getGenericStats(),
  );

  useEffect(() => {
    const updatedStats = () => {
      setState((prev) => {
        const next = getGenericStats();

        if (JSON.stringify(prev) === JSON.stringify(next)) {
          return prev;
        }

        return next;
      });
    };

    const interval = setInterval(updatedStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = useMemo(() => state, [state]);

  return (
    <UserStatsContext.Provider value={value}>
      {children}
    </UserStatsContext.Provider>
  );
}

export default function useUserGenericStats() {
  const ctx = useContext(UserStatsContext);
  if (!ctx) {
    throw new Error("useUserStats must be used within UserStatsProvider");
  }
  return ctx;
}
