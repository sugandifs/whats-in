import { useThemedStyles } from "@/hooks/useThemedStyles";
import { styles } from "@/styles/styles";
import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: any;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const { inputStyle, placeholderColor } = useThemedStyles();

  return (
    <ThemedView style={[styles.formGroup, containerStyle]}>
      <ThemedText type="defaultSemiBold" style={styles.formLabel}>
        {label}
      </ThemedText>
      <TextInput
        style={[styles.formInput, inputStyle, style]}
        placeholderTextColor={placeholderColor}
        {...props}
      />
      {error && (
        <ThemedText
          style={{
            fontSize: 12,
            color: "#ef4444",
            marginTop: 4,
          }}
        >
          {error}
        </ThemedText>
      )}
    </ThemedView>
  );
};
