import Header from "@/components/Header";
import BrainMapProvider from "@/hooks/useModal";
import { ThemeProvider } from "@/hooks/useTheme";
import UserAppsProvider from "@/hooks/useUserAppsType";
import { UserStatsProvider } from "@/hooks/useUserStats";
import UsageStats from "@/modules/usage-stats";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGroteskRegular: require("../assets/fonts/SpaceGroteskRegular.ttf"),
    SpaceGroteskMedium: require("../assets/fonts/SpaceGroteskMedium.ttf"),
    SpaceGroteskBold: require("../assets/fonts/SpaceGroteskBold.ttf"),
  });

  const router = useRouter();
  useEffect(() => {
    if (UsageStats.hasPermission()) {
      router.push("/(tabs)/home");
    } else {
      router.push("/");
    }
  });
  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <UserStatsProvider>
          <UserAppsProvider>
            <BrainMapProvider>
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerTitle: () => (
                      <Header
                        title="Brain Rot"
                        brainIcon={true}
                      />
                    ),
                    headerBackVisible: false,
                  }}
                />
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                    headerShadowVisible: false,
                  }}
                />
              </Stack>
            </BrainMapProvider>
          </UserAppsProvider>
        </UserStatsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
