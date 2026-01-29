/* eslint-disable import/no-unresolved */
import { useBrainMap } from "@/hooks/useBrainMap";
import { useUserApps } from "@/hooks/useUserAppsType";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import BottomBrain from "./BrainParts/bottom";
import { default as MiddleBottomBrain } from "./BrainParts/MiddleBottom";
import MiddleTopBrain from "./BrainParts/middleTop";
import TopBrain from "./BrainParts/top";

export default function BrainMapModal() {
  const { isBrainModalVisible, setIsBrainModalVisible } = useBrainMap();
  const {
    appData,
    topBrainPart,
    secondBrainPart,
    thirdBrainPart,
    bottomBrainPart,
  } = useUserApps();

  function getBrainPartColor(value: number) {
    if (value < 60) return "#BD446F";
    if (value < 90) return "#C86286";
    if (value < 120) return "#E6B6C7";
    if (value < 150) return "#AAC7A4";
    if (value < 240) return "#859B80";
    return "#677863";
  }

  const topColor = useMemo(
    () => getBrainPartColor(topBrainPart),
    [topBrainPart],
  );

  const secondColor = useMemo(
    () => getBrainPartColor(secondBrainPart),
    [secondBrainPart],
  );

  const thirdColor = useMemo(
    () => getBrainPartColor(thirdBrainPart),
    [thirdBrainPart],
  );

  const bottomColor = useMemo(
    () => getBrainPartColor(bottomBrainPart),
    [bottomBrainPart],
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isBrainModalVisible}
      onRequestClose={() => setIsBrainModalVisible(false)}>
      <View className="flex-1 justify-center items-center bg-black/55">
        <View className="w-[80%] h-[60%] bg-white border-y-[2px] border-x-[2px] border-black rounded-2xl shadow-lg">
          <Pressable
            onPress={() => setIsBrainModalVisible(false)}
            className="absolute top-6 right-6 z-20">
            <MaterialIcons
              name="close"
              color="#000"
              size={36}
            />
          </Pressable>

          <View className="-mt-24">
            <View className="flex items-center h-[44px]">
              <TopBrain
                width="70%"
                fill={topColor}
                color1={"#ad144a"}
                color2={topColor}
              />
            </View>

            <View className="flex items-center h-12">
              <MiddleTopBrain
                width="75%"
                fill={secondColor}
                color1={"#ad144a"}
                color2={secondColor}
              />
            </View>

            <View className="flex items-center h-[68px]">
              <MiddleBottomBrain
                width="75%"
                fill={thirdColor}
                color1={"#6B7D6A"}
                color2={thirdColor}
              />
            </View>
            <View className="flex items-center h-[220px]">
              <BottomBrain
                width="80%"
                fill={bottomColor}
                color1={"#ad144a"}
                color2={bottomColor}
              />
            </View>
          </View>

          <View className="flex-1 flex-row gap-4 justify-between items-center w-full px-8 ">
            <View className="gap-y-5">
              {[
                { label: "Giga-Brain", color: "bg-[#B54673]" },
                { label: "Fully Conscious", color: "bg-[#D16A8E]" },
                { label: "The First Itch", color: "bg-[#EBBDCF]" },
              ].map((item) => (
                <View
                  key={item.label}
                  className="flex-row items-center gap-x-3 h-10">
                  <View className={`w-7 h-7 rounded-md ${item.color}`} />
                  <Text className="text-md font-['SpaceGroteskRegular'] text-gray-800 max-w-[100px]">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            <View className="gap-y-5">
              {[
                { label: "Absolute Rot", color: "bg-[#6B7D6A]" },
                { label: "Chronically Online", color: "bg-[#8CA28B]" },
                { label: "Brain Mush", color: "bg-[#ACC1AB]" },
              ].map((item) => (
                <View
                  key={item.label}
                  className="flex-row items-center gap-x-3 h-10">
                  <View className={`w-7 h-7 rounded-md ${item.color}`} />
                  <Text className="text-md font-['SpaceGroteskRegular'] text-gray-800 max-w-[100px]">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
