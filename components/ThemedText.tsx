import { useThemedStyles } from "@/hooks/useThemedStyles";
import { baseTheme } from "@/styles/theme";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { themedColors, getThemedColor } = useThemedStyles();

  const color =
    lightColor || darkColor
      ? getThemedColor(lightColor!, darkColor)
      : themedColors.text;

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link"
          ? [styles.link, { color: themedColors.tint }]
          : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: baseTheme.typography.sizes.lg,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: baseTheme.typography.sizes.lg,
    lineHeight: 24,
    fontWeight: baseTheme.typography.weights.semibold,
  },
  title: {
    fontSize: baseTheme.typography.sizes.xxxl,
    fontWeight: baseTheme.typography.weights.bold,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: baseTheme.typography.sizes.xl,
    fontWeight: baseTheme.typography.weights.bold,
  },
  link: {
    fontSize: baseTheme.typography.sizes.lg,
    lineHeight: 30,
  },
});
