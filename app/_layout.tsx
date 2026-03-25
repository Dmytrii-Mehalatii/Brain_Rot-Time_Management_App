import Header from "@/components/Header";
import BrainMapProvider from "@/hooks/useModal";
import { UserStreakStatsProvider } from "@/hooks/useStreakStats";
import { ThemeProvider } from "@/hooks/useTheme";
import UserAppsProviderType from "@/hooks/useUserAppsType";
import { UserGenericStatsProvider } from "@/hooks/useUserGenericStats";
import { UserWeeklyStatsProvider } from "@/hooks/useUserWeeklyStats";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGroteskRegular: require("../assets/fonts/SpaceGroteskRegular.ttf"),
    SpaceGroteskMedium: require("../assets/fonts/SpaceGroteskMedium.ttf"),
    SpaceGroteskBold: require("../assets/fonts/SpaceGroteskBold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <UserGenericStatsProvider>
          <UserAppsProviderType>
            <UserWeeklyStatsProvider>
              <UserStreakStatsProvider>
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
              </UserStreakStatsProvider>
            </UserWeeklyStatsProvider>
          </UserAppsProviderType>
        </UserGenericStatsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
