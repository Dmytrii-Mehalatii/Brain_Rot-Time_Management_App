import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import "./global.css";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text className="color-primary-700">Hello</Text>
      <Pressable onPress={() => router.navigate("/(tabs)/home")}>
        <Text>Next page</Text>
      </Pressable>
    </View>
  );
}
