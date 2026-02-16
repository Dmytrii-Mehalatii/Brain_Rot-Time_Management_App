import { useTheme } from "@/hooks/useTheme";
import { AppType } from "@/types";
import { Image, Text, View } from "react-native";
import CustomFlatList from "./CustomFlatList";

export default function EnemyList({
  data,
  width,
}: {
  data: AppType[];
  width: number;
}) {
  const { value, themeColor } = useTheme();

  const getBorderColor = (index: number) => {
    if (value < 4) {
      return index === 0 ? "#730031" : index === 1 ? "#AD154B" : "#D993AC";
    }
    return index === 0 ? "#4F5C4C" : index === 1 ? "#677863" : "#AAC7A4";
  };

  return (
    <View>
      <CustomFlatList
        data={data}
        isHorizontal={true}
        isScrollEnabled={false}
        renderItem={(item, { hours, minutes }) => (
          <View
            className="flex-row items-center justify-center rounded-md"
            style={{
              width: width,
              borderWidth: 2,
              marginRight: 8,
              paddingHorizontal: 4,
              height: "auto",
              borderColor: getBorderColor(item.appIndex - 1),
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
                style={{ fontFamily: "SpaceGroteskMedium", color: themeColor }}
                className="text-base w-full text-center flex-shrink">
                {hours > 0 ? hours + "h " : ""}
                {minutes}m
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
