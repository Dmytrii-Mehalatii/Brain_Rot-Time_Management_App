import BrainIcon from "@/assets/icons/brain_icon.svg";
import useStreakStats from "@/hooks/useStreakStats";
import { WeeklyStreakType } from "@/types";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

const StreakDayItem: React.FC<{ item: WeeklyStreakType }> = React.memo(
  ({ item }) => {
    return (
      <View className="flex items-center justify-center w-full flex-shrink">
        <BrainIcon
          fill={item.success ? "#9D1344" : "#677863"}
          width={32}
          height={32}
        />
        <Text className="text-[#212121] font-['SpaceGroteskRegular'] text-sm text-center ">
          {item.day === "Today" ? item.day.slice(0, 3) : item.day.slice(0, 1)}
        </Text>
      </View>
    );
  },
);

StreakDayItem.displayName = "StreakDayItem";

export default function Streak() {
  const { dailyStreak, weeklyStreak } = useStreakStats();

  return (
    <View className="px-6">
      <View className="flex flex-row w-full items-center justify-between mt-14">
        <View className="w-full flex-shrink">
          <Text
            className="font-['SpaceGroteskBold'] text-6xl "
            style={{ color: dailyStreak.streak > 0 ? "#9D1344" : "#677863" }}>
            {dailyStreak.streak}
          </Text>
          <Text className="font-['SpaceGroteskMedium'] text-2xl">
            Day&apos;s Streak
          </Text>
          <Text className="text-sm opacity-70 mt-1">
            {dailyStreak.streak > 0
              ? "*Stay under 4h today to keep it going!"
              : "*Spend less than 4h today to start your streak!"}
          </Text>
        </View>

        <Image
          source={
            dailyStreak.successToday
              ? require("@/assets/images/streakBrain.png")
              : require("@/assets/images/brokenStreakBrain.png")
          }
          style={{
            width: dailyStreak.successToday ? "45%" : "50%",
            height: undefined,
            aspectRatio: 1,
          }}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      </View>
      <View className="flex flex-row gap-[14] mt-3 items-center justify-center text-center">
        {weeklyStreak.map((item) => (
          <StreakDayItem
            item={item}
            key={item.day}
          />
        ))}
      </View>
    </View>
  );
}
