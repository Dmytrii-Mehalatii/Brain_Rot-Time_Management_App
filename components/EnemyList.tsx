import { useTheme } from "@/hooks/useTheme";
import useUserStats from "@/hooks/useUserStats";
import { Image, Text, View } from "react-native";
import CustomFlatList from "./CustomFlatList";

export default function EnemyList() {
  const { value, textColor } = useTheme();
  const { stats } = useUserStats();

  const getBorderColor = (index: number) => {
    if (value < 3) {
      return index === 0 ? "#730031" : index === 1 ? "#AD154B" : "#D993AC";
    }
    return index === 0 ? "#4F5C4C" : index === 1 ? "#677863" : "#AAC7A4";
  };

  return (
    <View className="h-14">
      <CustomFlatList
        data={stats.slice(0, 3)}
        isHorizontal={true}
        isScrollEnabled={false}
        renderItem={(item, { hours, minutes }) => (
          <View
            className="w-[104px] h-full mr-2 px-2 flex-row items-center justify-center rounded-md"
            style={{
              borderWidth: 2,
              borderColor: getBorderColor(item.appIndex - 1),
            }}>
            <Image
              source={{ uri: `data:image/png;base64,${item.icon}` }}
              style={{ width: 24, height: 24 }}
            />

            <View className="py-1 flex w-full flex-shrink">
              <Text
                className="text-base text-center flex-shrink"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ maxWidth: 60, fontFamily: "SpaceGroteskRegular" }}>
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
