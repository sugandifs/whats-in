import { useKeyboard } from "@/hooks/useKeyboard";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

interface KeyboardAvoidingContainerProps {
  children: React.ReactNode;
  style?: any;
}

export const KeyboardAvoidingContainer: React.FC<
  KeyboardAvoidingContainerProps
> = ({ children, style }) => {
  const { keyboardHeight } = useKeyboard();

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
