import useUserStats from "@/hooks/useUserStats";
import { Text, View } from "react-native";
import Card from "./Card";

export default function CardGroup({
  title,
  type,
}: {
  title: string;
  type: "knowledge" | "health" | "creativity" | "universal";
}) {
  const { timeInMinutes } = useUserStats();

  const wordsLearnt = Math.floor(timeInMinutes / 5);
  const readPages = Math.floor(timeInMinutes / 2);
  const plannedWeeks = Math.floor(timeInMinutes / 30);

  const stretchingSessions = Math.floor(timeInMinutes / 20);
  const basketballGames = Math.floor(timeInMinutes / 48);
  const walkDistance = (timeInMinutes * 0.08).toFixed(1);
  const caloriesBurned = Math.floor(timeInMinutes * 4.5);

  const playlistsCreated = Math.floor(timeInMinutes / 15);
  const pizzasCooked = Math.floor(timeInMinutes / 45);
  const episodesWatched = (timeInMinutes / 42).toFixed(1);

  const breathsTaken = timeInMinutes * 14;
  const eyeBlinks = timeInMinutes * 17;
  const scrollDistance = (timeInMinutes * 0.01).toFixed(2);
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
                description={`You could: have ${stretchingSessions} stretching sessions`}
              />
              <Card
                iconName="Dribbble"
                title="Match played"
                description={`You could: play ${basketballGames} basketball matches`}
              />
            </View>
            <Card
              isFullWidth
              iconName="Footprints"
              title="An outside walk"
              description={`You could: walk ${walkDistance} km and burn ~${caloriesBurned} kcal`}
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
                description={`You could: master ${wordsLearnt} foreign words`}
              />
              <Card
                iconName="BookOpen"
                title="Book reading"
                description={`You could: read ${readPages} pages of a book`}
              />
            </View>
            <Card
              isFullWidth
              iconName="Calendar"
              title="Weekly activity planning"
              description={`You could: plan the next ${plannedWeeks} weeks of your life`}
            />
          </View>
          <View className="w-full h-[1px] mt-4 rounded bg-[#212121]" />
        </View>
      ) : type === "creativity" ? (
        <View>
          <View className="gap-4">
            <View className="flex-row gap-4">
              <Card
                iconName="Music"
                title="Playlist creation"
                description={`You could: curate ${playlistsCreated} new playlists`}
              />
              <Card
                iconName="ChefHat"
                title="Cooking"
                description={`You could: cook ${pizzasCooked} homemade pizzas`}
              />
            </View>
            <Card
              isFullWidth
              iconName="Clapperboard"
              title="Series watching"
              description={`You could: watch ${episodesWatched} episodes of "The Walking Dead"`}
            />
          </View>
          <View className="w-full h-[1px] mt-4 rounded bg-[#212121]" />
        </View>
      ) : (
        <View>
          <View className="gap-4">
            <View className="flex-row gap-4">
              <Card
                iconName="Smartphone"
                title="Scrolling"
                description={`You have scrolled ${scrollDistance} meters`}
              />
              <Card
                iconName="EyeClosed"
                title="Eye Blinks"
                description={`Your eyes blinked ${eyeBlinks} times`}
              />
            </View>
            <Card
              isFullWidth
              iconName="Wind"
              title="Breath Taken"
              description={`Your lungs processed oxygen through ${breathsTaken} steady breaths `}
            />
          </View>
        </View>
      )}
    </View>
  );
}
