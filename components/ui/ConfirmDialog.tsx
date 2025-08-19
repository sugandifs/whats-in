import { useThemedStyles } from "@/hooks/useThemedStyles";
import { baseTheme } from "@/styles/theme";
import React from "react";
import { ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { ActionButton } from "./ActionButton";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
}) => {
  const { themedColors } = useThemedStyles();

  const getConfirmButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = { flex: 1 };

    if (destructive) {
      baseStyle.borderColor = themedColors.error;
      baseStyle.backgroundColor = `${themedColors.error}10`;
    }

    return baseStyle;
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size="small"
    >
      <ThemedText
        style={{
          fontSize: 16,
          lineHeight: 22,
          marginBottom: baseTheme.spacing.xxl,
        }}
      >
        {message}
      </ThemedText>

      <ThemedView
        style={{
          flexDirection: "row",
          gap: baseTheme.spacing.md,
          backgroundColor: "transparent",
        }}
      >
        <ActionButton
          title={cancelText}
          variant="outline"
          onPress={onClose}
          style={{ flex: 1 }}
        />
        <ActionButton
          title={confirmText}
          variant={destructive ? "outline" : "primary"}
          onPress={() => {
            onConfirm();
            onClose();
          }}
          style={getConfirmButtonStyle()}
        />
      </ThemedView>
    </Modal>
  );
};
