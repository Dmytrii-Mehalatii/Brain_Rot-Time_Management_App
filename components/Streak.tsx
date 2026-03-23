import BrainIcon from "@/assets/icons/brain_icon.svg";
import useUserStats from "@/hooks/useUserStats";
import { Image, Text, View } from "react-native";

export default function Streak() {
  const { dailyStreak, weeklyStreak } = useUserStats();

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

        {dailyStreak.successToday ? (
          <Image
            source={require("@/assets/images/streakBrain.png")}
            style={{ width: "45%", height: undefined, aspectRatio: 1 }}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require("@/assets/images/brokenStreakBrain.png")}
            style={{ width: "50%", height: undefined, aspectRatio: 1 }}
            resizeMode="contain"
          />
        )}
      </View>
      <View className="flex flex-row gap-[14] mt-3 items-center justify-center text-center">
        {weeklyStreak.map((item) => (
          <View
            key={item.day}
            className="flex items-center justify-center w-full flex-shrink">
            {item.success ? (
              <BrainIcon
                fill="#9D1344"
                width={32}
                height={32}
              />
            ) : (
              <BrainIcon
                fill="#677863"
                width={32}
                height={32}
              />
            )}
            <Text className="text-[#212121] font-['SpaceGroteskRegular'] text-sm text-center ">
              {item.day === "Today"
                ? item.day.slice(0, 3)
                : item.day.slice(0, 1)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
