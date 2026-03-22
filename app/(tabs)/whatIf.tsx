import CardGroup from "@/components/CardGroup";
import { useTheme } from "@/hooks/useTheme";
import useUserStats from "@/hooks/useUserStats";
import { Dimensions, ScrollView, Text, View } from "react-native";

export default function WhatIf() {
  const { formatedTime } = useUserStats();
  const { themeColor } = useTheme();

  const { width } = Dimensions.get("window");
  const isSmall = width < 380;

  return (
    <View
      className={`flex-1 mt-8 ${isSmall ? "px-8" : "px-12"} flex-col gap-3 items-center`}>
      <Text
        className={`font-['SpaceGroteskMedium'] uppercase ${isSmall ? "text-[22px]" : "text-[24px]"}`}>
        <Text
          className="lowercase text-[26px]"
          style={{ color: themeColor }}>
          {formatedTime}
        </Text>{" "}
        Whats the cost?
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        <CardGroup
          type="knowledge"
          title="Knowledge and Development:"
        />
        <CardGroup
          type="health"
          title="Health and Body:"
        />
        <CardGroup
          type="creativity"
          title="Creativity:"
        />
        <CardGroup
          type="universal"
          title="Universal:"
        />
      </ScrollView>
    </View>
  );
}
