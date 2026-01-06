import { useTheme } from "@/hooks/useTheme";
import useUserStats from "@/hooks/useUserStats";
import { FlatList, Image, Text, View } from "react-native";

export default function EnemyList() {
  const { value, textColor } = useTheme();

  const { stats } = useUserStats();
  return (
    <FlatList
      horizontal
      data={stats.slice(0, 3)}
      scrollEnabled={false}
      keyExtractor={(_, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      className="h-14"
      renderItem={({ item, index }) => (
        <View
          className="w-[104px] h-full mr-2 px-2 flex-row items-center justify-start rounded-md"
          style={{
            borderWidth: 2,
            borderColor:
              value < 3
                ? index === 0
                  ? "#730031"
                  : index === 1
                    ? "#AD154B"
                    : "#D993AC"
                : index === 0
                  ? "#4F5C4C"
                  : index === 1
                    ? "#677863"
                    : "#AAC7A4",
          }}>
          <Image
            source={{ uri: `data:image/png;base64,${item.icon}` }}
            style={{ width: 24, height: 24, marginRight: 8 }}
          />

          <View className="py-1">
            <Text
              className="text-base text-start flex-shrink"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ maxWidth: 60, fontFamily: "SpaceGroteskRegular" }}>
              {item.appName}
            </Text>
            <Text
              style={{ fontFamily: "SpaceGroteskMedium", color: textColor }}
              className="text-base text-center flex-shrink">
              {Math.round(item.seconds / 60)}m
            </Text>
          </View>
        </View>
      )}
    />
  );
}
