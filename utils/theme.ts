import { Colors } from "@/constants/Colors";
import { useColorScheme as useRNColorScheme } from "react-native";

export const useThemeColors = () => {
  const colorScheme = useRNColorScheme();
  return {
    colorScheme,
    themedColors: Colors[colorScheme ?? "light"],
  };
};
