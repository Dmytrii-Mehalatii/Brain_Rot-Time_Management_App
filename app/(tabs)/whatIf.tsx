import CardGroup from "@/components/CardGroup";
import { useTheme } from "@/hooks/useTheme";
import useUserStats from "@/hooks/useUserStats";
import { ScrollView, Text, View } from "react-native";

export default function WhatIf() {
  const { formatedTime } = useUserStats();
  const { themeColor } = useTheme();

  return (
    <View className="flex-1 mt-8 mx-10 flex-col gap-4 items-center">
      <Text className="font-['SpaceGroteskRegular'] -mb-2 uppercase text-[26px]">
        <Text
          className="font-['SpaceGroteskMedium'] lowercase"
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
