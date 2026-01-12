import { Text, View } from "react-native";
import Card from "./Card";

export default function CardGroup({
  title,
  type,
}: {
  title: string;
  type: "knowledge" | "health" | "creativity";
}) {
  return (
    <View className="flex-col gap-4 mt-4">
      <Text className="font-['SpaceGroteskRegular'] text-xl">{title}</Text>
      {type === "health" ? (
        <View>
          <View className="gap-4">
            <View className="flex-row gap-4">
              <Card
                iconName="SquareActivity"
                title="Stretching"
                description="You could: have 4 stretching session"
              />
              <Card
                iconName="Dribbble"
                title="Match played"
                description="You could: play 3 basketball matches"
              />
            </View>
            <Card
              isFullWidth
              iconName="Footprints"
              title="An outside walk"
              description="You could: complete a 7 km walk and burn approximately 475 kcal"
            />
          </View>

          <View className="w-full h-[1px] mt-4 rounded bg-[#2e2e2e]" />
        </View>
      ) : type === "knowledge" ? (
        <View>
          <View className="gap-4">
            <View className="flex-row gap-4">
              <Card
                iconName="GraduationCap"
                title="Words learning"
                description="You could: master 65 foreign words"
              />
              <Card
                iconName="BookOpen"
                title="Book reading"
                description="You could: read 50 pages of a book"
              />
            </View>
            <Card
              isFullWidth
              iconName="Calendar"
              title="Weekly activity planning"
              description="You could: plan the entire upcoming two weeks on your calendar"
            />
          </View>

          <View className="w-full h-[1px] mt-4 rounded bg-[#212121]" />
        </View>
      ) : (
        <View>
          <View className="gap-4">
            <View className="flex-row gap-4">
              <Card
                iconName="Music"
                title="Playlist creation"
                description="You could: create 3 simple playlist"
              />
              <Card
                iconName="ChefHat"
                title="Cooking"
                description="You could: cook 4 pizzas"
              />
            </View>
            <Card
              isFullWidth
              iconName="Clapperboard"
              title="Series watching"
              description="You could: watch 2 and the half episodes of “The Walking Dead”"
            />
          </View>
        </View>
      )}
    </View>
  );
}
