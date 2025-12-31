import { Image } from "react-native";

export default function Home() {
  return (
    <Image
      source={require("@/assets/images/brain2.png")}
      style={{ width: "100%", height: undefined, aspectRatio: 1 }}
      resizeMode="contain"
    />
  );
}
