import colors from "@/constants/colors";
import { useState } from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const WAKING_HOURS_PER_DAY = 17;
const WEEKLY_WAKING_MINUTES = WAKING_HOURS_PER_DAY * 60 * 7;

/** Donut of the week's waking time split into screen time and everything else. */
export default function ScreenTimeShareChart({
  weeklyMinutes,
}: {
  weeklyMinutes: number;
}) {
  const [selectedSlice, setSelectedSlice] = useState(0);

  const wastedPercent = Math.min(
    100,
    Math.floor((weeklyMinutes / WEEKLY_WAKING_MINUTES) * 100),
  );

  const slices = [
    {
      label: "Saved",
      value: 100 - wastedPercent,
      color: colors.primary[300],
      swatch: "bg-primary-300",
    },
    {
      label: "Wasted",
      value: wastedPercent,
      color: colors.secondary[600],
      swatch: "bg-secondary-600",
    },
  ];

  const pieData = slices.map((slice, index) => ({
    value: slice.value,
    color: slice.color,
    onPress: () => setSelectedSlice(index),
  }));

  return (
    <View className="mt-5 w-full flex-row items-center">
      <View className="w-[160px] items-center justify-between">
        <PieChart
          donut
          radius={60}
          innerRadius={40}
          data={pieData}
          centerLabelComponent={() => (
            <Text className="font-['SpaceGroteskMedium'] text-xl text-ink">
              {slices[selectedSlice].value}%
            </Text>
          )}
        />

        <View className="mt-5 flex-row gap-4">
          {slices.map((slice) => (
            <View
              key={slice.label}
              className="flex-row items-center">
              <View className={`mr-1 h-4 w-4 rounded-[3px] ${slice.swatch}`} />
              <Text>{slice.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text className="w-full flex-shrink text-center font-['SpaceGroteskRegular'] text-[15px] leading-5">
        This chart compares your active screen time against reclaimed time. To
        reflect your actual availability, calculations assume a standard{" "}
        {WAKING_HOURS_PER_DAY}-hour waking day
      </Text>
    </View>
  );
}
