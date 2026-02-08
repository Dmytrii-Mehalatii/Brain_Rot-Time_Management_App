export type AppType = {
  icon: string;
  appName: string;
  appIndex: number;
  seconds: number;
  packageName: string;
  category: string;
};

export type WeeklyAppsTime = {
  packageName: string;
  appIndex: number;
  appName: string;
  category: string;
  seconds: number;
  icon: string;
};

export type DailyStreakType = {
  streak: number;
  todayMinutes: number;
  successToday: boolean;
  limitMinutes: number;
};

export type WeeklyStreakType = {
  day: string;
  minutes: number;
  success: boolean;
};

export type WeeklyDataType = {
  value: number;
  label: string;
  dayIndex: number;
};

export type GenericStatsType = {
  packageName: string;
  appIndex: number;
  appName: string;
  category: string;
  seconds: number;
  icon: string;
};
