import { useTheme } from "@/hooks/useTheme";
import useUserStats, { AppType } from "@/hooks/useUserStats";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Image, Modal, Pressable, Text, View } from "react-native";

type Props = {
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
};

export default function EnemyModal({ isVisible, setIsVisible }: Props) {
  const { stats } = useUserStats();
  const { textColor } = useTheme();

  const swapedArray = [...stats.slice(0, 3)];
  [swapedArray[0], swapedArray[1]] = [swapedArray[1], swapedArray[0]];

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}>
      <View className="w-full h-full flex justify-end">
        <View className="h-[70%] rounded-t-3xl border-[#000] border-t-[1.5px] px-12 border-x-[1.5px] bg-white w-full opacity-100">
          <View className="flex-row w-full justify-center items-center mt-6">
            <Text
              style={{ fontFamily: "SpaceGroteskRegular" }}
              className="color-[#212121] text-2xl w-full flex-shrink">
              Today’s Biggest Enemies:
            </Text>
            <Pressable onPress={() => setIsVisible(false)}>
              <MaterialIcons
                name="close"
                color="#000"
                size={32}
              />
            </Pressable>
          </View>

          <View className="items-center mt-5 h-fit">
            <FlatList
              data={swapedArray}
              horizontal
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }: { item: AppType }) => {
                const totalMinutes = Math.round(item.seconds / 60);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                return (
                  <View
                    style={{
                      marginTop:
                        item.appIndex === 2 || item.appIndex === 3 ? 32 : 0,
                    }}
                    className="items-center w-[108px] ">
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{ fontFamily: "SpaceGroteskMedium" }}
                      className="text-center text-base mb-1">
                      <Text
                        style={{
                          fontFamily: "SpaceGroteskBold",
                          color: textColor,
                        }}
                        className="text-lg">
                        {item.appIndex}
                      </Text>{" "}
                      {item.appIndex === 1
                        ? "Final Boss"
                        : item.appIndex === 2
                          ? "Brain Melter"
                          : "Time Eater"}
                    </Text>

                    <Image
                      source={{ uri: `data:image/png;base64,${item.icon}` }}
                      style={{ width: 48, height: 48, marginVertical: 8 }}
                    />

                    <Text
                      style={{
                        fontFamily: "SpaceGroteskRegular",
                        color: textColor,
                      }}
                      className="text-center font-bold mt-1">
                      {hours > 0 ? `${hours}h ` : ""}
                      {minutes}m
                    </Text>
                  </View>
                );
              }}
            />
          </View>

          <View className="bg-black h-[1px] my-6" />

          <View className="max-h-[328px] overflow-hidden">
            <FlatList
              data={stats.slice(3)}
              renderItem={({ item }) => {
                const totalMinutes = Math.round(item.seconds / 60);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return (
                  <View className="flex-row items-center h-fit py-4 border-b-gray-300 border-b-[1px] mb-2">
                    <Text className="font-['SpaceGroteskMedium'] mr-3">
                      {item.appIndex}
                    </Text>
                    <Image
                      source={{ uri: `data:image/png;base64,${item.icon}` }}
                      style={{ width: 24, height: 24 }}
                    />
                    <Text
                      className="w-full mx-3 flex-shrink font-['SpaceGroteskRegular']"
                      numberOfLines={1}>
                      {item.appName}
                    </Text>

                    <Text
                      style={{
                        fontFamily: "SpaceGroteskMedium",
                        color: textColor,
                      }}>
                      {hours}h {minutes}m
                    </Text>
                  </View>
                );
              }}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.05)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 40,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
