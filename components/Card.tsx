import { useTheme } from "@/hooks/useTheme";
import type { LucideIcon } from "lucide-react-native";
import * as LucideIcons from "lucide-react-native";
import { Text, View } from "react-native";

type CardProps = {
  iconName: keyof typeof LucideIcons;
  isFullWidth?: boolean;
  title: string;
  description: string;
};

export default function Card({
  iconName,
  isFullWidth,
  title,
  description,
}: CardProps) {
  const { themeColor } = useTheme();
  // eslint-disable-next-line import/namespace
  const Icon = LucideIcons[iconName] as LucideIcon | undefined;

  const renderDescription = (text: string) => {
    const parts = text.split(/(\d+|two weeks|\d+ km|\d+ kcal)/g);
    return parts.map((part, i) => (
      <Text
        key={i}
        style={
          /(\d+|two weeks|km|kcal)/.test(part)
            ? { color: themeColor, fontWeight: "600" }
            : {}
        }>
        {part}
      </Text>
    ));
  };

  return (
    <View
      style={{ borderColor: themeColor }}
      className={`border-[2px] rounded-lg p-3 gap-2 h-fit min-h-[100px] ${
        isFullWidth ? "w-full" : "flex-1"
      }`}>
      <View className="flex-row items-center gap-2">
        {Icon && (
          <Icon
            size={18}
            color="#333"
          />
        )}
        <Text className="font-['SpaceGroteskMedium'] text-[14px] text-gray-900 flex-1">
          {title}
        </Text>
      </View>
      <Text className="font-['SpaceGroteskRegular'] text-[13px] leading-4 text-[#212121]">
        {renderDescription(description)}
      </Text>
    </View>
  );
}
