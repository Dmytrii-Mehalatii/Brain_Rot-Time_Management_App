import UsageStats from "@/modules/usage-stats";
import { GenericStatsType, PermissionChangedEvent } from "@/types";
import { EventEmitter } from "expo-modules-core";
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
    const emitter = new EventEmitter(UsageStats);

    const updateWithRetry = () => {
      let attempts = 0;

      const tryFetch = () => {
        const next = getGenericStats();

        if (next.stats.length === 0 && attempts < 3) {
          attempts++;
          setTimeout(tryFetch, 500);
        } else {
          setState((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(next)) {
              return prev;
            }

            return next;
          });
        }
      };

      tryFetch();
    };

    const sub = emitter.addListener(
      "onPermissionChanged",
      (e: PermissionChangedEvent) => {
        if (e.granted) {
          updateWithRetry();
        }
      },
    );

    updateWithRetry();
    return () => sub.remove();
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
