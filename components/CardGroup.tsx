import Card from "@/components/Card";
import type { WhatIfCard, WhatIfGroup } from "@/constants/whatIfCards";
import { useDailyStats } from "@/hooks/useDailyStats";
import { Text, View } from "react-native";

export default function CardGroup({ group }: { group: WhatIfGroup }) {
  const { totalMinutes } = useDailyStats();
  const [left, right, wide] = group.cards;

  const renderCard = (card: WhatIfCard, isFullWidth = false) => (
    <Card
      icon={card.icon}
      title={card.title}
      description={card.describe(totalMinutes)}
      isFullWidth={isFullWidth}
    />
  );

  return (
    <View className="mt-4 gap-4">
      <Text className="font-['SpaceGroteskRegular'] text-xl">
        {group.title}
      </Text>
      <View className="flex-row gap-4">
        {renderCard(left)}
        {renderCard(right)}
      </View>
      {renderCard(wide, true)}
    </View>
  );
}
