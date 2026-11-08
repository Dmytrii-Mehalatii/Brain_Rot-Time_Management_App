import { Pressable, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "info" | "primary";
  /** Only meaningful for the "info" variant, which fills in when active. */
  active?: boolean;
  className?: string;
};

const CONTAINER = {
  info: "border-2 border-primary-500 w-[120px] h-10",
  primary: "bg-primary-500 px-8 py-4 border-[1.5px] border-primary-800",
};

const LABEL = {
  info: "font-['SpaceGroteskMedium']",
  primary: "text-white text-center text-xl font-['SpaceGroteskMedium']",
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  active = false,
  className = "",
}: ButtonProps) {
  const filled = variant === "info" && active;

  return (
    <Pressable
      onPress={onPress}
      className={`z-20 items-center justify-center rounded-md ${CONTAINER[variant]} ${filled ? "bg-primary-500" : ""} ${className}`}>
      <Text className={`${LABEL[variant]} ${filled ? "text-white" : ""}`}>
        {title}
      </Text>
    </Pressable>
  );
}
