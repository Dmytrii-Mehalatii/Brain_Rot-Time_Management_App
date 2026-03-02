import { useTheme } from "@/hooks/useTheme";
import { GenericStatsType } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CustomFlatList from "./CustomFlatList";

type Props = {
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
  stats: GenericStatsType[];
  date: "day" | "week";
};

export default function EnemyModal({
  isVisible,
  setIsVisible,
  stats,
  date,
}: Props) {
  const { themeColor } = useTheme();

  const swapedArray = [...stats.slice(0, 3)];
  [swapedArray[0], swapedArray[1]] = [swapedArray[1], swapedArray[0]];

  const translateY = useSharedValue(0);

  const onCloseModal = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  useEffect(() => {
    if (isVisible) {
      translateY.value = 0;
    }
  }, [isVisible, translateY]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value > 240) {
        runOnJS(onCloseModal)();
      } else {
        translateY.value = withTiming(0, { duration: 150 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}>
      <View className="w-full h-full">
        <GestureHandlerRootView>
          <Animated.View
            style={[animatedStyle]}
            className="h-[70%] rounded-t-3xl absolute bottom-0 border-[#000] border-t-[1.5px] px-12 border-x-[1.5px] bg-white w-full opacity-100">
            <GestureDetector gesture={panGesture}>
              <View>
                <View className="flex-row w-full justify-center items-center mt-6">
                  <Text
                    style={{ fontFamily: "SpaceGroteskRegular" }}
                    className="color-[#212121] text-2xl w-full flex-shrink">
                    {date === "day" ? "Today's" : "Weekly"} Biggest Enemies:
                  </Text>
                  <Pressable onPress={() => setIsVisible(false)}>
                    <MaterialIcons
                      name="close"
                      color="#000"
                      size={32}
                      className="mt-1"
                    />
                  </Pressable>
                </View>

                <View className="items-center mt-5 h-fit">
                  <CustomFlatList
                    data={swapedArray}
                    isHorizontal={true}
                    isScrollEnabled={false}
                    renderItem={(item, { hours, minutes }) => (
                      <View
                        style={{
                          marginTop:
                            item.appIndex === 2 || item.appIndex === 3 ? 32 : 0,
                        }}
                        className="items-center w-[108px] ">
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{ fontFamily: "SpaceGroteskMedium" }}
                          className="text-center text-base mb-1">
                          <Text
                            style={{
                              fontFamily: "SpaceGroteskBold",
                              color: themeColor,
                            }}
                            className="text-lg">
                            {item.appIndex}
                          </Text>{" "}
                          {item.appIndex === 1
                            ? "Final Boss"
                            : item.appIndex === 2
                              ? "Brain Melter"
                              : "Time Eater"}
                        </Text>

                        <Image
                          source={{
                            uri: `data:image/png;base64,${item.icon}`,
                          }}
                          style={{
                            width: 48,
                            height: 48,
                            marginVertical: 8,
                          }}
                        />

                        <Text
                          style={{
                            fontFamily: "SpaceGroteskRegular",
                            color: themeColor,
                          }}
                          className="text-center font-bold mt-1">
                          {hours > 0 ? `${hours}h ` : ""}
                          {minutes}m
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>
            </GestureDetector>

            <View className="bg-black h-[1px] my-6" />

            <View className="max-h-[328px] overflow-hidden">
              <CustomFlatList
                isHorizontal={false}
                isScrollEnabled={true}
                data={stats.slice(3)}
                renderItem={(item, { hours, minutes }) => (
                  <View className="flex-row items-center h-fit py-4 border-b-gray-300 border-b-[1px] mb-2">
                    <Text className="font-['SpaceGroteskMedium'] mr-3">
                      {item.appIndex}
                    </Text>
                    <Image
                      source={{
                        uri: `data:image/png;base64,${item.icon}`,
                      }}
                      style={{ width: 28, height: 28 }}
                    />
                    <Text
                      className="w-full mx-3 flex-shrink font-['SpaceGroteskRegular']"
                      numberOfLines={1}>
                      {item.appName}
                    </Text>

                    <Text
                      style={{
                        fontFamily: "SpaceGroteskMedium",
                        color: themeColor,
                      }}>
                      {hours}h {minutes}m
                    </Text>
                  </View>
                )}
              />
              {stats.length > 8 && (
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
      </View>
    </Modal>
  );
}
