import UsageStats from "@/modules/usage-stats";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  value: number;
  setValue: (v: number) => void;
  themeColor: string;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeColors: Record<number, string> = {
    1: "#730031",
    2: "#9D1344",
    3: "#AD154B",
    4: "#859B80",
    5: "#677863",
    6: "#4F5C4C",
  };

  const [value, setValue] = useState(1);
  const themeColor = themeColors[value];

  const { totalMinutes } = UsageStats.sumTime();

  useEffect(() => {
    if (totalMinutes <= 120) {
      setValue(1);
    } else if (totalMinutes > 120 && totalMinutes <= 180) {
      setValue(2);
    } else if (totalMinutes > 180 && totalMinutes <= 270) {
      setValue(3);
    } else if (totalMinutes > 270 && totalMinutes <= 360) {
      setValue(4);
    } else if (totalMinutes > 360 && totalMinutes <= 420) {
      setValue(5);
    } else {
      setValue(6);
    }
  }, [totalMinutes]);

  return (
    <ThemeContext.Provider value={{ value, setValue, themeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within useThemeProvider");
  }
  return ctx;
}
