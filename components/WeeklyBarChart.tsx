import colors from "@/constants/colors";
import { useContentWidth } from "@/hooks/useContentWidth";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import type { WeeklyDayTime } from "@/types";
import { formatMinutes } from "@/utils/time";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const BARS = 7;
const CHART_HEIGHT = 124;
const TOOLTIP_WIDTH = 92;
/** Days above this many minutes switch from the pink to the "rotted" green. */
const HIGH_USAGE_MINUTES = 300;

type WeeklyBarChartProps = {
  days: WeeklyDayTime[];
  averageMinutes: number;
};

export default function WeeklyBarChart({
  days,
  averageMinutes,
}: WeeklyBarChartProps) {
  const contentWidth = useContentWidth();
  const isSmall = useIsSmallScreen();

  const chartWidth = contentWidth - 80;
  const barWidth = contentWidth < 340 ? 24 : isSmall ? 30 : 35;
  const spacing = (chartWidth - barWidth * BARS) / (BARS + 1);

  const data = days.map((day) => ({
    ...day,
    frontColor:
      day.value > HIGH_USAGE_MINUTES
        ? colors.secondary[600]
        : colors.primary[300],
  }));

  const renderTooltip = (day: WeeklyDayTime | undefined, index: number) => {
    if (!day) return null;

    // Tall bars would push the label off the top, so it drops below the tip;
    // the outermost bars nudge inward to stay inside the chart.
    const isTall = day.value > 180 || day.value > averageMinutes;
    const edgeShift = index === 0 ? 30 : index === BARS - 1 ? -30 : 0;

    return (
      <View
        style={{
          backgroundColor:
            day.value > HIGH_USAGE_MINUTES
              ? colors.secondary[800]
              : colors.primary[500],
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 4,
          alignItems: "center",
          justifyContent: "center",
          width: TOOLTIP_WIDTH,
          marginLeft: -(TOOLTIP_WIDTH - barWidth) / 2 + edgeShift,
          bottom: isTall ? -35 : 10,
          zIndex: 1000,
        }}>
        <Text className="font-['SpaceGroteskMedium'] text-[12px] text-white">
          {formatMinutes(day.value)}
        </Text>
      </View>
    );
  };

  return (
    <View className="mb-10 h-[124] w-full items-center justify-center">
      <View
        style={{
          marginTop: 36,
          width: "100%",
          position: "absolute",
          left: "50%",
          transform: [{ translateX: isSmall ? "-45%" : "-50%" }],
        }}>
        <BarChart
          data={data}
          highlightEnabled
          height={CHART_HEIGHT}
          width={chartWidth}
          barWidth={barWidth}
          initialSpacing={spacing / 2}
          spacing={spacing}
          yAxisLabelWidth={0}
          barBorderTopLeftRadius={8}
          barBorderTopRightRadius={8}
          hideYAxisText
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules
          renderTooltip={renderTooltip}
        />
      </View>
    </View>
  );
}
