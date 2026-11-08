import Divider from "@/components/Divider";
import EnemyList from "@/components/EnemyList";
import EnemyModal from "@/components/EnemyModal";
import ScreenTimeShareChart from "@/components/ScreenTimeShareChart";
import SectionHeading from "@/components/SectionHeading";
import WeeklyBarChart from "@/components/WeeklyBarChart";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { useModal } from "@/hooks/useModal";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { formatMinutes } from "@/utils/time";
import { Text, useWindowDimensions } from "react-native";
import { GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

export default function Stats() {
  const { days, totalMinutes, apps } = useWeeklyStats();
  const { activeModal, openModal, closeModal } = useModal();
  const { width: screenWidth } = useWindowDimensions();
  const isSmall = useIsSmallScreen();
  const { gesture, animatedStyle } = useSwipeNavigation({
    onSwipeLeft: "/(tabs)/home",
  });

  const averageMinutes = totalMinutes / 7;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 20,
        position: "absolute",
        width: screenWidth,
        right: 0,
      }}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={animatedStyle}
          className={`flex-1 ${isSmall ? "px-8" : "px-12"}`}>
          <EnemyModal
            visible={activeModal === "weeklyEnemies"}
            onClose={closeModal}
            apps={apps}
            period="week"
          />

          <Text className="mt-8 font-['SpaceGroteskMedium'] text-4xl text-ink">
            {formatMinutes(averageMinutes)}
          </Text>
          <Text className="font-['SpaceGroteskRegular'] text-2xl text-ink">
            Daily average
          </Text>
          <WeeklyBarChart
            days={days}
            averageMinutes={averageMinutes}
          />

          <Divider
            className="my-10"
            thickness={1.5}
          />

          <SectionHeading title="Weekly Time Spending:" />
          <ScreenTimeShareChart weeklyMinutes={totalMinutes} />

          <Divider
            className="my-10"
            thickness={1.5}
          />

          <SectionHeading
            title="Weekly Biggest Enemies:"
            className="mb-3"
            onSeeMore={
              apps.length > 3 ? () => openModal("weeklyEnemies") : undefined
            }
          />
          <EnemyList apps={apps.slice(0, 3)} />
        </Animated.View>
      </GestureDetector>
    </ScrollView>
  );
}
