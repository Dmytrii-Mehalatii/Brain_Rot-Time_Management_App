import colors from "@/constants/colors";
import { createStrictContext } from "@/utils/createStrictContext";
import type { PropsWithChildren } from "react";
import { useDailyStats } from "./useDailyStats";

/** Upper bound of today's minutes for each rot stage; past the last bound is the final stage. */
const STAGE_UPPER_BOUNDS = [120, 180, 270, 360, 420];

const STAGE_COLORS = [
  colors.primary[600],
  colors.primary[500],
  colors.primary[500],
  colors.secondary[600],
  colors.secondary[700],
  colors.secondary[800],
];

export const ROT_STAGES = STAGE_COLORS.length;

type Theme = {
  /** 1 (fresh) … ROT_STAGES (fully rotted), driven by today's screen time. */
  stage: number;
  themeColor: string;
};

const [ThemeContextProvider, useTheme] =
  createStrictContext<Theme>("ThemeProvider");

export function rotStage(totalMinutes: number): number {
  const index = STAGE_UPPER_BOUNDS.findIndex((bound) => totalMinutes <= bound);
  return index === -1 ? ROT_STAGES : index + 1;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const { totalMinutes } = useDailyStats();
  const stage = rotStage(totalMinutes);

  return (
    <ThemeContextProvider
      value={{ stage, themeColor: STAGE_COLORS[stage - 1] }}>
      {children}
    </ThemeContextProvider>
  );
}

export { useTheme };
