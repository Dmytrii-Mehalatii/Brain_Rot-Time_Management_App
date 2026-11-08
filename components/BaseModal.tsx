import colors from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { PropsWithChildren } from "react";
import { Modal, Pressable, View } from "react-native";

type BaseModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

/** Centered card with a dimmed backdrop and a close button in the corner. */
export default function BaseModal({
  visible,
  onClose,
  children,
}: BaseModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/20">
        <View className="relative w-[85%] rounded-2xl border border-black bg-white px-2 pb-10 shadow-lg">
          <Pressable
            onPress={onClose}
            className="absolute right-6 top-6 z-20">
            <MaterialIcons
              name="close"
              color={colors.ink}
              size={36}
            />
          </Pressable>

          {children}
        </View>
      </View>
    </Modal>
  );
}
