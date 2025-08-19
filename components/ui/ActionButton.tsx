import { useThemedStyles } from "@/hooks/useThemedStyles";
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
  const { themedColors } = useThemedStyles();

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

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return styles.buttonText;
      case "secondary":
        return { ...styles.buttonText, color: themedColors.text };
      case "outline":
        return {
          ...styles.buttonText,
          color: themedColors.primary,
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
        return themedColors.primary;
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
