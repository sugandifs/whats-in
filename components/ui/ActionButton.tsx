import { useThemedStyles } from "@/hooks/useThemedStyles";
import { darkenColor } from "@/styles";
import { styles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../ThemedText";

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  icon,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}) => {
  const { themedColors, colorScheme } = useThemedStyles();

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.button];

    switch (variant) {
      case "primary":
        baseStyles.push({ backgroundColor: themedColors.primary });
        break;
      case "secondary":
        baseStyles.push({
          backgroundColor: themedColors.backgroundSecondary,
          borderWidth: 1,
          borderColor: themedColors.border,
        });
        break;
      case "outline":
        baseStyles.push({
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: themedColors.primary,
        });
        break;
    }

    if (disabled || loading) {
      baseStyles.push({ opacity: 0.6 });
    }

    return baseStyles;
  };

  // Get a darker version of the primary color for better accessibility
  const getDarkerPrimaryColor = () => {
    return darkenColor(themedColors.primary, 40); // Darken by 40%
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return styles.buttonText;
      case "secondary":
        return { ...styles.buttonText, color: themedColors.text };
      case "outline":
        return {
          ...styles.buttonText,
          // Use darker primary color in light mode for accessibility, primary color in dark mode
          color:
            colorScheme === "light"
              ? getDarkerPrimaryColor()
              : themedColors.primary,
        };
      default:
        return styles.buttonText;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "primary":
        return "white";
      case "secondary":
        return themedColors.text;
      case "outline":
        // Use darker primary color in light mode for accessibility, primary color in dark mode
        return colorScheme === "light"
          ? getDarkerPrimaryColor()
          : themedColors.primary;
      default:
        return "white";
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={getIconColor()}
              style={{ marginRight: 8 }}
            />
          )}
          <ThemedText style={getTextStyle()}>{title}</ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
};
