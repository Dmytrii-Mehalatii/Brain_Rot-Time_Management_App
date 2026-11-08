import Header from "@/components/Header";
import { DailyStatsProvider } from "@/hooks/useDailyStats";
import { ModalProvider } from "@/hooks/useModal";
import { StreakStatsProvider } from "@/hooks/useStreakStats";
import { ThemeProvider } from "@/hooks/useTheme";
import { WeeklyStatsProvider } from "@/hooks/useWeeklyStats";
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
      {/* ThemeProvider derives the rot stage from today's stats, so it sits inside DailyStatsProvider. */}
      <DailyStatsProvider>
        <ThemeProvider>
          <WeeklyStatsProvider>
            <StreakStatsProvider>
              <ModalProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerTitle: () => <Header title="Brain Rot" />,
                      headerBackVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="index"
                    options={{ headerShown: false, headerShadowVisible: false }}
                  />
                </Stack>
              </ModalProvider>
            </StreakStatsProvider>
          </WeeklyStatsProvider>
        </ThemeProvider>
      </DailyStatsProvider>
    </GestureHandlerRootView>
  );
}
