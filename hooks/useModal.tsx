import { createContext, ReactNode, useContext, useState } from "react";

type ActiveModal = "brain" | "streak" | "weeklyEnemies" | "enemies" | null;

type ModalContextProps = {
  activeModal: ActiveModal;
  setActiveModal: React.Dispatch<React.SetStateAction<ActiveModal>>;
};

const ModalContext = createContext<ModalContextProps | null>(null);

export default function BrainMapProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        setActiveModal,
      }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a BrainMapProvider");
  }
  return ctx;
}
