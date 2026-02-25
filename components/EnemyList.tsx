import { useTheme } from "@/hooks/useTheme";
import { AppType } from "@/types";
import { useMemo } from "react";
import { Image, Text, View } from "react-native";
import CustomFlatList from "./CustomFlatList";

type MaybeApp = AppType | { placeholder: true; seconds?: number };

export default function EnemyList({
  data,
  width,
}: {
  data: AppType[];
  width: number;
}) {
  const { value, themeColor } = useTheme();

  const displayData = useMemo<MaybeApp[]>(() => {
    const items: MaybeApp[] = [...data];
    const missing = 3 - items.length;
    for (let i = 0; i < missing; i++) {
      items.push({ placeholder: true, seconds: 0 });
    }
    return items;
  }, [data]);

  const getBorderColor = (index: number, isPlaceholder = false) => {
    if (isPlaceholder) {
      return "#cccccc";
    }

    if (value < 4) {
      return index === 0 ? "#730031" : index === 1 ? "#AD154B" : "#D993AC";
    }
    return index === 0 ? "#4F5C4C" : index === 1 ? "#677863" : "#AAC7A4";
  };

  return (
    <View>
      <CustomFlatList<MaybeApp>
        data={displayData}
        isHorizontal={true}
        isScrollEnabled={false}
        renderItem={(item, { hours, minutes }) => {
          if ("placeholder" in item) {
            return (
              <View
                className="flex-row items-center justify-center rounded-md"
                style={{
                  width: width,
                  borderWidth: 2,
                  marginRight: 8,
                  paddingHorizontal: 4,
                  height: "auto",
                  borderColor: getBorderColor(0, true),
                  backgroundColor: "#f5f5f5",
                }}>
                <View className="w-6 h-6 bg-[#ccc] rounded-full" />

                <View className="py-1 flex w-full flex-shrink">
                  <Text
                    className="w-full text-center flex-shrink ml-1"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 14,
                      maxWidth: 60,
                      fontFamily: "SpaceGroteskRegular",
                    }}>
                    Empty
                  </Text>
                  <Text
                    style={{
                      fontFamily: "SpaceGroteskMedium",
                    }}
                    className="text-base w-full text-center flex-shrink color-[#7e7e7e]">
                    {hours > 0 ? hours + "h " : ""}
                    {minutes}m
                  </Text>
                </View>
              </View>
            );
          }

          const borderColor = getBorderColor(item.appIndex - 1);

          return (
            <View
              className="flex-row items-center justify-center rounded-md"
              style={{
                width: width,
                borderWidth: 2,
                marginRight: 8,
                paddingHorizontal: 4,
                height: "auto",
                borderColor,
              }}>
              <Image
                source={{ uri: `data:image/png;base64,${item.icon}` }}
                style={{
                  width: 24,
                  height: 24,
                }}
              />

              <View className="py-1 flex w-full flex-shrink">
                <Text
                  className="w-full text-center flex-shrink"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 14,
                    maxWidth: 60,
                    fontFamily: "SpaceGroteskRegular",
                  }}>
                  {item.appName}
                </Text>
                <Text
                  style={{
                    fontFamily: "SpaceGroteskMedium",
                    color: themeColor,
                  }}
                  className="text-base w-full text-center flex-shrink">
                  {hours > 0 ? hours + "h " : ""}
                  {minutes}m
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
