import type { ViewStyle } from "react-native";

/**
 * Above this width (unfolded foldables, tablets) screens stop stretching and
 * render as a centered phone-width column instead.
 */
export const MAX_CONTENT_WIDTH = 520;

export const contentColumn = {
  width: "100%",
  maxWidth: MAX_CONTENT_WIDTH,
  alignSelf: "center",
} satisfies ViewStyle;
