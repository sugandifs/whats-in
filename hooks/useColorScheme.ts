import { useThemeContext } from "@/context/ThemeContext";

export function useColorScheme() {
  try {
    const { colorScheme } = useThemeContext();
    return colorScheme;
  } catch (error) {
    console.warn(
      "ThemeContext not available, falling back to light mode"
    );
    return "light" as const;
  }
}
