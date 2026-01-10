import { ReactNode } from "react";
import { FlatList } from "react-native";

type CustomFlatListProps = {
  data: T[];
  renderItem: (item: T, time: { hours: number; minutes: number }) => ReactNode;
  isScrollEnabled: boolean;
  isHorizontal: boolean;
};

export default function CustomFlatList({
  data,
  renderItem,
  isScrollEnabled,
  isHorizontal,
}: CustomFlatListProps) {
  return (
    <FlatList
      data={data}
      horizontal={isHorizontal}
      scrollEnabled={isScrollEnabled}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => {
        const totalMinutes = Math.round(item.seconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return <>{renderItem(item, { hours, minutes })}</>;
      }}
    />
  );
}
