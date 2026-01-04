import UsageStats from "@/modules/usage-stats";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

export default function Stats() {
  const [stats, setStats] = useState([]);

  const handleGetStats = () => {
    const data = UsageStats.getStats();
    setStats(data);
  };

  return (
    <View style={{ padding: 50 }}>
      <Text>Permission Status: {String(UsageStats.hasPermission())}</Text>

      {/* {UsageStats.hasPermission ? (
        ""
      ) : ( */}
      <Pressable onPress={() => UsageStats.requestPermission()}>
        <Text>Open Settings</Text>
      </Pressable>
      {/* )} */}

      <Pressable onPress={handleGetStats}>
        <Text>Refresh</Text>
      </Pressable>
      {/* <Text>{UsageStats.sumTime()}</Text> */}

      <FlatList
        data={stats}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: `data:image/png;base64,${item.icon}` }}
              style={{ width: 32, height: 32 }}
            />
            <Text>
              {item.appName}: {item.seconds}s
            </Text>
          </View>
        )}
      />
    </View>
  );
}
