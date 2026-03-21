import { useTheme } from "@/hooks/useTheme";
import { useMemo } from "react";
import { Image } from "react-native";

const brainImages = [
  require("@/assets/images/mainBrain/1_stage_Brain.png"),
  require("@/assets/images/mainBrain/2_stage_Brain.png"),
  require("@/assets/images/mainBrain/3_stage_Brain.png"),
  require("@/assets/images/mainBrain/4_stage_Brain.png"),
  require("@/assets/images/mainBrain/5_stage_Brain.png"),
  require("@/assets/images/mainBrain/6_stage_Brain.png"),
];

export default function MainImage() {
  const theme = useTheme();

  const source = useMemo(() => {
    const idx = theme.value - 1;
    return brainImages[idx] ?? brainImages[brainImages.length - 1];
  }, [theme.value]);

  return (
    <Image
      source={source}
      style={{ width: "100%", height: undefined, aspectRatio: 1 }}
      resizeMode="contain"
    />
  );
}
