import { ROT_STAGES, useTheme } from "@/hooks/useTheme";
import { View } from "react-native";

/** Drains one segment per rot stage. */
export default function Battery() {
  const { stage, themeColor } = useTheme();
  const filledSegments = ROT_STAGES - stage + 1;

  return (
    <View className="w-fit flex-shrink flex-row items-center justify-center">
      <View className="h-10 w-[90%] flex-row gap-1 rounded-md border-[1.5px] border-ink p-1">
        {Array.from({ length: filledSegments }, (_, index) => (
          <View
            key={index}
            style={{ backgroundColor: themeColor }}
            className="h-full w-full max-w-[14.20%] flex-shrink rounded-sm"
          />
        ))}
        <View className="h-full w-full flex-shrink rounded-sm" />
      </View>
      <View className="h-4 w-[6px] rounded-r-sm border-b-[1.5px] border-r-[1.5px] border-t-[1.5px] border-ink" />
    </View>
  );
}
