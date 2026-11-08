import { View } from "react-native";

type DividerProps = {
  /** Spacing classes, e.g. "my-10". */
  className?: string;
  thickness?: number;
};

export default function Divider({
  className = "",
  thickness = 1,
}: DividerProps) {
  return (
    <View
      className={`w-full bg-ink ${className}`}
      style={{ height: thickness }}
    />
  );
}
