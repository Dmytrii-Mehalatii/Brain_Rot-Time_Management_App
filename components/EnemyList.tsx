import { useTheme } from "@/hooks/useTheme";
import { AppType } from "@/types";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import CustomFlatList from "./CustomFlatList";

type MaybeApp = AppType | { placeholder: true; seconds?: number };

interface RenderItemInfo {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function EnemyList({ data }: { data: AppType[] }) {
  const { value, themeColor } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);

  const GAP = 8;
  const itemWidth = containerWidth > 0 ? (containerWidth - GAP * 2) / 3 : 0;

  const displayData = useMemo<MaybeApp[]>(() => {
    const items: MaybeApp[] = [...data];
    const missing = 3 - items.length;
    for (let i = 0; i < missing; i++) {
      items.push({ placeholder: true, seconds: 0 });
    }
    return items.slice(0, 3);
  }, [data]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const getBorderColor = (index: number, isPlaceholder = false) => {
    if (isPlaceholder) return "#cccccc";
    if (value < 4) {
      return index === 0 ? "#730031" : index === 1 ? "#AD154B" : "#D993AC";
    }
    return index === 0 ? "#4F5C4C" : index === 1 ? "#677863" : "#AAC7A4";
  };

  return (
    <View
      onLayout={handleLayout}
      className="w-full flex-row">
      {containerWidth > 0 && (
        <CustomFlatList<MaybeApp>
          data={displayData}
          isHorizontal={true}
          isScrollEnabled={false}
          renderItem={(
            item: AppType,
            { hours, minutes }: RenderItemInfo,
            index: number,
          ) => {
            const isLast = index === 2;
            const borderColor =
              "placeholder" in item
                ? getBorderColor(0, true)
                : getBorderColor(item.appIndex - 1);

            return (
              <View
                className="flex-row items-center rounded-md"
                style={{
                  width: itemWidth,
                  marginRight: isLast ? 0 : GAP,
                  borderWidth: 2,
                  borderColor,
                  paddingHorizontal: 4,
                  backgroundColor:
                    "placeholder" in item ? "#f5f5f5" : "transparent",
                  height: 50,
                }}>
                {"placeholder" in item ? (
                  <View className="w-5 h-5 bg-[#ccc] rounded-full" />
                ) : (
                  <Image
                    source={{ uri: `data:image/png;base64,${item.icon}` }}
                    style={{ width: 20, height: 20 }}
                  />
                )}

                <View className="flex-1 justify-center">
                  <Text
                    numberOfLines={1}
                    className="text-center"
                    style={{ fontSize: 14, fontFamily: "SpaceGroteskRegular" }}>
                    {"placeholder" in item ? "Empty" : item.appName}
                  </Text>
                  <Text
                    className="text-center"
                    style={{
                      fontSize: 14,
                      fontFamily: "SpaceGroteskMedium",
                      color: "placeholder" in item ? "#7e7e7e" : themeColor,
                    }}>
                    {hours > 0 ? `${hours}h ` : ""}
                    {minutes}m
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
