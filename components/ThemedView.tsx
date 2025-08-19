import { useThemedStyles } from "@/hooks/useThemedStyles";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { themedColors, getThemedColor } = useThemedStyles();

  const backgroundColor =
    lightColor || darkColor
      ? getThemedColor(lightColor!, darkColor)
      : themedColors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
