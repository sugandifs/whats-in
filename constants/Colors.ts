/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#FFB902";
const tintColorDark = "#FFB902";

export const Colors = {
  light: {
    text: "#1A1A21",
    background: "#f4f1e9",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    // Add more semantic colors
    textSecondary: "#6b7280",
    textTertiary: "#9ca3af",
    backgroundSecondary: "#ffffff",
    backgroundTertiary: "#f3f4f6",
    border: "rgba(128, 128, 128, 0.2)",
    borderMedium: "rgba(128, 128, 128, 0.3)",
    borderDark: "#e5e7eb",
    overlay: "rgba(0, 0, 0, 0.5)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    // Dark mode equivalents
    textSecondary: "#9BA1A6",
    textTertiary: "#6b7280",
    backgroundSecondary: "#1a1a1a",
    backgroundTertiary: "#333333",
    border: "#444444",
    borderMedium: "#555555",
    borderDark: "#666666",
    overlay: "rgba(0, 0, 0, 0.7)",
  },
};

export const getColors = (colorScheme: "light" | "dark" | null) => {
  return Colors[colorScheme ?? "light"];
};
