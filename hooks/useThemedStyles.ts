import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getTheme } from "../styles/theme";

export const useThemedStyles = () => {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  const getThemedColor = (lightColor: string, darkColor?: string) => {
    if (darkColor) {
      return colorScheme === "dark" ? darkColor : lightColor;
    }
    return lightColor;
  };

  const themedColors = {
    text: theme.colors.text,
    textSecondary: theme.colors.textSecondary,
    textTertiary: theme.colors.textTertiary,
    background: theme.colors.background,
    backgroundSecondary: theme.colors.backgroundSecondary,
    backgroundTertiary: theme.colors.backgroundTertiary,
    border: theme.colors.border,
    borderMedium: theme.colors.borderMedium,
    borderDark: theme.colors.borderDark,
    overlay: theme.colors.overlay,
    tint: theme.colors.tint,
    icon: theme.colors.icon,
    primary: theme.colors.primary,
    success: theme.colors.success,
    error: theme.colors.error,
    warning: theme.colors.warning,
    info: theme.colors.info,
    categories: theme.colors.categories,
  };

  const inputStyle = {
    borderColor: themedColors.border,
    backgroundColor: themedColors.backgroundSecondary,
    color: themedColors.text,
  };

  const placeholderColor = colorScheme === "dark" ? "#888" : "#999";

  return {
    colorScheme,
    theme,
    themedColors,
    inputStyle,
    placeholderColor,
    getThemedColor,
    Colors: Colors[colorScheme ?? "light"],
  };
};
