import type { BrainPartType } from "@/types";
import { useDailyStats } from "./useDailyStats";

/** Which native app categories feed each region of the brain map. */
const CATEGORIES_BY_PART: Record<BrainPartType, string[]> = {
  "Health and Productivity": ["Health", "Education", "Productivity", "Finance"],
  "Social & News": ["Social", "News", "Shopping"],
  "Video & Audio": ["Video", "Audio"],
  Games: ["Game"],
};

export const BRAIN_PART_TYPES = Object.keys(
  CATEGORIES_BY_PART,
) as BrainPartType[];

export function useBrainPartMinutes(): Record<BrainPartType, number> {
  const { apps } = useDailyStats();

  const secondsByCategory: Record<string, number> = {};
  for (const app of apps) {
    secondsByCategory[app.category] =
      (secondsByCategory[app.category] ?? 0) + app.seconds;
  }

  const minutesByPart = {} as Record<BrainPartType, number>;
  for (const part of BRAIN_PART_TYPES) {
    const seconds = CATEGORIES_BY_PART[part].reduce(
      (sum, category) => sum + (secondsByCategory[category] ?? 0),
      0,
    );
    minutesByPart[part] = Math.round(seconds / 60);
  }
  return minutesByPart;
}
