import { createStrictContext } from "@/utils/createStrictContext";
import { useState, type PropsWithChildren } from "react";

export type ActiveModal = "brain" | "streak" | "enemies" | "weeklyEnemies";

type ModalState = {
  activeModal: ActiveModal | null;
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;
};

const [ModalContextProvider, useModal] =
  createStrictContext<ModalState>("ModalProvider");

/** Only one modal is open at a time, so a single piece of state names which. */
export function ModalProvider({ children }: PropsWithChildren) {
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);

  return (
    <ModalContextProvider
      value={{
        activeModal,
        openModal: setActiveModal,
        closeModal: () => setActiveModal(null),
      }}>
      {children}
    </ModalContextProvider>
  );
}

export { useModal };
