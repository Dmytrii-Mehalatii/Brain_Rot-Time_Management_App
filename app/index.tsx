import Button from "@/components/Button";
import { contentColumn } from "@/constants/layout";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { useUsagePermission } from "@/hooks/useUsagePermission";
import UsageStats from "@/modules/usage-stats";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Welcome screen that gates the app on Android usage access. */
export default function Welcome() {
  const granted = useUsagePermission();
  const isSmall = useIsSmallScreen();

  if (granted) return <Redirect href="/(tabs)/home" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FDF6F8" }}>
      {/* flexGrow keeps the fill-the-screen layout on tall phones; short ones scroll instead of clipping. */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View
          className="flex-1 items-center justify-between"
          style={contentColumn}>
          <View>
            <Image
              source={require("@/assets/images/clouds_bg_top.png")}
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: isSmall ? 1.25 : 1.15,
              }}
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
              contentFit="cover"
            />
          </View>

          <View className="w-full flex-1 items-center justify-center px-6">
            <View
              className={`w-full max-w-[400px] ${isSmall ? "gap-2" : "gap-4"}`}>
              <Text
                className={`text-center font-['SpaceGroteskBold'] text-primary-500 ${isSmall ? "text-4xl" : "text-5xl"}`}>
                Your Brain Will Thank You
              </Text>
              <Text className="px-2 text-center font-['SpaceGroteskRegular'] text-lg leading-6 text-ink opacity-70">
                To help you reclaim your focus, we need to see where your time
                is going. Please enable usage tracking so we can highlight your
                digital habits.
              </Text>
            </View>
          </View>

          <View
            className={`w-full flex-1 items-center justify-center px-6 ${isSmall ? "" : "-mt-10"}`}>
            <View className={`w-full px-6 ${isSmall ? "" : "pb-12"}`}>
              <Button
                title="Grant Permission"
                onPress={() => UsageStats.requestPermission()}
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
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
