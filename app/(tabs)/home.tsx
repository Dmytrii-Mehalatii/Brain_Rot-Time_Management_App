import Battery from "@/components/Battery";
import EnemyList from "@/components/EnemyList";
import { useTheme } from "@/hooks/useTheme";
import UsageStats from "@/modules/usage-stats";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

export default function Home() {
  const [time, setTime] = useState(null);

  const { value, textColor } = useTheme();
  console.log(value);
  useEffect(() => {
    async function fetchTime() {
      const t = await UsageStats.sumTime();
      setTime(t.formatted);
    }
    fetchTime();
  }, []);

  return (
    <View className="flex-1 justify-center py-10 items-center">
      <View className="h-full flex-shrink">
        <Image
          source={require("@/assets/images/brain2.png")}
          style={{ width: "100%", height: undefined, aspectRatio: 1 }}
          // resizeMode="contain"
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
              {time}
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
                75%
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
              Today's Biggest Enemies:{" "}
            </Text>
            <Text
              style={{ fontFamily: "SpaceGroteskMedium", color: textColor }}
              className="underline">
              see more
            </Text>
          </View>

          <EnemyList />
        </View>
      </View>
    </View>
  );
}
