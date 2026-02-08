import Home from "@/assets/icons/home.svg";
import Overview from "@/assets/icons/overview.svg";
import Search from "@/assets/icons/search.svg";
import { TabButton } from "@/components/TabButton";
import { useTheme } from "@/hooks/useTheme";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const insets = useSafeAreaInsets();
  const { textColor } = useTheme();
  return (
    <Tabs>
      <TabSlot />

      <TabList
        className="flex border-t-[1px] border-t-primary-700 gap-14 items-center"
        style={{
          borderTopColor: `${textColor}`,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          justifyContent: "center",
        }}>
        <TabTrigger
          name="stats"
          href="/stats"
          asChild>
          <TabButton>
            <Search
              width={36}
              height={36}
            />
          </TabButton>
        </TabTrigger>

        <TabTrigger
          name="home"
          href="/home"
          asChild>
          <TabButton>
            <Home
              width={36}
              height={36}
            />
          </TabButton>
        </TabTrigger>

        <TabTrigger
          name="whatIf"
          href="/whatIf"
          asChild>
          <TabButton>
            <Overview
              width={36}
              height={36}
            />
          </TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
