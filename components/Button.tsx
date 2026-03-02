import { Pressable, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "info" | "primary";
  active?: boolean;
  className?: string;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  active = false,
  className,
}: ButtonProps) {
  const baseStyle = "flex items-center justify-center rounded-md z-20";

  const variants = {
    info: `
      border-2 border-primary-500 w-[120px] h-10
      ${active ? "bg-primary-500" : ""}
    `,
    primary: `
      bg-primary-500 px-8 py-4
      border-[1.5px] border-primary-800
    `,
  };

  const textVariants = {
    info: `
      font-['SpaceGroteskMedium']
      ${active ? "text-white" : ""}
    `,
    primary: `
      text-white text-center text-xl
      font-['SpaceGroteskMedium']
    `,
  };

  return (
    <Pressable
      onPress={onPress}
      className={`${baseStyle} ${variants[variant]} ${className}`}>
      <Text className={textVariants[variant]}>{title}</Text>
    </Pressable>
  );
}
