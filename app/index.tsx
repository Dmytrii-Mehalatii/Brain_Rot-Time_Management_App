import Button from "@/components/Button";
import UsageStats from "@/modules/usage-stats";
import { Redirect } from "expo-router";
import { Image, Text, View } from "react-native";
import "./global.css";

export default function Index() {
  if (UsageStats.hasPermission()) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FDF6F8",
        justifyContent: "space-between",
      }}>
      <View className="h-fit">
        <Image
          source={require("@/assets/images/clouds_bg_top.png")}
          style={{
            height: undefined,
            width: "130%",
            aspectRatio: 1.15,
          }}
          resizeMode="cover"
        />
        <Image
          source={require("@/assets/images/welcomingBrain.png")}
          style={{
            position: "absolute",
            bottom: 20,
            height: undefined,
            width: "70%",
            aspectRatio: 1,
            left: "60%",
            transform: [{ translateX: "-50%" }],
          }}
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 items-center justify-between pb-36 h-fit">
        <View className="flex flex-col gap-5 w-[80%] mt-8">
          <Text className="color-primary-500 text-center font-['SpaceGroteskBold'] text-5xl">
            Your Brain Will Thank You
          </Text>
          <Text className="text-center text-[#212121] opacity-80 font-['SpaceGroteskRegular'] text-xl leading-6">
            To help you reclaim your focus, we need to see where your time is
            going. Please enable usage tracking so we can highlight your digital
            habits
          </Text>
        </View>
        <Button
          onPress={() => UsageStats.requestPermission()}
          title="Grand Permission"
        />
      </View>

      <Image
        source={require("@/assets/images/clouds_bg_bottom.png")}
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: -220,
          height: undefined,
          width: "120%",
          aspectRatio: 1.25,
        }}
        resizeMode="cover"
      />
    </View>
  );
}
