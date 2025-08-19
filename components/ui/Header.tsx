import { useThemedStyles } from "@/hooks/useThemedStyles";
import { styles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightActions?: React.ReactNode;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  rightActions,
  onBackPress,
}) => {
  const router = useRouter();
  const { themedColors } = useThemedStyles();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <ThemedView
      style={[
        styles.header,
        { borderBottomColor: themedColors.border },
      ]}
    >
      <ThemedView style={styles.headerLeft}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={themedColors.text}
            />
          </TouchableOpacity>
        )}
        <ThemedView style={styles.headerText}>
          <ThemedText type="title" style={styles.headerTitle}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText type="default" style={styles.headerSubtitle}>
              {subtitle}
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
      {rightActions && (
        <ThemedView
          style={{
            flexDirection: "row",
            backgroundColor: "transparent",
          }}
        >
          {rightActions}
        </ThemedView>
      )}
    </ThemedView>
  );
};
