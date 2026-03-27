import CardGroup from "@/components/CardGroup";
import { useTheme } from "@/hooks/useTheme";
import useUserStats from "@/hooks/useUserGenericStats";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Dimensions, ScrollView, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function WhatIf() {
  const { formatedTime } = useUserStats();
  const { themeColor } = useTheme();

  const { width: screenWidth } = Dimensions.get("window");
  const isSmall = screenWidth < 380;

  const translateX = useSharedValue(0);

  const router = useRouter();

  const onRedirect = () => {
    router.push("/(tabs)/home");
  };

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = 1 - Math.abs(translateX.value) / screenWidth;

    return {
      transform: [{ translateX: translateX.value }],
      opacity,
    };
  });

  const SWIPE_THRESHOLD = screenWidth * 0.3;

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX > 0) {
        translateX.value = e.translationX * 0.6;
      }
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(screenWidth, { duration: 150 }, () => {
          runOnJS(onRedirect)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 150 });
      }
    });

  useFocusEffect(
    useCallback(() => {
      translateX.value = 0;
    }, [translateX]),
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[animatedStyle]}
        className={`flex-1 mt-8 ${isSmall ? "px-8" : "px-12"} flex-col gap-3 items-center`}>
        <Text
          className={`font-['SpaceGroteskMedium'] uppercase ${isSmall ? "text-[22px]" : "text-[24px]"}`}>
          <Text
            className="lowercase text-[26px]"
            style={{ color: themeColor }}>
            {formatedTime}
          </Text>{" "}
          Whats the cost?
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          <CardGroup
            type="knowledge"
            title="Knowledge and Development:"
          />
          <CardGroup
            type="health"
            title="Health and Body:"
          />
          <CardGroup
            type="creativity"
            title="Creativity:"
          />
          <CardGroup
            type="universal"
            title="Universal:"
          />
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}
