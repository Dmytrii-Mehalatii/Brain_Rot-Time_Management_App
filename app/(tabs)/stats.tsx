import useUserStats from "@/hooks/useUserStats";
import UsageStats from "@/modules/usage-stats";
import { FlatList, Image, Pressable, Text, View } from "react-native";

export default function Stats() {
  const { stats } = useUserStats();

  return (
    <View style={{ padding: 50 }}>
      <Text>Permission Status: {String(UsageStats.hasPermission())}</Text>

      <Pressable onPress={() => UsageStats.requestPermission()}>
        <Text>Open Settings</Text>
      </Pressable>

      <FlatList
        data={stats}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              borderWidth: 2,
              marginTop: 8,
              borderColor:
                index < 1
                  ? "#730031"
                  : index === 1
                    ? "#AD154B"
                    : index === 2
                      ? "#D993AC"
                      : "#212121",
            }}>
            <Image
              source={{ uri: `data:image/png;base64,${item.icon}` }}
              style={{ width: 32, height: 32 }}
            />
            <Text>
              {item.appName}: {item.seconds / 60}s
            </Text>
          </View>
        )}
      />
    </View>
  );
}
