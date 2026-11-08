import BaseModal from "@/components/BaseModal";
import Battery from "@/components/Battery";
import BrainMap from "@/components/BrainMap";
import EnemyList from "@/components/EnemyList";
import EnemyModal from "@/components/EnemyModal";
import MainImage from "@/components/MainImage";
import SectionHeading from "@/components/SectionHeading";
import Streak from "@/components/Streak";
import { useDailyStats } from "@/hooks/useDailyStats";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { useModal } from "@/hooks/useModal";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useTheme } from "@/hooks/useTheme";
import { ScrollView, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

/** Energy reads 0% once today's screen time reaches nine hours. */
const ENERGY_DEPLETED_AT_MINUTES = 540;

export default function Home() {
  const { themeColor } = useTheme();
  const { apps, formattedTime, totalMinutes } = useDailyStats();
  const { activeModal, openModal, closeModal } = useModal();
  const isSmall = useIsSmallScreen();
  const { gesture, animatedStyle } = useSwipeNavigation({
    onSwipeLeft: "/(tabs)/whatIf",
    onSwipeRight: "/(tabs)/stats",
  });

  const energyPercent = Math.round(
    (1 - Math.min(totalMinutes / ENERGY_DEPLETED_AT_MINUTES, 1)) * 100,
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={animatedStyle}
        className="flex-1 items-center justify-center">
        <ScrollView
          className="w-full"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 items-center justify-center">
            <EnemyModal
              visible={activeModal === "enemies"}
              onClose={closeModal}
              apps={apps}
              period="day"
            />
            <BaseModal
              visible={activeModal === "brain"}
              onClose={closeModal}>
              <BrainMap />
            </BaseModal>
            <BaseModal
              visible={activeModal === "streak"}
              onClose={closeModal}>
              <Streak />
            </BaseModal>

            <View className="w-full flex-shrink">
              <MainImage />
            </View>

            <View
              className={`w-full py-3 ${isSmall ? "gap-4 px-8" : "gap-6 px-12"}`}>
              <View className="w-full gap-6">
                <Text
                  className={`font-['SpaceGroteskMedium'] uppercase text-ink ${isSmall ? "text-3xl" : "text-[28px]"}`}>
                  <Text
                    style={{ color: themeColor }}
                    className="lowercase">
                    {formattedTime}
                  </Text>{" "}
                  wasted today
                </Text>
                <View className="w-full flex-row items-center justify-start">
                  <Battery />
                  <Text className="ml-2 w-full flex-shrink text-left font-['SpaceGroteskRegular'] text-xl">
                    Your energy:{"  "}
                    <Text
                      className="font-['SpaceGroteskBold']"
                      style={{
                        color: themeColor,
                        fontSize: isSmall ? 20 : 18,
                      }}>
                      {energyPercent}%
                    </Text>
                  </Text>
                </View>
              </View>

              <View className="w-full gap-3">
                <SectionHeading
                  title="Today's Biggest Enemies:"
                  onSeeMore={
                    apps.length > 3 ? () => openModal("enemies") : undefined
                  }
                />
                <EnemyList apps={apps.slice(0, 3)} />
              </View>
            </View>

            <Text className="text-sm text-gray-500">
              *We don&apos;t track how long you use our app
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}
