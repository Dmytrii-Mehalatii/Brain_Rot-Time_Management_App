import EnemyList from "@/components/EnemyList";
import { useTheme } from "@/hooks/useTheme";
import useUserStats from "@/hooks/useUserStats";
import UsageStats from "@/modules/usage-stats";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";

export default function Stats() {
  const { weeklyData, weeklyTimeInMinutes, weeklyAppsTime } = useUserStats();
  const { textColor } = useTheme();
  const avgTimeSpend = weeklyTimeInMinutes / 7;

  const [selectedSlice, setSelectedSlice] = useState<number>(0);

  const pieData = useMemo(() => {
    const base = [
      { value: 70, color: "#C86286", key: "pink" },
      { value: 30, color: "#859B80", key: "green" },
    ];

    // Attach an onPress handler per slice (library will call it if supported)
    return base.map((item, idx) => ({
      ...item,
      onPress: () => setSelectedSlice(idx),
    }));
  }, []);

  return (
    <View style={{ padding: 32 }}>
      <Text>Permission Status: {String(UsageStats.hasPermission())}</Text>
      <Text className=" text-[#212121] font-['SpaceGroteskMedium'] text-4xl">
        {Math.floor(avgTimeSpend / 60)}h {Math.round(avgTimeSpend % 60)}m
      </Text>
      <Text className="text-[#212121] font-['SpaceGroteskRegular'] text-2xl">
        Daily average
      </Text>
      <View style={{ marginTop: 20, width: "110%" }}>
        <BarChart
          data={weeklyData.map((item) => ({
            ...item,
            frontColor: item.value > 300 ? "#859B80" : "#C86286",
          }))}
          height={124}
          barWidth={44}
          initialSpacing={0}
          spacing={2}
          barBorderTopLeftRadius={8}
          barBorderTopRightRadius={8}
          endSpacing={40}
          hideYAxisText={true}
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules={true}
          renderTooltip={(item, index) => {
            const hours = Math.floor(item.value / 60);
            const minutes = Math.round(item.value % 60);
            return (
              <View
                key={index}
                style={{
                  position: "absolute",
                  left: -3,
                  top: item.value >= 520 ? 12 : -32,
                  transform: [{ translateX: -20 }],
                  backgroundColor: item.value > 300 ? "#4F5C4C" : "#AD154B",
                  paddingVertical: 4,
                  paddingHorizontal: 16,
                  width: 92,
                  borderRadius: 4,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text className="text-white text-base font-['SpaceGroteskMedium']">
                  {hours}h {minutes}m
                </Text>
              </View>
            );
          }}
        />
      </View>

      <View className="bg-black h-[1.5px] my-10" />

      <View className="flex">
        <View className="w-full flex flex-row items-center mb-3 justify-between">
          <Text className="text-[#212121] text-center font-['SpaceGroteskRegular'] text-2xl">
            Weekly Enemies:
          </Text>

          <Text>see more...</Text>
        </View>
        <View className="w-full flex-row items-stretch">
          <EnemyList
            data={weeklyAppsTime.slice(0, 3)}
            width={160}
            horizontal={false}
          />

          <View
            className="w-full flex flex-col items-center border-2 rounded-lg flex-shrink p-2 h-full"
            style={{ borderColor: `${textColor}` }}>
            <Text className="text-[#212121] text-base font-['SpaceGroteskMedium'] text-center mb-2">
              Weekly time comparing?
            </Text>
            <PieChart
              donut
              radius={60}
              innerRadius={40}
              data={pieData}
              centerLabelComponent={() => {
                const percent = pieData[selectedSlice]?.value ?? 0;
                return (
                  <Text className="text-[#212121] text-xl font-['SpaceGroteskMedium']">
                    {percent}%
                  </Text>
                );
              }}
            />

            <View className="flex flex-row mt-2">
              <View className="flex flex-row mr-4 items-center">
                <View className="w-4 h-4 mr-1 bg-primary-300 font-['SpaceGroteskRegular'] rounded-[3px]" />
                <Text>Saved</Text>
              </View>

              <View className="flex flex-row items-center">
                <View className="w-4 h-4 mr-1 bg-secondary-600 font-['SpaceGroteskRegular'] rounded-[3px]" />
                <Text>Wasted</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
