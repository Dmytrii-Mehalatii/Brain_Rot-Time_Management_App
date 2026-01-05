import Header from "@/components/Header";
import { ThemeProvider } from "@/hooks/useTheme";
import { UserStatsProvider } from "@/hooks/useUserStats";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGroteskRegular: require("../assets/fonts/SpaceGroteskRegular.ttf"),
    SpaceGroteskMedium: require("../assets/fonts/SpaceGroteskMedium.ttf"),
    SpaceGroteskBold: require("../assets/fonts/SpaceGroteskBold.ttf"),
  });

  if (!fontsLoaded) return null;
  return (
    <ThemeProvider>
      <UserStatsProvider>
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
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShadowVisible: false,
            }}
          />
        </Stack>
      </UserStatsProvider>
    </ThemeProvider>
  );
}
