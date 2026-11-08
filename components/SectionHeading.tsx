import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { useTheme } from "@/hooks/useTheme";
import { Pressable, Text, View } from "react-native";

type SectionHeadingProps = {
  title: string;
  /** When given, a "see more" link appears on the right. */
  onSeeMore?: () => void;
  className?: string;
};

export default function SectionHeading({
  title,
  onSeeMore,
  className = "",
}: SectionHeadingProps) {
  const { themeColor } = useTheme();
  const isSmall = useIsSmallScreen();

  return (
    <View className={`w-full flex-row items-center ${className}`}>
      <Text
        className={`w-full flex-shrink font-['SpaceGroteskRegular'] ${isSmall ? "text-lg" : "text-xl"}`}>
        {title}
      </Text>
      {onSeeMore && (
        <Pressable onPress={onSeeMore}>
          <Text
            className="font-['SpaceGroteskMedium'] underline"
            style={{ color: themeColor }}>
            see more
          </Text>
        </Pressable>
      )}
    </View>
  );
}
