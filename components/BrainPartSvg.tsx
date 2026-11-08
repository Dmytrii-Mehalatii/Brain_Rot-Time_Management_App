import type { BrainPartShape } from "@/types";
import Svg, { Path, type SvgProps } from "react-native-svg";

type BrainPartSvgProps = {
  shape: BrainPartShape;
  baseColor: string;
  accentColor: string;
  height: SvgProps["height"];
};

export default function BrainPartSvg({
  shape,
  baseColor,
  accentColor,
  height,
}: BrainPartSvgProps) {
  return (
    <Svg
      width="100%"
      height={height}
      viewBox={shape.viewBox}>
      {shape.paths.map((path, index) => (
        <Path
          key={index}
          d={path.d}
          fill={path.tone === "accent" ? accentColor : baseColor}
        />
      ))}
    </Svg>
  );
}
