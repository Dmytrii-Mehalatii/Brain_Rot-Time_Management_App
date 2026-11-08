import AppIcon from "@/components/AppIcon";
import colors from "@/constants/colors";
import { useTheme } from "@/hooks/useTheme";
import type { AppUsageStat } from "@/types";
import { formatMinutes, secondsToMinutes } from "@/utils/time";
import { Text, View } from "react-native";

const SLOTS = 3;

/** Border color by rank; the palette flips once the brain is past stage 3. */
const RANK_BORDERS = {
  fresh: [colors.primary[700], colors.primary[500], colors.primary[200]],
  rotted: [colors.secondary[800], colors.secondary[700], colors.secondary[500]],
};

const slotClassName =
  "flex-1 flex-row items-center h-[50px] px-1 rounded-md border-2";

/** The top three apps in a fixed row; missing apps show as empty slots. */
export default function EnemyList({ apps }: { apps: AppUsageStat[] }) {
  const { stage, themeColor } = useTheme();
  const borders = stage < 4 ? RANK_BORDERS.fresh : RANK_BORDERS.rotted;

  return (
    <View className="w-full flex-row gap-2">
      {Array.from({ length: SLOTS }, (_, index) => {
        const app = apps[index];
        if (!app) return <EmptySlot key={index} />;

        return (
          <View
            key={app.packageName}
            className={slotClassName}
            style={{
              borderColor: borders[Math.min(app.appIndex - 1, SLOTS - 1)],
            }}>
            <AppIcon
              icon={app.icon}
              size={20}
            />
            <View className="flex-1 justify-center">
              <Text
                numberOfLines={1}
                className="text-center font-['SpaceGroteskRegular'] text-[14px]">
                {app.appName}
              </Text>
              <Text
                className="text-center font-['SpaceGroteskMedium'] text-[14px]"
                style={{ color: themeColor }}>
                {formatMinutes(secondsToMinutes(app.seconds), {
                  omitZeroHours: true,
                })}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function EmptySlot() {
  return (
    <View className={`${slotClassName} border-[#cccccc] bg-[#f5f5f5]`}>
      <View className="h-5 w-5 rounded-full bg-[#ccc]" />
      <View className="flex-1 justify-center">
        <Text className="text-center font-['SpaceGroteskRegular'] text-[14px]">
          Empty
        </Text>
        <Text className="text-center font-['SpaceGroteskMedium'] text-[14px] text-[#7e7e7e]">
          0m
        </Text>
      </View>
    </View>
  );
}
