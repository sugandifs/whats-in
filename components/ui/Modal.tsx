import { useThemedStyles } from "@/hooks/useThemedStyles";
import { styles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal as RNModal,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "fullscreen";
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = "medium",
}) => {
  const { themedColors } = useThemedStyles();

  const getModalStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {};

    switch (size) {
      case "small":
        baseStyle.width = "80%";
        baseStyle.maxWidth = 400;
        break;
      case "large":
        baseStyle.width = "95%";
        baseStyle.maxWidth = 600;
        break;
      case "fullscreen":
        baseStyle.width = "100%";
        baseStyle.height = "100%";
        baseStyle.margin = 0;
        baseStyle.borderRadius = 0;
        break;
      default:
        baseStyle.width = "90%";
        baseStyle.maxWidth = 500;
        break;
    }

    return baseStyle;
  };

  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ThemedView
        style={[
          styles.modalOverlay,
          { backgroundColor: themedColors.overlay },
        ]}
      >
        <ThemedView
          style={[
            styles.modalContent,
            {
              backgroundColor: themedColors.backgroundSecondary,
              borderColor: themedColors.border,
            },
            getModalStyle(),
            size === "fullscreen" && {
              justifyContent: "flex-start" as const,
            },
          ]}
        >
          <ThemedView
            style={[
              styles.modalHeader,
              { borderBottomColor: themedColors.border },
            ]}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {title}
            </ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={themedColors.text}
              />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.modalBody}>{children}</ThemedView>
        </ThemedView>
      </ThemedView>
    </RNModal>
  );
};
