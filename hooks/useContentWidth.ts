import { MAX_CONTENT_WIDTH } from "@/constants/layout";
import { useWindowDimensions } from "react-native";

/** Width available to screen content once the tablet cap is applied. */
export function useContentWidth(): number {
  return Math.min(useWindowDimensions().width, MAX_CONTENT_WIDTH);
}
