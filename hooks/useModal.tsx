import { createContext, ReactNode, useContext, useState } from "react";

type ModalContextProps = {
  isBrainModalVisible: boolean;
  setIsBrainModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isStreakModalVisible: boolean;
  setIsStreakModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalContext = createContext<ModalContextProps | null>(null);

export default function BrainMapProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isBrainModalVisible, setIsBrainModalVisible] = useState(false);
  const [isStreakModalVisible, setIsStreakModalVisible] = useState(false);
  return (
    <ModalContext.Provider
      value={{
        isBrainModalVisible,
        setIsBrainModalVisible,
        isStreakModalVisible,
        setIsStreakModalVisible,
      }}>
      {children}
    </ModalContext.Provider>
  );
}

//useModal
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a BrainMapProvider");
  }
  return ctx;
}
