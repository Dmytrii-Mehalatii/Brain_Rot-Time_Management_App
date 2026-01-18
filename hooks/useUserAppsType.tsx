import { createContext, ReactNode, useMemo } from "react";
import useUserStats from "./useUserStats";

type AppDetails = {
  type: string;
  time: number;
};

type UserAppsType = {
  appData: AppDetails[];
};

const UserAppsContext = createContext<UserAppsType | null>(null);

export default function UserAppsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { stats } = useUserStats();
  const CATEGORIES = [
    "Game",
    "Audio",
    "Video",
    "Image",
    "Social",
    "News",
    "Maps",
    "Productivity",
    "Accessibility",
    "Education",
    "Finance",
    "Shopping",
    "Health",
    "Undefined",
  ];
  const appData = useMemo(() => {
    const timeMap: Record<string, number> = {};

    stats.forEach((stat: { category: string | number; seconds: number }) => {
      timeMap[stat.category] = (timeMap[stat.category] || 0) + stat.seconds;
    });

    return CATEGORIES.map((cat) => ({
      type: cat,
      time: timeMap[cat] || 0,
    }));
  }, [stats]);

  return (
    <UserAppsContext.Provider value={{ appData }}>
      {children}
    </UserAppsContext.Provider>
  );
}

export function useUserApps() {
  const ctx = createContext(UserAppsContext);
  if (!ctx) {
    throw new Error("useUserApps must be used within UserAppsProvider");
  }
  return ctx;
}
