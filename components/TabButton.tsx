import colors from "@/constants/colors";
import { useTheme } from "@/hooks/useTheme";
import type { TabTriggerSlotProps } from "expo-router/ui";
import type { ComponentType } from "react";
import { Pressable } from "react-native";
import type { SvgProps } from "react-native-svg";

type TabButtonProps = TabTriggerSlotProps & {
  icon: ComponentType<SvgProps>;
};

export function TabButton({ icon: Icon, isFocused, ...props }: TabButtonProps) {
  const { themeColor } = useTheme();
  const size = isFocused ? 40 : 36;

  return (
    <Pressable
      {...props}
      style={{ width: 56, height: 56, alignItems: "center", padding: 10 }}>
      <Icon
        fill={isFocused ? themeColor : colors.ink}
        width={size}
        height={size}
      />
    </Pressable>
  );
}
