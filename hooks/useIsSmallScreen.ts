import { useWindowDimensions } from "react-native";

const SMALL_SCREEN_MAX_WIDTH = 380;

/** Compact phones get tighter spacing and smaller type. */
export function useIsSmallScreen(): boolean {
  return useWindowDimensions().width < SMALL_SCREEN_MAX_WIDTH;
}
