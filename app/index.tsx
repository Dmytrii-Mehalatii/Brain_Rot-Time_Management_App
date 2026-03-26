import Button from "@/components/Button";
import UsageStats from "@/modules/usage-stats";
import { Image } from "expo-image";
import { EventEmitter } from "expo-modules-core";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
type PermissionChangedEvent = {
  granted: boolean;
};

export default function Index() {
  const [hasPermission, setHasPermission] = useState(
    UsageStats.hasPermission(),
  );

  useEffect(() => {
    const emitter = new EventEmitter(UsageStats);

    const sub = emitter.addListener(
      "onPermissionChanged",
      (event: PermissionChangedEvent) => {
        setHasPermission(event.granted);
      },
    );

    return () => sub.remove();
  }, []);

  if (hasPermission) {
    return <Redirect href="/(tabs)/home" />;
  }

  const { width } = Dimensions.get("window");
  const isSmall = width < 380;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FDF6F8" }}>
      <View className="flex-1 items-center justify-between">
        <View className="h-fit">
          <Image
            source={require("@/assets/images/clouds_bg_top.png")}
            style={{
              width: "100%",
              backgroundColor: "#0553",
              height: undefined,
              aspectRatio: isSmall ? 1.25 : 1.15,
            }}
            // cachePolicy="memory-disk"
            contentFit="cover"
          />

          <Image
            source={require("@/assets/images/welcomingBrain.png")}
            style={{
              width: "70%",
              aspectRatio: 1,
              position: "absolute",
              bottom: 5,
              left: "50%",
              transform: [{ translateX: "-50%" }],
            }}
            // cachePolicy="memory-disk"
            contentFit="cover"
          />
        </View>

        <View className="flex-1 w-full items-center px-6 justify-center">
          <View
            className={`${isSmall ? "gap-2" : "gap-4"} w-full max-w-[400px]`}>
            <Text
              className={`color-primary-500 text-center font-['SpaceGroteskBold'] ${isSmall ? "text-4xl" : "text-5xl"}`}>
              Your Brain Will Thank You
            </Text>
            <Text className="text-center text-[#212121] opacity-70 font-['SpaceGroteskRegular'] text-lg leading-6 px-2">
              To help you reclaim your focus, we need to see where your time is
              going. Please enable usage tracking so we can highlight your
              digital habits.
            </Text>
          </View>
        </View>

        <View
          className={`flex-1 w-full items-center px-6 justify-center ${isSmall ? "" : "-mt-10"} `}>
          <View className={`w-full px-6 ${isSmall ? "" : "pb-12"}`}>
            <Button
              onPress={() => UsageStats.requestPermission()}
              title="Grant Permission"
            />
          </View>

          <Image
            source={require("@/assets/images/clouds_bg_bottom.png")}
            style={{
              position: "absolute",
              bottom: -225,
              width: "140%",
              aspectRatio: 1.25,
              zIndex: -1,
              opacity: 0.8,
            }}
            contentFit="contain"
            // cachePolicy="memory-disk"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
