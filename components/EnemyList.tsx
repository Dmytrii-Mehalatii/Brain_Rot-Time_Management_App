import UsageStats from "@/modules/usage-stats";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";

export default function EnemyList() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function fetchTime() {
      const data = UsageStats.getStats();
      setStats(data);
    }
    fetchTime();
  }, []);
  return (
    <FlatList
      className="max-w-full h-16"
      horizontal
      data={stats}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View
          className="flex flex-row flex-shrink py-[6px] w-[104px] justify-center items-center border-[1.5px] h-full rounded-md mr-3"
          style={{
            borderWidth: 2,
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
            style={{ width: 20, height: 20 }}
          />
          <Text className="text-center">{item.appName}</Text>
        </View>
      )}
    />
  );
}
