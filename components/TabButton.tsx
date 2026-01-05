import { useTheme } from "@/hooks/useTheme";
import { TabTriggerSlotProps } from "expo-router/ui";
import { cloneElement, ReactElement } from "react";
import { Pressable } from "react-native";

export type TabButtonProps = TabTriggerSlotProps & {
  children: ReactElement;
};

export function TabButton({ children, isFocused, ...props }: TabButtonProps) {
  const { textColor } = useTheme();

  return (
    <Pressable
      {...props}
      style={{
        width: 56,
        height: 56,
        alignItems: "center",
        padding: 10,
      }}>
      {cloneElement(children, {
        fill: isFocused ? textColor : "#212121",
        width: isFocused ? 40 : 36,
        height: isFocused ? 40 : 36,
      })}
    </Pressable>
  );
}
