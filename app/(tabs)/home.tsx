import BaseModal from "@/components/BaseModal";
import Battery from "@/components/Battery";
import BrainMap from "@/components/BrainMap";
import EnemyList from "@/components/EnemyList";
import EnemyModal from "@/components/EnemyModal";
import MainImage from "@/components/MainImage";
import Streak from "@/components/Streak";
import { useModal } from "@/hooks/useModal";
import { useTheme } from "@/hooks/useTheme";
import useUserStats from "@/hooks/useUserStats";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  const { themeColor } = useTheme();
  const { stats, formatedTime, timeInMinutes } = useUserStats();

  // const [isEnemiesModalVisible, setIsEnemiesModalVisible] = useState(false);
  const { activeModal, setActiveModal } = useModal();

  const MAX_MINUTES = 540;
  const baseFreshness = 1 - Math.min(timeInMinutes / MAX_MINUTES, 1);

  return (
    <View className="flex-1 justify-center py-10 items-center">
      <EnemyModal
        isVisible={activeModal === "enemies"}
        setIsVisible={() => setActiveModal(null)}
        stats={stats}
        date="day"
      />

      <BaseModal
        visible={activeModal === "brain"}
        onClose={() => setActiveModal(null)}>
        <BrainMap />
      </BaseModal>

      <BaseModal
        visible={activeModal === "streak"}
        onClose={() => setActiveModal(null)}>
        <Streak />
      </BaseModal>

      <View className="h-full flex-shrink">
        <MainImage />
      </View>
      <View className="w-full px-12 py-3 flex-col gap-8">
        <View className="w-full flex-col gap-5">
          <Text
            style={{ fontFamily: "SpaceGroteskMedium" }}
            className="text-[28px] uppercase text-[#212121]">
            <Text
              style={{ color: themeColor }}
              className="w-full text-center lowercase ">
              {formatedTime}
            </Text>{" "}
            wasted today
          </Text>
          <View className="flex-row w-full items-center justify-center gap-3">
            <Battery />
            <Text
              style={{ fontFamily: "SpaceGroteskRegular" }}
              className="text-xl flex-2/3 text-center">
              Your Brain is{" "}
              <Text
                style={{ fontFamily: "SpaceGroteskBold", color: themeColor }}>
                {Math.round(baseFreshness * 100)}%
              </Text>{" "}
              fresh
            </Text>
          </View>
        </View>

        <View className="w-full gap-3">
          <View className="w-full flex-row items-center">
            <Text
              className="w-full flex-shrink text-xl"
              style={{ fontFamily: "SpaceGroteskRegular" }}>
              Todays Biggest Enemies:{" "}
            </Text>
            {stats.length < 4 ? (
              ""
            ) : (
              <Pressable onPress={() => setActiveModal("enemies")}>
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

          <EnemyList
            data={stats.slice(0, 3)}
            width={104}
          />
        </View>
      </View>
    </View>
  );
}
