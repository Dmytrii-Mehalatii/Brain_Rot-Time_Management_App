import UsageStats from "@/modules/usage-stats";
import { Image, Pressable, Text, View } from "react-native";
import "./global.css";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FDF6F8",
      }}>
      <View className="h-fit">
        <Image
          source={require("@/assets/images/clouds_bg_top.png")}
          style={{
            height: undefined,
            width: "120%",
            aspectRatio: 1.25,
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
            left: "55%",
            transform: [{ translateX: "-50%" }],
          }}
          resizeMode="cover"
        />
      </View>
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
      <Pressable
        className="w-fit mt-8 bg-primary-500 px-8 py-4 rounded-md border-[1.5px] border-primary-800"
        onPress={() => UsageStats.requestPermission()}>
        <Text className="color-white text-center font-['SpaceGroteskMedium'] text-xl">
          Grand Permission
        </Text>
      </Pressable>
      <Image
        source={require("@/assets/images/clouds_bg_bottom.png")}
        style={{
          height: undefined,
          width: "120%",
          aspectRatio: 1.25,
        }}
        resizeMode="cover"
      />
    </View>
  );
}
