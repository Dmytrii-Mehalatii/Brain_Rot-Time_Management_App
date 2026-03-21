import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";

export default function Battery() {
  const { value, themeColor } = useTheme();
  const maxBattery = 6;

  return (
    <View className="w-fit flex-shrink flex-row justify-center items-center">
      <View className="flex-row w-[90%] h-10 gap-1 p-1 border-[#212121] rounded-md border-[1.5px]">
        {Array.from({ length: maxBattery - value + 1 }).map((_, index) => (
          <View
            key={index}
            style={{ backgroundColor: themeColor }}
            className={`w-full max-w-[14.20%] h-full flex-shrink rounded-sm`}
          />
        ))}
        <View className=" w-full h-full flex-shrink rounded-sm" />
      </View>
      <View className="w-[6px] h-4 border-[#212121] rounded-r-sm border-t-[1.5px] border-r-[1.5px] border-b-[1.5px]" />
    </View>
  );
}
