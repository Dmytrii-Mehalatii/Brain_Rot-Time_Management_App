import AppIcon from "@/components/AppIcon";
import Divider from "@/components/Divider";
import colors from "@/constants/colors";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { useTheme } from "@/hooks/useTheme";
import type { AppUsageStat } from "@/types";
import { formatMinutes, secondsToMinutes } from "@/utils/time";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type EnemyModalProps = {
  visible: boolean;
  onClose: () => void;
  /** Ranked apps; the first three become the podium. */
  apps: AppUsageStat[];
  period: "day" | "week";
};

const RANK_TITLES: Record<number, string> = {
  1: "Final Boss",
  2: "Brain Melter",
  3: "Time Eater",
};

/** Dragging the sheet down further than this closes it. */
const CLOSE_DRAG_DISTANCE = 240;
/** Beyond this many apps the list scrolls, so hint at it with a fade. */
const SCROLL_HINT_THRESHOLD = 8;

export default function EnemyModal({
  visible,
  onClose,
  apps,
  period,
}: EnemyModalProps) {
  const { themeColor } = useTheme();
  const isSmall = useIsSmallScreen();
  const translateY = useSharedValue(0);

  // Winner in the middle, runner-up on the left, like a podium.
  const podium = [apps[1], apps[0], apps[2]].filter(Boolean);
  const rest = apps.slice(3);

  useEffect(() => {
    if (visible) translateY.value = 0;
  }, [visible, translateY]);

  const dragToClose = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) translateY.value = event.translationY;
    })
    .onEnd(() => {
      if (translateY.value > CLOSE_DRAG_DISTANCE) {
        scheduleOnRN(onClose);
      } else {
        translateY.value = withTiming(0, { duration: 150 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      {/* A Modal is a separate native window, so gestures need their own root. */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View
          style={sheetStyle}
          className="absolute bottom-0 h-[70%] w-full rounded-t-3xl border-x-[1.5px] border-t-[1.5px] border-black bg-white px-12">
          <GestureDetector gesture={dragToClose}>
            <View>
              <View className="mt-6 w-full flex-row items-center justify-between">
                <Text className="max-w-[80%] flex-shrink font-['SpaceGroteskRegular'] text-2xl text-ink">
                  {period === "day" ? "Today's" : "Weekly"} Biggest Enemies:
                </Text>
                <Pressable onPress={onClose}>
                  <MaterialIcons
                    name="close"
                    color={colors.ink}
                    size={32}
                    className="mt-1"
                  />
                </Pressable>
              </View>

              <View className="mt-5 flex-row">
                {podium.map((app) => (
                  <View
                    key={app.packageName}
                    className={`items-center ${isSmall ? "mx-2 w-[80px]" : "w-[108px]"}`}
                    style={{ marginTop: app.appIndex === 1 ? 0 : 32 }}>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      className="mb-1 text-center font-['SpaceGroteskMedium'] text-base">
                      <Text
                        className={`font-['SpaceGroteskBold'] ${isSmall ? "text-base" : "text-lg"}`}
                        style={{ color: themeColor }}>
                        {app.appIndex}
                      </Text>{" "}
                      {RANK_TITLES[app.appIndex] ?? RANK_TITLES[3]}
                    </Text>
                    <View className="my-2">
                      <AppIcon
                        icon={app.icon}
                        size={48}
                      />
                    </View>
                    <Text
                      className="mt-1 text-center font-['SpaceGroteskRegular'] font-bold"
                      style={{ color: themeColor }}>
                      {formatMinutes(secondsToMinutes(app.seconds), {
                        omitZeroHours: true,
                      })}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </GestureDetector>

          <Divider className="my-6" />

          <View className="flex-1 overflow-hidden">
            <FlashList
              data={rest}
              keyExtractor={(app) => app.packageName}
              renderItem={({ item: app }) => (
                <View className="mb-2 flex-row items-center border-b border-b-gray-300 py-4">
                  <Text className="mr-3 font-['SpaceGroteskMedium']">
                    {app.appIndex}
                  </Text>
                  <AppIcon
                    icon={app.icon}
                    size={28}
                  />
                  <Text
                    className="mx-3 w-full flex-shrink font-['SpaceGroteskRegular']"
                    numberOfLines={1}>
                    {app.appName}
                  </Text>
                  <Text
                    className="font-['SpaceGroteskMedium']"
                    style={{ color: themeColor }}>
                    {formatMinutes(secondsToMinutes(app.seconds))}
                  </Text>
                </View>
              )}
            />
            {apps.length > SCROLL_HINT_THRESHOLD && (
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.05)"]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 40,
                }}
              />
            )}
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}
