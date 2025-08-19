import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Recipe } from "@/services/types";
import { componentStyles } from "@/styles/componentStyles";
import { getDifficultyColor } from "@/utils/styleHelpers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string, isFavorite: boolean) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  onToggleFavorite,
}) => {
  const { themedColors } = useThemedStyles();

  return (
    <TouchableOpacity
      style={[
        componentStyles.recipeCard,
        {
          borderColor: themedColors.border,
          backgroundColor: themedColors.backgroundSecondary,
        },
      ]}
      onPress={() => onPress(recipe)}
    >
      <ThemedView
        style={[
          componentStyles.recipeImageContainer,
          { backgroundColor: themedColors.backgroundTertiary },
        ]}
      >
        <ThemedText style={componentStyles.recipeEmoji}>
          {recipe.image || "🍽️"}
        </ThemedText>
        {recipe.isOwned && (
          <ThemedView
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: themedColors.success,
              borderRadius: 12,
              padding: 4,
            }}
          >
            <Ionicons name="checkmark-circle" size={16} color="white" />
          </ThemedView>
        )}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: 4,
          }}
          onPress={() =>
            onToggleFavorite(recipe._id, recipe.isFavorite)
          }
        >
          <Ionicons
            name={recipe.isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={
              recipe.isFavorite
                ? themedColors.error
                : themedColors.textSecondary
            }
          />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={componentStyles.recipeInfo}>
        <ThemedText
          type="defaultSemiBold"
          style={componentStyles.recipeName}
        >
          {recipe.name}
        </ThemedText>
        <ThemedText
          type="default"
          style={{
            fontSize: 12,
            opacity: 0.7,
            marginBottom: 8,
          }}
        >
          {recipe.cuisine || "Various"}
        </ThemedText>

        <ThemedView style={componentStyles.recipeStats}>
          <ThemedView style={componentStyles.recipeStat}>
            <Ionicons
              name="time"
              size={14}
              color={themedColors.textSecondary}
            />
            <ThemedText
              type="default"
              style={componentStyles.recipeStatText}
            >
              {recipe.cookTime || "N/A"}
            </ThemedText>
          </ThemedView>
          <ThemedView style={componentStyles.recipeStat}>
            <Ionicons
              name="people"
              size={14}
              color={themedColors.textSecondary}
            />
            <ThemedText
              type="default"
              style={componentStyles.recipeStatText}
            >
              {recipe.servings || "N/A"}
            </ThemedText>
          </ThemedView>
          <ThemedView style={componentStyles.recipeStat}>
            <Ionicons
              name="star"
              size={14}
              color={themedColors.primary}
            />
            <ThemedText
              type="default"
              style={componentStyles.recipeStatText}
            >
              {recipe.rating || "N/A"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {recipe.difficulty && (
          <ThemedView
            style={{
              flexDirection: "row",
              backgroundColor: "transparent",
            }}
          >
            <ThemedView
              style={[
                componentStyles.badge,
                {
                  backgroundColor: getDifficultyColor(
                    recipe.difficulty
                  ),
                },
              ]}
            >
              <ThemedText style={componentStyles.badgeText}>
                {recipe.difficulty}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
};
