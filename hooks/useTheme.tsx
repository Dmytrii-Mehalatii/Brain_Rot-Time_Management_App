import UsageStats from "@/modules/usage-stats";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  value: number;
  setValue: (v: number) => void;
  textColor: string;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeColors: Record<number, string> = {
    1: "#9D1344",
    2: "#D993AC",
    3: "#BBDBB4",
    4: "#AAC7A4",
    5: "#859B80",
    6: "#677863",
  };

  const [value, setValue] = useState(1);
  const textColor = themeColors[value];

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
    <ThemeContext.Provider value={{ value, setValue, textColor }}>
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
