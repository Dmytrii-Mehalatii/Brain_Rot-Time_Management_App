import { createContext, ReactNode, useContext, useState } from "react";

type BrainMapContextProps = {
  isBrainModalVisible: boolean;
  setIsBrainModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const BrainMapContext = createContext<BrainMapContextProps | null>(null);

export default function BrainMapProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isBrainModalVisible, setIsBrainModalVisible] = useState(false);
  return (
    <BrainMapContext.Provider
      value={{
        isBrainModalVisible,
        setIsBrainModalVisible,
      }}>
      {children}
    </BrainMapContext.Provider>
  );
}

export function useBrainMap() {
  const ctx = useContext(BrainMapContext);
  if (!ctx) {
    throw new Error("useBrainMap must be used within a BrainMapProvider");
  }
  return ctx;
}
