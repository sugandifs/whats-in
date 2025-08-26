import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PantryItem } from "@/services/types";
import { componentStyles } from "@/styles/componentStyles";
import { baseTheme } from "@/styles/theme";
import { CONSTANTS } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface PantryItemCardProps {
  item: PantryItem;
  onQuantityUpdate: (itemId: string, newQuantity: number) => void;
  onLongPress?: (itemId: string) => void;
  viewMode?: "grid" | "list";
}

export const PantryItemCard: React.FC<PantryItemCardProps> = ({
  item,
  onQuantityUpdate,
  onLongPress,
  viewMode = "grid",
}) => {
  const { themedColors } = useThemedStyles();
  const location = CONSTANTS.LOCATIONS.find(
    (loc) => loc.id === item.location
  );

  return (
    <TouchableOpacity
      style={[
        componentStyles.itemCard,
        {
          borderColor: themedColors.border,
          backgroundColor: themedColors.backgroundSecondary,
        },
        viewMode === "list" && {
          flexDirection: "row",
          alignItems: "center",
        },
      ]}
      onLongPress={() => onLongPress?.(item._id)}
    >
      <ThemedView style={componentStyles.itemHeader}>
        <ThemedText style={componentStyles.itemEmoji}>
          {item.emoji}
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ flex: 1, backgroundColor: "transparent" }}>
        <ThemedText
          type="defaultSemiBold"
          style={componentStyles.itemName}
        >
          {item.name}
        </ThemedText>

        <ThemedView
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: baseTheme.spacing.sm,
            backgroundColor: "transparent",
          }}
        >
          <TouchableOpacity
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: `${themedColors.primary}20`,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              onQuantityUpdate(item._id, item.quantity - 1)
            }
          >
            <Ionicons
              name="remove"
              size={16}
              color={themedColors.primary}
            />
          </TouchableOpacity>

          <ThemedText
            type="default"
            style={[
              componentStyles.itemQuantity,
              {
                marginHorizontal: baseTheme.spacing.sm,
                marginBottom: 0,
              },
            ]}
          >
            {item.quantity} {item.unit}
          </ThemedText>

          <TouchableOpacity
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: `${themedColors.primary}20`,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              onQuantityUpdate(item._id, item.quantity + 1)
            }
          >
            <Ionicons
              name="add"
              size={16}
              color={themedColors.primary}
            />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={{ backgroundColor: "transparent" }}>
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
              backgroundColor: "transparent",
            }}
          >
            <Ionicons
              name={location?.icon as any}
              size={12}
              color={themedColors.textSecondary}
            />
            <ThemedText
              type="default"
              style={{
                fontSize: 12,
                marginLeft: 6,
                opacity: 0.7,
              }}
            >
              {location?.name}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {item.notes && (
          <ThemedText
            type="default"
            style={{
              fontSize: 12,
              opacity: 0.6,
              marginTop: 4,
              fontStyle: "italic",
            }}
          >
            {item.notes}
          </ThemedText>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
};
