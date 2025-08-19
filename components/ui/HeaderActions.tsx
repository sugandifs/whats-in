import { useThemedStyles } from "@/hooks/useThemedStyles";
import { styles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface HeaderActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

export const HeaderAction: React.FC<HeaderActionProps> = ({
  icon,
  onPress,
  color,
}) => {
  const { themedColors } = useThemedStyles();

  return (
    <TouchableOpacity style={styles.headerAction} onPress={onPress}>
      <Ionicons
        name={icon}
        size={24}
        color={color || themedColors.text}
      />
    </TouchableOpacity>
  );
};
