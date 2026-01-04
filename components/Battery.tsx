// 1 - 2
// 2 - 3
// 3 - 4.5
// 4.5 - 6
// 6- 7
// 7+

import { useTheme } from "@/hooks/useTheme";
import { View } from "react-native";

export default function Battery() {
  const { textColor } = useTheme();
  return (
    <View className="w-fit flex-shrink flex-row justify-center items-center">
      <View className="flex-row w-[120px] h-10 gap-1 p-1 border-[#212121] rounded-md border-[1.5px]">
        <View
          style={{ backgroundColor: textColor }}
          className="w-full h-full flex-shrink rounded-sm"
        />
        <View
          style={{ backgroundColor: textColor }}
          className="w-full h-full flex-shrink rounded-sm"
        />
        <View
          style={{ backgroundColor: textColor }}
          className="w-full h-full flex-shrink rounded-sm"
        />
        <View
          style={{ backgroundColor: textColor }}
          className="w-full h-full flex-shrink rounded-sm"
        />
        <View
          style={{ backgroundColor: textColor }}
          className="w-full h-full flex-shrink rounded-sm"
        />
        <View className=" w-full h-full flex-shrink rounded-sm" />
      </View>
      <View className="w-[6px] h-4 border-[#212121] rounded-r-sm border-t-[1.5px] border-r-[1.5px] border-b-[1.5px]" />
    </View>
  );
}
