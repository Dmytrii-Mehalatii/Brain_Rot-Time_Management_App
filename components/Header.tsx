import BrainIcon from "@/assets/icons/brain_icon.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import { useModal } from "@/hooks/useModal";
import { Pressable, Text, View } from "react-native";

export default function Header({ title }: { title: string }) {
  const { openModal } = useModal();

  return (
    <View className="flex-1 flex-row gap-5 px-5">
      <Text className="flex-1 font-['SpaceGroteskRegular'] text-3xl text-ink">
        {title}
      </Text>

      <Pressable onPress={() => openModal("streak")}>
        <CalendarIcon
          width={32}
          height={32}
        />
      </Pressable>

      <Pressable onPress={() => openModal("brain")}>
        <BrainIcon
          width={32}
          height={32}
        />
      </Pressable>
    </View>
  );
}
