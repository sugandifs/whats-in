import { useThemedStyles } from "@/hooks/useThemedStyles";
import { baseTheme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput } from "react-native";
import { ThemedView } from "../ThemedView";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  style,
}) => {
  const { themedColors, placeholderColor } = useThemedStyles();

  return (
    <ThemedView
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: baseTheme.spacing.lg,
          paddingVertical: baseTheme.spacing.md,
          borderRadius: baseTheme.borderRadius.md,
          borderWidth: 1,
          borderColor: themedColors.border,
          backgroundColor: themedColors.backgroundTertiary,
        },
        style,
      ]}
    >
      <Ionicons name="search" size={20} color={themedColors.icon} />
      <TextInput
        style={{
          flex: 1,
          fontSize: baseTheme.typography.sizes.lg,
          marginLeft: baseTheme.spacing.md,
          color: themedColors.text,
        }}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
      />
    </ThemedView>
  );
};
