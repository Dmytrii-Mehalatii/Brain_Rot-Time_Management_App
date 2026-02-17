import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal, Pressable, View } from "react-native";

type BaseModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

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
      <View className="flex-1 justify-center items-center bg-black/55">
        <View className="relative w-[85%] h-fit pb-10 bg-white border-2 border-black px-2 rounded-2xl shadow-lg">
          <Pressable
            onPress={onClose}
            className="absolute top-6 right-6 z-20">
            <MaterialIcons
              name="close"
              color="#000"
              size={36}
            />
          </Pressable>

          {children}
        </View>
      </View>
    </Modal>
  );
}
