import BrainIcon from "@/assets/icons/brain_icon.svg";
import Calendar from "@/assets/icons/calendar.svg";
import { useModal } from "@/hooks/useModal";
import { Pressable, Text, View } from "react-native";

type HeaderProps = {
  title: string;
  brainIcon: boolean;
};

export default function Header({ title, brainIcon }: HeaderProps) {
  const { setIsBrainModalVisible } = useModal();
  return (
    <View className="flex-1 flex-row gap-5 px-5">
      <Text
        className="text-3xl w-full flex-shrink text-[#212121]"
        style={{ fontFamily: "SpaceGroteskRegular" }}>
        {title}
      </Text>
      <Calendar
        width={32}
        height={32}
        color="212121"
      />
      {brainIcon && (
        <Pressable onPress={() => setIsBrainModalVisible((prev) => !prev)}>
          <BrainIcon
            color="#212121"
            width={32}
            height={32}
          />
        </Pressable>
      )}
    </View>
  );
}
