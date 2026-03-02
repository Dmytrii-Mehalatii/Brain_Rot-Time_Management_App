import EnemyList from "@/components/EnemyList";
import EnemyModal from "@/components/EnemyModal";
import { useModal } from "@/hooks/useModal";
import { useTheme } from "@/hooks/useTheme";
import useUserStats from "@/hooks/useUserStats";
import { WeeklyDataType } from "@/types";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BarChart, PieChart } from "react-native-gifted-charts";

export default function Stats() {
  const { weeklyData, weeklyTimeInMinutes, weeklyAppsTime } = useUserStats();
  const { themeColor } = useTheme();

  const avgTimeSpend = weeklyTimeInMinutes / 7;

  const { activeModal, setActiveModal } = useModal();

  const weeklyTimeWithoutSleepInMinutes = 7140; //avg sleeping time is 7 h per day

  const wastedWeeklyTime = Math.floor(
    (weeklyTimeInMinutes / weeklyTimeWithoutSleepInMinutes) * 100,
  );
  const savedWeeklyTime =
    100 -
    Math.floor((weeklyTimeInMinutes / weeklyTimeWithoutSleepInMinutes) * 100);

  const [selectedSlice, setSelectedSlice] = useState<number>(0);

  const pieData = useMemo(() => {
    const base = [
      { value: savedWeeklyTime, color: "#C86286", key: "pink" },
      { value: wastedWeeklyTime, color: "#859B80", key: "green" },
    ];

    return base.map((item, idx) => ({
      ...item,
      onPress: () => setSelectedSlice(idx),
    }));
  }, [wastedWeeklyTime, savedWeeklyTime]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={{ paddingHorizontal: 40, paddingVertical: 32 }}>
        <EnemyModal
          isVisible={activeModal === "weeklyEnemies"}
          setIsVisible={() => setActiveModal(null)}
          stats={weeklyAppsTime}
          date="week"
        />
        <Text className=" text-[#212121] font-['SpaceGroteskMedium'] text-4xl">
          {Math.floor(avgTimeSpend / 60)}h {Math.round(avgTimeSpend % 60)}m
        </Text>
        <Text className="text-[#212121] font-['SpaceGroteskRegular'] text-2xl">
          Daily average
        </Text>
        <View style={{ marginTop: 20, marginLeft: -55, width: "125%" }}>
          <BarChart
            data={weeklyData.map((item) => ({
              ...item,
              frontColor: item.value > 300 ? "#859B80" : "#C86286",
            }))}
            height={124}
            barWidth={45}
            initialSpacing={40}
            spacing={2}
            barBorderTopLeftRadius={8}
            barBorderTopRightRadius={8}
            endSpacing={40}
            hideYAxisText={true}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules={true}
            renderTooltip={(item: WeeklyDataType) => {
              if (!item) return null;

              const hours = Math.floor(item.value / 60);
              const minutes = Math.round(item.value % 60);

              return (
                <View
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
          <Text className="w-full flex-shrink text-xl font-['SpaceGroteskRegular']">
            Weekly Time Spending:
          </Text>
          <View className="flex flex-row w-full mt-5 items-center">
            <View className="w-[160px] flex flex-col justify-between items-center">
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

              <View className="flex flex-row mt-5">
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
            <Text className="w-full text-center text-[15px] font-['SpaceGroteskRegular'] leading-5 flex-shrink">
              This chart compares your active screen time against reclaimed
              time. To reflect your actual availability, calculations assume a
              standard 16-hour waking day
            </Text>
          </View>
        </View>
        <View className="bg-black h-[1.25px] my-10" />
        <View className="flex">
          <View className="w-full flex-row items-center mb-4">
            <Text className="w-full flex-shrink text-xl font-['SpaceGroteskRegular']">
              Weekly Biggest Enemies:
            </Text>
            {weeklyAppsTime.length < 4 ? (
              ""
            ) : (
              <Pressable onPress={() => setActiveModal("weeklyEnemies")}>
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
          <View className="w-full flex-row items-stretch">
            <EnemyList
              data={weeklyAppsTime.slice(0, 3)}
              width={104}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
