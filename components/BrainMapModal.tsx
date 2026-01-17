import { useBrainMap } from "@/hooks/useBrainMap";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Modal, Pressable, Text, View } from "react-native";

export default function BrainMapModal() {
  const { isBrainModalVisible, setIsBrainModalVisible } = useBrainMap();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isBrainModalVisible}
      onRequestClose={() => setIsBrainModalVisible(false)}>
      <View className="flex-1 justify-center items-center bg-black/55">
        <View className="w-[80%] h-[60%] bg-white border-y-[2px] border-x-[2px] border-black rounded-2xl justify-center items-center shadow-lg">
          <Pressable
            onPress={() => setIsBrainModalVisible(false)}
            className="absolute top-6 right-6 z-20">
            <MaterialIcons
              name="close"
              color="#000"
              size={36}
            />
          </Pressable>

          <View className="flex-shrink mt-10 z-10">
            <Image
              source={require("@/assets/images/full_brain.png")}
              style={{ width: "85%", height: undefined, aspectRatio: 1 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-1 flex-row gap-4 justify-between items-center w-full px-8 ">
            <View className="gap-y-5">
              {[
                { label: "Giga-Brain", color: "bg-[#B54673]" },
                { label: "Fully Conscious", color: "bg-[#D16A8E]" },
                { label: "Mildly Stimulated", color: "bg-[#DD97B1]" },
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
                { label: "Early Decay", color: "bg-[#C9DCC8]" },
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
