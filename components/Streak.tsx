import BrainIcon from "@/assets/icons/brain_icon.svg";
import colors from "@/constants/colors";
import { useStreakStats } from "@/hooks/useStreakStats";
import type { WeeklyStreakDay } from "@/types";
import { Image } from "expo-image";
import { Text, View } from "react-native";

const ALIVE = colors.primary[600];
const BROKEN = colors.secondary[700];

export default function Streak() {
  const { dailyStreak, weeklyStreak } = useStreakStats();
  const hasStreak = dailyStreak.streak > 0;

  return (
    <View className="px-6">
      <View className="mt-14 w-full flex-row items-center justify-between">
        <View className="w-full flex-shrink">
          <Text
            className="font-['SpaceGroteskBold'] text-6xl"
            style={{ color: hasStreak ? ALIVE : BROKEN }}>
            {dailyStreak.streak}
          </Text>
          <Text className="font-['SpaceGroteskMedium'] text-2xl">
            Day&apos;s Streak
          </Text>
          <Text className="mt-1 text-sm opacity-70">
            {hasStreak
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

      <View className="mt-3 flex-row items-center justify-center gap-[14]">
        {weeklyStreak.map((day) => (
          <StreakDay
            key={day.day}
            day={day}
          />
        ))}
      </View>
    </View>
  );
}

function StreakDay({ day }: { day: WeeklyStreakDay }) {
  return (
    <View className="w-full flex-shrink items-center justify-center">
      <BrainIcon
        fill={day.success ? ALIVE : BROKEN}
        width={32}
        height={32}
      />
      <Text className="text-center font-['SpaceGroteskRegular'] text-sm text-ink">
        {day.day === "Today" ? day.day.slice(0, 3) : day.day.slice(0, 1)}
      </Text>
    </View>
  );
}
