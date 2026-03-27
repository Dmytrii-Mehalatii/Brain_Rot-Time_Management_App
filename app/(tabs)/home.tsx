import BaseModal from "@/components/BaseModal";
import Battery from "@/components/Battery";
import BrainMap from "@/components/BrainMap";
import EnemyList from "@/components/EnemyList";
import EnemyModal from "@/components/EnemyModal";
import MainImage from "@/components/MainImage";
import Streak from "@/components/Streak";
import { useModal } from "@/hooks/useModal";
import { useTheme } from "@/hooks/useTheme";
import useUserWeeklyStats from "@/hooks/useUserGenericStats";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Home() {
  const { themeColor } = useTheme();
  const { stats, formatedTime, timeInMinutes } = useUserWeeklyStats();

  const { activeModal, setActiveModal } = useModal();
  const { width: screenWidth } = useWindowDimensions();

  const MAX_MINUTES = 540;
  const baseFreshness = 1 - Math.min(timeInMinutes / MAX_MINUTES, 1);

  const { width } = Dimensions.get("window");
  const isSmall = width < 380;

  const router = useRouter();
  const translateX = useSharedValue(0);

  const onRedirectRight = () => {
    router.push("/(tabs)/whatIf");
  };

  const onRedirectLeft = () => {
    router.push("/(tabs)/stats");
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
      translateX.value = e.translationX * 0.6;
    })
    .onEnd(() => {
      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-screenWidth, { duration: 150 }, () => {
          runOnJS(onRedirectRight)();
        });
      } else if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(screenWidth, { duration: 150 }, () => {
          runOnJS(onRedirectLeft)();
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
        className="flex-1 justify-center items-center">
        <ScrollView
          className="w-[100%]"
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View className="flex-1 justify-center items-center">
            <EnemyModal
              isVisible={activeModal === "enemies"}
              setIsVisible={() => setActiveModal(null)}
              stats={stats}
              date="day"
            />

            <BaseModal
              visible={activeModal === "brain"}
              onClose={() => setActiveModal(null)}>
              <BrainMap />
            </BaseModal>

            <BaseModal
              visible={activeModal === "streak"}
              onClose={() => setActiveModal(null)}>
              <Streak />
            </BaseModal>

            <View className="w-full flex-shrink">
              <MainImage />
            </View>

            <View
              className={`w-full ${isSmall ? "px-8 gap-4" : "px-12 gap-6"} h-fit py-3 flex-col`}>
              <View className="w-full flex-col gap-6">
                <Text
                  style={{ fontFamily: "SpaceGroteskMedium" }}
                  className={`${isSmall ? "text-3xl" : "text-[28px]"} uppercase text-[#212121]`}>
                  <Text
                    style={{ color: themeColor }}
                    className="w-full text-center lowercase ">
                    {formatedTime}
                  </Text>{" "}
                  wasted today
                </Text>
                <View className="flex-row w-full items-center justify-start">
                  <Battery />
                  <Text
                    style={{ fontFamily: "SpaceGroteskRegular" }}
                    className="ml-2 text-left text-xl w-full flex-shrink">
                    Your energy:{"  "}
                    <Text
                      style={{
                        fontFamily: "SpaceGroteskBold",
                        color: themeColor,
                        fontSize: isSmall ? 20 : 18,
                      }}>
                      {Math.round(baseFreshness * 100)}%
                    </Text>
                  </Text>
                </View>
              </View>

              <View className="w-full gap-3">
                <View className="w-full flex-row items-center">
                  <Text
                    className={`w-full flex-shrink ${isSmall ? "text-lg" : "text-xl"}`}
                    style={{ fontFamily: "SpaceGroteskRegular" }}>
                    Todays Biggest Enemies:
                  </Text>
                  {stats.length < 4 ? (
                    ""
                  ) : (
                    <Pressable onPress={() => setActiveModal("enemies")}>
                      <Text
                        style={{
                          fontFamily: "SpaceGroteskMedium",
                          color: themeColor,
                        }}
                        className="underline">
                        see more
                      </Text>
                    </Pressable>
                  )}
                </View>

                <EnemyList data={stats.slice(0, 3)} />
              </View>
            </View>
            <Text className="text-sm text-gray-500">
              *We don’t track how long you use our app
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}
