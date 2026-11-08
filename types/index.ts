export type {
  AppUsageStat,
  DailyStreak,
  PermissionChangedEvent,
  TotalTime,
  WeeklyDayTime,
  WeeklyStreakDay,
} from "@/modules/usage-stats/types";

export type BrainPartType =
  "Health and Productivity" | "Social & News" | "Video & Audio" | "Games";

export type BrainPartShape = {
  viewBox: string;
  paths: { tone: "base" | "accent"; d: string }[];
};
