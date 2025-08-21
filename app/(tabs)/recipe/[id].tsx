import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/services/api";
import { Recipe } from "@/services/types";
import { recipeDetailsStyles } from "@/styles/pages";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const THEME_COLOR = "#FFB902";

export default function RecipeDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const colorScheme = useColorScheme();

  // Load recipe details
  const loadRecipe = async () => {
    if (!id) {
      console.error("No recipe ID provided");
      Alert.alert("Error", "Recipe ID not found");
      router.back();
      return;
    }

    try {
      console.log("Loading recipe with ID:", id);
      setLoading(true);

      const recipeData = await ApiService.getRecipe(id);
      console.log("Recipe data loaded:", recipeData);

      setRecipe(recipeData);
      setIsFavorite(recipeData.isFavorite || false);
    } catch (error) {
      console.error("Failed to load recipe:", error);

      Alert.alert("Error", "Failed to load recipe. Please try again.", [
        {
          text: "Go Back",
          onPress: () => router.back(),
        },
        {
          text: "Try Again",
          onPress: () => loadRecipe(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipe();
    setRefreshing(false);
  };

  useEffect(() => {
    if (currentUser && id) {
      loadRecipe();
    }
  }, [currentUser, id]);

  const handleToggleFavorite = async (
    recipeId: string,
    currentIsFavorite: boolean
  ) => {
    // Optimistic update - immediately update UI
    const newFavoriteStatus = !currentIsFavorite;
    setIsFavorite(newFavoriteStatus);

    try {
      console.log(
        `Toggling favorite for recipe ${recipeId}: ${
          currentIsFavorite ? "removing" : "adding"
        }`
      );

      if (currentIsFavorite) {
        await ApiService.removeFromFavorites(recipeId);
        console.log("Successfully removed from favorites");
      } else {
        await ApiService.addToFavorites(recipeId);
        console.log("Successfully added to favorites");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);

      setIsFavorite(currentIsFavorite);

      Alert.alert("Error", "Failed to update favorite status.");
    }
  };

  const shareRecipe = async () => {
    if (!recipe) return;

    try {
      const shareContent = `Check out this recipe: ${recipe.name}\n\n${
        recipe.description
      }\n\nIngredients:\n${recipe.ingredients.join(
        "\n"
      )}\n\nInstructions:\n${recipe.instructions
        .map((step, index) => `${index + 1}. ${step}`)
        .join("\n")}`;

      await Share.share({
        message: shareContent,
        title: recipe.name,
      });
    } catch (error) {
      console.error("Failed to share recipe:", error);
    }
  };

  const editRecipe = () => {
    if (!recipe) return;
    router.push(`/edit-recipe/${recipe._id}`);
  };

  const deleteRecipe = () => {
    if (!recipe) return;

    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await ApiService.deleteRecipe(recipe._id);
              Alert.alert("Success", "Recipe deleted successfully!");
              router.back();
            } catch (error) {
              console.error("Failed to delete recipe:", error);
              Alert.alert(
                "Error",
                "Failed to delete recipe. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return THEME_COLOR;
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "N/A";
    return time.replace(
      /(\d+)\s*(min|minute|minutes|hr|hour|hours)/gi,
      (match, num, unit) => {
        const shortUnit = unit.startsWith("h") ? "hr" : "min";
        return `${num} ${shortUnit}`;
      }
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          recipeDetailsStyles.container,
          recipeDetailsStyles.centered,
        ]}
      >
        <ActivityIndicator size="large" color={THEME_COLOR} />
        <ThemedText style={{ marginTop: 16 }}>
          Loading recipe...
        </ThemedText>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView
        style={[
          recipeDetailsStyles.container,
          recipeDetailsStyles.centered,
        ]}
      >
        <Ionicons
          name="document-outline"
          size={64}
          color={colorScheme === "dark" ? "#666" : "#ccc"}
        />
        <ThemedText style={{ marginTop: 16 }}>
          Recipe not found
        </ThemedText>
        <TouchableOpacity
          style={[
            recipeDetailsStyles.button,
            { backgroundColor: THEME_COLOR, marginTop: 16 },
          ]}
          onPress={() => router.back()}
        >
          <ThemedText style={recipeDetailsStyles.buttonText}>
            Go Back
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={recipeDetailsStyles.container}>
      <StatusBar
        barStyle={
          colorScheme === "dark" ? "light-content" : "dark-content"
        }
      />

      {/* Header */}
      <ThemedView style={recipeDetailsStyles.header}>
        <TouchableOpacity
          style={recipeDetailsStyles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#333"}
          />
        </TouchableOpacity>

        <ThemedView style={recipeDetailsStyles.headerActions}>
          <TouchableOpacity
            style={recipeDetailsStyles.headerButton}
            onPress={shareRecipe}
          >
            <Ionicons
              name="share-outline"
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={recipeDetailsStyles.headerButton}
            onPress={() => handleToggleFavorite(recipe._id, isFavorite)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={
                isFavorite
                  ? "#ef4444"
                  : colorScheme === "dark"
                  ? "#fff"
                  : "#666"
              }
            />
          </TouchableOpacity>

          {recipe.isOwned && (
            <TouchableOpacity
              style={recipeDetailsStyles.headerButton}
              onPress={editRecipe}
            >
              <Ionicons
                name="create-outline"
                size={24}
                color={colorScheme === "dark" ? "#fff" : "#666"}
              />
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>

      <ScrollView
        style={recipeDetailsStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[THEME_COLOR]}
          />
        }
      >
        {/* Recipe Header */}
        <ThemedView style={recipeDetailsStyles.recipeHeader}>
          <ThemedText style={recipeDetailsStyles.recipeEmoji}>
            {recipe.image || "🍽️"}
          </ThemedText>
          <ThemedText
            type="title"
            style={recipeDetailsStyles.recipeName}
          >
            {recipe.name}
          </ThemedText>
          <ThemedText
            type="default"
            style={recipeDetailsStyles.recipeDescription}
          >
            {recipe.description}
          </ThemedText>

          {/* Badges */}
          <ThemedView style={recipeDetailsStyles.badgesContainer}>
            {recipe.isOwned && (
              <ThemedView
                style={[
                  recipeDetailsStyles.badge,
                  { backgroundColor: "#10b981" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="white"
                />
                <ThemedText style={recipeDetailsStyles.badgeText}>
                  Your Recipe
                </ThemedText>
              </ThemedView>
            )}

            {recipe.tags?.includes("ai-generated") && (
              <ThemedView
                style={[
                  recipeDetailsStyles.badge,
                  { backgroundColor: THEME_COLOR },
                ]}
              >
                <Ionicons name="sparkles" size={14} color="white" />
                <ThemedText style={recipeDetailsStyles.badgeText}>
                  AI Generated
                </ThemedText>
              </ThemedView>
            )}

            <ThemedView
              style={[
                recipeDetailsStyles.badge,
                {
                  backgroundColor: getDifficultyColor(
                    recipe.difficulty || "Medium"
                  ),
                },
              ]}
            >
              <ThemedText style={recipeDetailsStyles.badgeText}>
                {recipe.difficulty || "Medium"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Recipe Stats */}
        <ThemedView style={recipeDetailsStyles.statsContainer}>
          <ThemedView style={recipeDetailsStyles.statItem}>
            <Ionicons name="time" size={20} color={THEME_COLOR} />
            <ThemedText
              type="defaultSemiBold"
              style={recipeDetailsStyles.statLabel}
            >
              Prep Time
            </ThemedText>
            <ThemedText
              type="default"
              style={recipeDetailsStyles.statValue}
            >
              {formatTime(recipe.prepTime || "N/A")}
            </ThemedText>
          </ThemedView>

          <ThemedView style={recipeDetailsStyles.statItem}>
            <Ionicons name="flame" size={20} color={THEME_COLOR} />
            <ThemedText
              type="defaultSemiBold"
              style={recipeDetailsStyles.statLabel}
            >
              Cook Time
            </ThemedText>
            <ThemedText
              type="default"
              style={recipeDetailsStyles.statValue}
            >
              {formatTime(recipe.cookTime || "N/A")}
            </ThemedText>
          </ThemedView>

          <ThemedView style={recipeDetailsStyles.statItem}>
            <Ionicons name="people" size={20} color={THEME_COLOR} />
            <ThemedText
              type="defaultSemiBold"
              style={recipeDetailsStyles.statLabel}
            >
              Servings
            </ThemedText>
            <ThemedText
              type="default"
              style={recipeDetailsStyles.statValue}
            >
              {recipe.servings || "4"}
            </ThemedText>
          </ThemedView>

          <ThemedView style={recipeDetailsStyles.statItem}>
            <Ionicons name="star" size={20} color={THEME_COLOR} />
            <ThemedText
              type="defaultSemiBold"
              style={recipeDetailsStyles.statLabel}
            >
              Rating
            </ThemedText>
            <ThemedText
              type="default"
              style={recipeDetailsStyles.statValue}
            >
              {recipe.rating || "New"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Ingredients Section */}
        <ThemedView style={recipeDetailsStyles.section}>
          <ThemedView style={recipeDetailsStyles.sectionHeader}>
            <Ionicons name="list" size={24} color={THEME_COLOR} />
            <ThemedText
              type="subtitle"
              style={recipeDetailsStyles.sectionTitle}
            >
              Ingredients ({recipe.ingredients?.length || 0})
            </ThemedText>
          </ThemedView>

          <ThemedView style={recipeDetailsStyles.ingredientsList}>
            {recipe.ingredients?.map((ingredient, index) => (
              <ThemedView
                key={index}
                style={recipeDetailsStyles.ingredientItem}
              >
                <ThemedView
                  style={recipeDetailsStyles.ingredientBullet}
                />
                <ThemedText style={recipeDetailsStyles.ingredientText}>
                  {ingredient}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Instructions Section */}
        <ThemedView style={recipeDetailsStyles.section}>
          <ThemedView style={recipeDetailsStyles.sectionHeader}>
            <Ionicons
              name="document-text"
              size={24}
              color={THEME_COLOR}
            />
            <ThemedText
              type="subtitle"
              style={recipeDetailsStyles.sectionTitle}
            >
              Instructions ({recipe.instructions?.length || 0} steps)
            </ThemedText>
          </ThemedView>

          <ThemedView style={recipeDetailsStyles.instructionsList}>
            {recipe.instructions?.map((instruction, index) => (
              <ThemedView
                key={index}
                style={recipeDetailsStyles.instructionItem}
              >
                <ThemedView style={recipeDetailsStyles.stepNumber}>
                  <ThemedText style={recipeDetailsStyles.stepText}>
                    {index + 1}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={recipeDetailsStyles.instructionText}>
                  {instruction}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Tags Section */}
        {recipe.tags && recipe.tags.length > 0 && (
          <ThemedView style={recipeDetailsStyles.section}>
            <ThemedView style={recipeDetailsStyles.sectionHeader}>
              <Ionicons
                name="pricetags"
                size={24}
                color={THEME_COLOR}
              />
              <ThemedText
                type="subtitle"
                style={recipeDetailsStyles.sectionTitle}
              >
                Tags
              </ThemedText>
            </ThemedView>

            <ThemedView style={recipeDetailsStyles.tagsList}>
              {recipe.tags.map((tag, index) => (
                <ThemedView key={index} style={recipeDetailsStyles.tag}>
                  <ThemedText style={recipeDetailsStyles.tagText}>
                    #{tag}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {/* Recipe Info */}
        <ThemedView style={recipeDetailsStyles.section}>
          <ThemedView style={recipeDetailsStyles.sectionHeader}>
            <Ionicons
              name="information-circle"
              size={24}
              color={THEME_COLOR}
            />
            <ThemedText
              type="subtitle"
              style={recipeDetailsStyles.sectionTitle}
            >
              Recipe Details
            </ThemedText>
          </ThemedView>

          <ThemedView style={recipeDetailsStyles.infoList}>
            <ThemedView style={recipeDetailsStyles.infoItem}>
              <ThemedText style={recipeDetailsStyles.infoLabel}>
                Cuisine:
              </ThemedText>
              <ThemedText style={recipeDetailsStyles.infoValue}>
                {recipe.cuisine || "Various"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={recipeDetailsStyles.infoItem}>
              <ThemedText style={recipeDetailsStyles.infoLabel}>
                Total Time:
              </ThemedText>
              <ThemedText style={recipeDetailsStyles.infoValue}>
                {recipe.prepTime && recipe.cookTime
                  ? `${formatTime(recipe.prepTime)} + ${formatTime(
                      recipe.cookTime
                    )}`
                  : "N/A"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={recipeDetailsStyles.infoItem}>
              <ThemedText style={recipeDetailsStyles.infoLabel}>
                Created:
              </ThemedText>
              <ThemedText style={recipeDetailsStyles.infoValue}>
                {recipe.createdAt
                  ? new Date(recipe.createdAt).toLocaleDateString()
                  : "Unknown"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Action Buttons */}
        {recipe.isOwned && (
          <ThemedView style={recipeDetailsStyles.actionButtons}>
            <TouchableOpacity
              style={[
                recipeDetailsStyles.actionButton,
                recipeDetailsStyles.editButton,
              ]}
              onPress={editRecipe}
            >
              <Ionicons name="create" size={20} color={THEME_COLOR} />
              <ThemedText
                style={[
                  recipeDetailsStyles.actionButtonText,
                  { color: THEME_COLOR },
                ]}
              >
                Edit Recipe
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailsStyles.actionButton,
                recipeDetailsStyles.deleteButton,
              ]}
              onPress={deleteRecipe}
            >
              <Ionicons name="trash" size={20} color="#ef4444" />
              <ThemedText
                style={[
                  recipeDetailsStyles.actionButtonText,
                  { color: "#ef4444" },
                ]}
              >
                Delete Recipe
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

        {/* Bottom Spacing */}
        <ThemedView style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
