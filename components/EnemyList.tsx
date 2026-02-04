import { useTheme } from "@/hooks/useTheme";
import { Image, Text, View } from "react-native";
import CustomFlatList from "./CustomFlatList";

export default function EnemyList({
  data,
  width,
  horizontal,
}: {
  data: any;
  width: number;
  horizontal: boolean;
}) {
  const { value, textColor } = useTheme();

  const getBorderColor = (index: number) => {
    if (value < 3) {
      return index === 0 ? "#730031" : index === 1 ? "#AD154B" : "#D993AC";
    }
    return index === 0 ? "#4F5C4C" : index === 1 ? "#677863" : "#AAC7A4";
  };

  return (
    <View>
      <CustomFlatList
        data={data}
        isHorizontal={horizontal}
        isScrollEnabled={false}
        renderItem={(item, { hours, minutes }) => (
          <View
            className="flex-row items-center justify-center rounded-md"
            style={{
              width: width,
              borderWidth: 2,
              marginRight: horizontal ? 8 : 16,
              paddingHorizontal: horizontal ? 4 : 12,
              height: horizontal ? "auto" : 60,
              marginBottom:
                horizontal || item.appIndex === data.length ? 0 : 17,
              borderColor: getBorderColor(item.appIndex - 1),
            }}>
            <Image
              source={{ uri: `data:image/png;base64,${item.icon}` }}
              style={{
                width: horizontal ? 24 : 32,
                height: horizontal ? 24 : 32,
              }}
            />

            <View className="py-1 flex w-full flex-shrink">
              <Text
                className="w-full text-center flex-shrink"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: horizontal ? 14 : 16,
                  maxWidth: horizontal ? 60 : 120,
                  fontFamily: "SpaceGroteskRegular",
                }}>
                {item.appName}
              </Text>
              <Text
                style={{ fontFamily: "SpaceGroteskMedium", color: textColor }}
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
