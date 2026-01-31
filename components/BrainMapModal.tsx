import { useBrainMap } from "@/hooks/useBrainMap";
import { useUserApps } from "@/hooks/useUserAppsType";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import BottomBrain from "./BrainParts/Bottom";
import MiddleBottomBrain from "./BrainParts/MiddleBottom";
import MiddleTopBrain from "./BrainParts/MiddleTop";
import TopBrain from "./BrainParts/Top";

export default function BrainMapModal() {
  const { isBrainModalVisible, setIsBrainModalVisible } = useBrainMap();
  const { topBrainPart, secondBrainPart, thirdBrainPart, bottomBrainPart } =
    useUserApps();

  const [infoBrainPartState, setInfoBrainPartState] = useState(false);
  const [brainPart, setBrainPart] = useState<
    | "topBrainPart"
    | "secondBrainPart"
    | "thirdBrainPart"
    | "bottomBrainPart"
    | ""
  >("");

  function getBrainPartColor(value: number) {
    if (value < 60) return ["#d65181", "#ad144a"];
    if (value < 90) return ["#C86286", "#ad144a"];
    if (value < 120) return ["#E6B6C7", "#ad144a"];
    if (value < 150) return ["#AAC7A4", "#6B7D6A"];
    if (value < 240) return ["#859B80", "#6B7D6A"];
    return "#677863";
  }

  const topColor = useMemo(
    () => getBrainPartColor(topBrainPart.time),
    [topBrainPart],
  );

  const secondColor = useMemo(
    () => getBrainPartColor(secondBrainPart.time),
    [secondBrainPart],
  );

  const thirdColor = useMemo(
    () => getBrainPartColor(thirdBrainPart.time),
    [thirdBrainPart],
  );

  const bottomColor = useMemo(
    () => getBrainPartColor(bottomBrainPart.time),
    [bottomBrainPart],
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isBrainModalVisible}
      onRequestClose={() => setIsBrainModalVisible(false)}>
      <View className="flex-1 justify-center items-center bg-black/55">
        <View className="relative w-[85%] h-[60%] min-h-fit bg-white border-y-[2px] border-x-[2px] px-2 border-black rounded-2xl shadow-lg">
          <Pressable
            onPress={() => setIsBrainModalVisible(false)}
            className="absolute top-6 right-6 z-20">
            <MaterialIcons
              name="close"
              color="#000"
              size={36}
            />
          </Pressable>

          <View style={{ position: "relative", height: 320 }}>
            <Pressable
              onPress={() => {
                setBrainPart("topBrainPart");
                setInfoBrainPartState(true);
              }}
              className="absolute w-full left-0 top-16 h-20 ">
              <TopBrain
                width="100%"
                height="90%"
                fill={topColor[0]}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setBrainPart("secondBrainPart");
                setInfoBrainPartState(true);
              }}
              className="absolute w-full left-0 h-20"
              style={{ top: 110 }}>
              <MiddleTopBrain
                width="100%"
                height="100%"
                fill={secondColor[0]}
                color1={secondColor[1]}
                color2={secondColor[0]}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setInfoBrainPartState(true);
                setBrainPart("thirdBrainPart");
              }}
              className="absolute w-full left-0 h-20"
              style={{ top: 160 }}>
              <MiddleBottomBrain
                width="100%"
                height="104%"
                fill={thirdColor[0]}
                color1={thirdColor[1]}
                color2={thirdColor[0]}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setInfoBrainPartState(true);
                setBrainPart("bottomBrainPart");
              }}
              className="absolute w-full left-0  h-20"
              style={{ top: 200 }}>
              <BottomBrain
                width="100%"
                height="150%"
                fill={bottomColor[0]}
              />
            </Pressable>
          </View>

          <View className="flex flex-row justify-between mx-6 mb-4">
            <Pressable
              onPress={() => setInfoBrainPartState(true)}
              className={`flex items-center justify-center rounded-md ${infoBrainPartState ? "bg-primary-500" : ""} border-primary-500 border-2 w-[120px] h-10`}>
              <Text
                className={`${infoBrainPartState ? "text-white" : ""} font-['SpaceGroteskMedium']`}>
                Brain Info
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setInfoBrainPartState(false)}
              className={`flex items-center justify-center rounded-md ${!infoBrainPartState ? "bg-primary-500" : ""} border-primary-500 border-2 w-[120px] h-10`}>
              <Text
                className={`${!infoBrainPartState ? "text-white" : ""} font-['SpaceGroteskMedium']`}>
                Color Info
              </Text>
            </Pressable>
          </View>

          <View className="flex-row gap-4 mx-6 border-[#ad144a] rounded-md border-2 px-3 py-2 justify-between items-center ">
            {infoBrainPartState ? (
              <View className="w-full">
                {brainPart === "" ? (
                  <Text className="font-['SpaceGroteskMedium'] text-xl text-center">
                    Please select a{" "}
                    <Text className="text-primary-700">brain part</Text> to see
                    more
                  </Text>
                ) : brainPart === "topBrainPart" ? (
                  <View className="py-2 gap-2">
                    <Text className="w-full text-center text-xl font-['SpaceGroteskMedium']">
                      {topBrainPart.type}
                    </Text>
                    <Text className="font-['SpaceGroteskRegular'] text-lg">
                      Well Used Time:{" "}
                      <Text className="text-primary-700 font-['SpaceGroteskBold']">
                        {Math.floor(secondBrainPart.time / 60)}h{" "}
                        {secondBrainPart.time % 60}m
                      </Text>
                    </Text>
                    <Text>Funny quote</Text>
                  </View>
                ) : brainPart === "secondBrainPart" ? (
                  <View className="py-2 gap-2">
                    <Text className="w-full text-center text-xl font-['SpaceGroteskMedium']">
                      {secondBrainPart.type}
                    </Text>
                    <Text className="font-['SpaceGroteskRegular'] text-lg">
                      Wasted Time:{" "}
                      <Text className="text-primary-700 font-['SpaceGroteskBold']">
                        {Math.floor(secondBrainPart.time / 60)}h{" "}
                        {secondBrainPart.time % 60}m
                      </Text>
                    </Text>
                    <Text>Funny quote</Text>
                  </View>
                ) : brainPart === "thirdBrainPart" ? (
                  <View className="py-2 gap-2">
                    <Text className="w-full text-center text-xl font-['SpaceGroteskMedium']">
                      {thirdBrainPart.type}
                    </Text>
                    <Text className="font-['SpaceGroteskRegular'] text-lg">
                      Wasted Time:{" "}
                      <Text className="text-primary-700 font-['SpaceGroteskBold']">
                        {Math.floor(thirdBrainPart.time / 60)}h{" "}
                        {thirdBrainPart.time % 60}m
                      </Text>
                    </Text>
                    <Text>Funny quote</Text>
                  </View>
                ) : (
                  <View className="py-2 gap-2">
                    <Text className="w-full text-center text-xl font-['SpaceGroteskMedium']">
                      {bottomBrainPart.type}
                    </Text>
                    <Text className="font-['SpaceGroteskRegular'] text-lg">
                      Wasted Time:{" "}
                      <Text className="text-primary-700 font-['SpaceGroteskBold']">
                        {Math.floor(bottomBrainPart.time / 60)}h{" "}
                        {bottomBrainPart.time % 60}m
                      </Text>
                    </Text>
                    <Text>Funny quote</Text>
                  </View>
                )}
              </View>
            ) : (
              <>
                <View className="gap-y-3">
                  {[
                    { label: "Giga-Brain", color: "bg-[#B54673]" },
                    { label: "Fully Conscious", color: "bg-[#D16A8E]" },
                    { label: "The First Itch", color: "bg-[#EBBDCF]" },
                  ].map((item) => (
                    <View
                      key={item.label}
                      className="flex-row items-center gap-x-3 h-10">
                      <View className={`w-7 h-7 rounded-md ${item.color}`} />
                      <Text className="text-md font-['SpaceGroteskRegular'] text-gray-800 max-w-[92px]">
                        {item.label}
                      </Text>
                    </View>
                  ))}
                </View>

                <View className="gap-y-3">
                  {[
                    { label: "Absolute Rot", color: "bg-[#6B7D6A]" },
                    { label: "Chronically Online", color: "bg-[#8CA28B]" },
                    { label: "Brain Mush", color: "bg-[#ACC1AB]" },
                  ].map((item) => (
                    <View
                      key={item.label}
                      className="flex-row items-center gap-x-3 h-10">
                      <View className={`w-7 h-7 rounded-md ${item.color}`} />
                      <Text className="text-md font-['SpaceGroteskRegular'] text-gray-800 max-w-[92px]">
                        {item.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
