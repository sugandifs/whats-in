import { getColors } from "@/constants/Colors";
import { TextStyle } from "react-native";

type FontWeight = TextStyle["fontWeight"];

export const baseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  typography: {
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
      huge: 28,
    },
    weights: {
      normal: "400" as FontWeight,
      medium: "500" as FontWeight,
      semibold: "600" as FontWeight,
      bold: "700" as FontWeight,
    },
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },

  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
  },

  colors: {
    primary: "#FFB902",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",

    // Category colors
    categories: {
      fresh: "#22c55e",
      dairy: "#3b82f6",
      meat: "#ef4444",
      pantry: "#8b5cf6",
      frozen: "#06b6d4",
      bakery: "#f59e0b",
    },
  },
};

// Function to get complete theme with colors for current scheme
export const getTheme = (
  colorScheme: "light" | "dark" | null = "light"
) => {
  const colors = getColors(colorScheme);

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      // Theme-aware colors from Expo's system
      text: colors.text,
      textSecondary: colors.textSecondary,
      textTertiary: colors.textTertiary,
      background: colors.background,
      backgroundSecondary: colors.backgroundSecondary,
      backgroundTertiary: colors.backgroundTertiary,
      border: colors.border,
      borderMedium: colors.borderMedium,
      borderDark: colors.borderDark,
      overlay: colors.overlay,
      tint: colors.tint,
      icon: colors.icon,
    },
  };
};
