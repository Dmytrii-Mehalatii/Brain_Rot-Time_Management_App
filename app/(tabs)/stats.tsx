import useUserStats from "@/hooks/useUserStats";
import UsageStats from "@/modules/usage-stats";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

export default function Stats() {
  const { weeklyData, weeklyTimeInMinutes } = useUserStats();

  const avgTimeSpend = weeklyTimeInMinutes / 7;
  return (
    <View style={{ padding: 16 }}>
      <Text>Permission Status: {String(UsageStats.hasPermission())}</Text>
      <Text>
        {Math.round(avgTimeSpend / 60)}h {Math.round(avgTimeSpend % 60)}m
      </Text>
      <Text>Daily average</Text>
      <View style={{ marginTop: 20, width: "100%" }}>
        <BarChart
          data={weeklyData.map((item) => ({
            ...item,
            frontColor: item.value > 400 ? "#859B80" : "#C86286",
          }))}
          height={144}
          barWidth={46}
          initialSpacing={0}
          spacing={4}
          barBorderTopLeftRadius={8}
          barBorderTopRightRadius={8}
          hideYAxisText={true}
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules={true}
          renderTooltip={(item, index) => (
            <View
              key={index}
              style={{
                position: "absolute",
                top: -20,
                marginBottom: 20,
                backgroundColor: "#C86286",
                padding: 6,
                borderRadius: 4,
              }}>
              <Text style={{ color: "white" }}>{item.value}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
