import { useFocusEffect, useRouter, type Href } from "expo-router";
import { useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

/** How far (as a fraction of screen width) the finger must travel to commit. */
const COMMIT_THRESHOLD = 0.2;
/** Content follows the finger at less than 1:1 so a swipe feels weighty. */
const DRAG_RESISTANCE = 0.6;
const EXIT_DURATION_MS = 100;

type Options = {
  /** Route to open when the content is dragged to the left. */
  onSwipeLeft?: Href;
  /** Route to open when the content is dragged to the right. */
  onSwipeRight?: Href;
};

/**
 * Horizontal pan that slides the screen out and navigates once the swipe
 * passes the threshold. Directions without a target don't move at all.
 */
export function useSwipeNavigation({ onSwipeLeft, onSwipeRight }: Options) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const threshold = width * COMMIT_THRESHOLD;

  const navigate = (href: Href) => router.push(href);

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      const target = event.translationX < 0 ? onSwipeLeft : onSwipeRight;
      if (target) translateX.value = event.translationX * DRAG_RESISTANCE;
    })
    .onEnd(() => {
      if (onSwipeLeft && translateX.value < -threshold) {
        translateX.value = withTiming(
          -width,
          { duration: EXIT_DURATION_MS },
          () => scheduleOnRN(navigate, onSwipeLeft),
        );
      } else if (onSwipeRight && translateX.value > threshold) {
        translateX.value = withTiming(
          width,
          { duration: EXIT_DURATION_MS },
          () => scheduleOnRN(navigate, onSwipeRight),
        );
      } else {
        translateX.value = withTiming(0, { duration: EXIT_DURATION_MS });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: 1 - Math.abs(translateX.value) / width,
  }));

  // Coming back to this tab must not leave it slid off-screen.
  useFocusEffect(
    useCallback(() => {
      translateX.value = 0;
    }, [translateX]),
  );

  return { gesture, animatedStyle };
}
