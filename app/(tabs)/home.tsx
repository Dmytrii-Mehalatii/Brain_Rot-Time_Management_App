import Battery from "@/components/Battery";
import BrainMapModal from "@/components/BrainMapModal";
import EnemyList from "@/components/EnemyList";
import EnemyModal from "@/components/EnemyModal";
import { useBrainMap } from "@/hooks/useBrainMap";
import { useTheme } from "@/hooks/useTheme";
import useUserStats from "@/hooks/useUserStats";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

export default function Home() {
  const { textColor } = useTheme();
  const { stats, formatedTime, timeInMinutes } = useUserStats();

  const [isEnemiesModalVisible, setIsEnemiesModalVisible] = useState(false);
  const { isBrainModalVisible } = useBrainMap();

  const MAX_MINUTES = 540;
  const baseFreshness = 1 - Math.min(timeInMinutes / MAX_MINUTES, 1);

  return (
    <View className="flex-1 justify-center py-10 items-center">
      {isEnemiesModalVisible && (
        <EnemyModal
          isVisible={isEnemiesModalVisible}
          setIsVisible={setIsEnemiesModalVisible}
          stats={stats}
          date="day"
        />
      )}

      {isBrainModalVisible && <BrainMapModal />}

      <View className="h-full flex-shrink">
        <Image
          source={require("@/assets/images/brain2.png")}
          style={{ width: "110%", height: undefined, aspectRatio: 1 }}
          resizeMode="contain"
        />
      </View>
      <View className="w-full px-12 py-3 flex-col gap-8">
        <View className="w-full flex-col gap-5">
          <Text
            style={{ fontFamily: "SpaceGroteskMedium" }}
            className="text-[28px] uppercase text-[#212121]">
            <Text
              style={{ color: textColor }}
              className="w-full text-center lowercase ">
              {formatedTime}
            </Text>{" "}
            wasted today
          </Text>
          <View className="flex-row w-full items-center justify-center gap-3">
            <Battery />
            <Text
              style={{ fontFamily: "SpaceGroteskRegular" }}
              className="text-xl flex-2/3 text-center">
              Your Brain is{" "}
              <Text
                style={{ fontFamily: "SpaceGroteskBold", color: textColor }}>
                {Math.round(baseFreshness * 100)}%
              </Text>{" "}
              fresh
            </Text>
          </View>
        </View>

        <View className="w-full gap-3">
          <View className="w-full flex-row items-center">
            <Text
              className="w-full flex-shrink text-xl"
              style={{ fontFamily: "SpaceGroteskRegular" }}>
              Todays Biggest Enemies:{" "}
            </Text>
            <Pressable onPress={() => setIsEnemiesModalVisible(true)}>
              <Text
                style={{ fontFamily: "SpaceGroteskMedium", color: textColor }}
                className="underline">
                see more
              </Text>
            </Pressable>
          </View>

          <EnemyList
            data={stats.slice(0, 3)}
            width={104}
          />
        </View>
      </View>
    </View>
  );
}
