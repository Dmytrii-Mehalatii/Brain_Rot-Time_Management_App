import UsageStats from "@/modules/usage-stats";
import { Text, View } from "react-native";
// import * as Settings from 'expo-usage-sats';
export default function Stats() {
  return (
    <View>
      <Text>Smegma</Text>
      <Text>{UsageStats.hello()}</Text>
    </View>
  );
}
