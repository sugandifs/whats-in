import { useThemedStyles } from "@/hooks/useThemedStyles";
import { styles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionText,
  onActionPress,
}) => {
  const { themedColors } = useThemedStyles();

  return (
    <ThemedView
      style={[
        styles.emptyState,
        {
          backgroundColor: themedColors.backgroundTertiary,
          borderColor: themedColors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={48}
        color={themedColors.textSecondary}
      />
      <ThemedText style={[styles.emptyText, { fontSize: 18 }]}>
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText style={styles.emptyText}>{subtitle}</ThemedText>
      )}
      {actionText && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <ThemedText type="link">{actionText}</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
};
