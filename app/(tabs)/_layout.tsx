import HomeIcon from "@/assets/icons/home.svg";
import OverviewIcon from "@/assets/icons/overview.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { TabButton } from "@/components/TabButton";
import { useTheme } from "@/hooks/useTheme";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  { name: "stats", href: "/stats", icon: SearchIcon },
  { name: "home", href: "/home", icon: HomeIcon },
  { name: "whatIf", href: "/whatIf", icon: OverviewIcon },
] as const;

const TAB_GAP = 48;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { themeColor } = useTheme();

  return (
    <Tabs>
      <TabSlot />

      {/* TabList is not NativeWind-aware, so its layout has to be plain style. */}
      <TabList
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: TAB_GAP,
          borderTopWidth: 1,
          borderTopColor: themeColor,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        }}>
        {TABS.map((tab) => (
          <TabTrigger
            key={tab.name}
            name={tab.name}
            href={tab.href}
            asChild>
            <TabButton icon={tab.icon} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}
