import { useThemedStyles } from "@/hooks/useThemedStyles";
import { styles } from "@/styles/styles";
import React from "react";
import { ActivityIndicator } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "large",
  color,
}) => {
  const { themedColors } = useThemedStyles();

  return (
    <ThemedView style={[styles.container, styles.centered]}>
      <ActivityIndicator
        size={size}
        color={color || themedColors.primary}
      />
      {message && (
        <ThemedText style={{ marginTop: 16 }}>{message}</ThemedText>
      )}
    </ThemedView>
  );
};
