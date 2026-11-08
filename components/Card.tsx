import { useTheme } from "@/hooks/useTheme";
import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

type CardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  isFullWidth?: boolean;
};

/** Numbers and their units, e.g. "3.2 km" or "~900 kcal", get the theme color. */
const HIGHLIGHT = /(\d+(?:\.\d+)?(?: ?(?:km|kcal))?)/;

export default function Card({
  icon: Icon,
  title,
  description,
  isFullWidth = false,
}: CardProps) {
  const { themeColor } = useTheme();

  return (
    <View
      style={{ borderColor: themeColor }}
      className={`min-h-[100px] gap-2 rounded-lg border-2 p-3 ${isFullWidth ? "w-full" : "flex-1"}`}>
      <View className="flex-row items-center gap-2">
        <Icon
          size={18}
          color="#333"
        />
        <Text className="flex-1 font-['SpaceGroteskMedium'] text-[14px] text-gray-900">
          {title}
        </Text>
      </View>
      <Text className="font-['SpaceGroteskRegular'] text-[13px] leading-4 text-ink">
        {/* split() with a capture group puts every match at an odd index. */}
        {description.split(HIGHLIGHT).map((part, index) =>
          index % 2 === 1 ? (
            <Text
              key={index}
              className="font-['SpaceGroteskMedium']"
              style={{ color: themeColor }}>
              {part}
            </Text>
          ) : (
            part
          ),
        )}
      </Text>
    </View>
  );
}
