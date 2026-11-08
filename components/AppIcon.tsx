import { Image } from "expo-image";

type AppIconProps = {
  /** Base64 PNG as delivered by the native module. */
  icon: string;
  size: number;
};

export default function AppIcon({ icon, size }: AppIconProps) {
  return (
    <Image
      source={{ uri: `data:image/png;base64,${icon}` }}
      style={{ width: size, height: size }}
    />
  );
}
