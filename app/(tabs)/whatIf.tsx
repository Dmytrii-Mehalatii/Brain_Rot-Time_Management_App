import CardGroup from "@/components/CardGroup";
import Divider from "@/components/Divider";
import { WHAT_IF_GROUPS } from "@/constants/whatIfCards";
import { useDailyStats } from "@/hooks/useDailyStats";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useTheme } from "@/hooks/useTheme";
import { Fragment } from "react";
import { ScrollView, Text } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

export default function WhatIf() {
  const { formattedTime } = useDailyStats();
  const { themeColor } = useTheme();
  const isSmall = useIsSmallScreen();
  const { gesture, animatedStyle } = useSwipeNavigation({
    onSwipeRight: "/(tabs)/home",
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={animatedStyle}
        className={`mt-8 flex-1 items-center gap-3 ${isSmall ? "px-8" : "px-12"}`}>
        <Text
          className={`font-['SpaceGroteskMedium'] uppercase ${isSmall ? "text-[22px]" : "text-[24px]"}`}>
          <Text
            className="text-[26px] lowercase"
            style={{ color: themeColor }}>
            {formattedTime}
          </Text>{" "}
          What&apos;s the cost?
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          {WHAT_IF_GROUPS.map((group, index) => (
            <Fragment key={group.key}>
              <CardGroup group={group} />
              {index < WHAT_IF_GROUPS.length - 1 && (
                <Divider className="mt-4" />
              )}
            </Fragment>
          ))}
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}
