import { createContext, ReactNode, useContext, useMemo } from "react";
import useUserStats from "./useUserStats";

type AppDetails = {
  type: string;
  time: number;
};

type BrainPart = {
  time: number;
  type: "Health and Productivity" | "Social & News" | "Video & Audio" | "Games";
};

type UserAppsType = {
  appData: AppDetails[];
  topBrainPart: BrainPart;
  secondBrainPart: BrainPart;
  thirdBrainPart: BrainPart;
  bottomBrainPart: BrainPart;
};

const UserAppsContext = createContext<UserAppsType | null>(null);

export default function UserAppsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { stats } = useUserStats();

  const appData = useMemo(() => {
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
    const timeMap: Record<string, number> = {};

    stats.forEach((stat: { category: string | number; seconds: number }) => {
      timeMap[stat.category] = (timeMap[stat.category] || 0) + stat.seconds;
    });

    const formattedAppData = CATEGORIES.map((cat) => ({
      type: cat,
      time: timeMap[cat] || 0,
    }));

    const topValue =
      (timeMap["Health"] || 0) +
      (timeMap["Education"] || 0) +
      (timeMap["Productivity"] || 0) +
      (timeMap["Finance"] || 0);

    const secondValue =
      (timeMap["Social"] || 0) +
      (timeMap["News"] || 0) +
      (timeMap["Shopping"] || 0);

    const thirdValue = (timeMap["Video"] || 0) + (timeMap["Audio"] || 0);

    const lastValue = timeMap["Game"] || 0;

    return {
      appData: formattedAppData,
      topBrainPart: {
        time: Math.round(topValue / 60),
        type: "Health and Productivity" as const,
      },
      secondBrainPart: {
        time: Math.round(secondValue / 60),
        type: "Social & News" as const,
      },
      thirdBrainPart: {
        time: Math.round(thirdValue / 60),
        type: "Video & Audio" as const,
      },
      bottomBrainPart: {
        time: Math.round(lastValue / 60),
        type: "Games" as const,
      },
    } as UserAppsType;
  }, [stats]);

  return (
    <UserAppsContext.Provider value={appData}>
      {children}
    </UserAppsContext.Provider>
  );
}

export function useUserApps() {
  const ctx = useContext(UserAppsContext);
  if (!ctx) {
    throw new Error("useUserApps must be used within UserAppsProvider");
  }
  return ctx;
}
