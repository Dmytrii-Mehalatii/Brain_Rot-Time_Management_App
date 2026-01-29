import { createContext, ReactNode, useContext, useMemo } from "react";
import useUserStats from "./useUserStats";

type AppDetails = {
  type: string;
  time: number;
};

type UserAppsType = {
  appData: AppDetails[];
  topBrainPart: number;
  secondBrainPart: number;
  thirdBrainPart: number;
  bottomBrainPart: number;
};

const UserAppsContext = createContext<UserAppsType | null>(null);

export default function UserAppsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { stats } = useUserStats();

  const CATEGORIES = [
    "Game", //
    "Audio", //
    "Video", //
    "Image", //
    "Social", //
    "News", //
    "Maps", //
    "Productivity", //
    "Accessibility", //
    "Education", //
    "Finance", //
    "Shopping", //
    "Health", //
    "Undefined",
  ];
  const appData = useMemo(() => {
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
      topBrainPart: topValue / 60,
      secondBrainPart: secondValue / 60,
      thirdBrainPart: thirdValue / 60,
      bottomBrainPart: lastValue / 60,
    };
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
