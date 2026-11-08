export type AppUsageStat = {
  packageName: string;
  appName: string;
  /** 1-based rank by time spent, highest first. */
  appIndex: number;
  category: string;
  seconds: number;
  /** PNG icon, base64-encoded, without a data-URI prefix. */
  icon: string;
};

export type TotalTime = {
  formatted: string;
  totalMinutes: number;
};

export type WeeklyDayTime = {
  /** 1 = six days ago … 7 = today. */
  dayIndex: number;
  label: string;
  /** Minutes of screen time. */
  value: number;
};

export type DailyStreak = {
  streak: number;
  todayMinutes: number;
  successToday: boolean;
  limitMinutes: number;
};

export type WeeklyStreakDay = {
  day: string;
  minutes: number;
  success: boolean;
};

export type PermissionChangedEvent = {
  granted: boolean;
};

export type UsageStatsModuleEvents = {
  onPermissionChanged: (event: PermissionChangedEvent) => void;
};
