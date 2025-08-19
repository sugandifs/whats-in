import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/services/api";
import { Recipe } from "@/services/types";
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
  StyleSheet,
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
    // TODO: Navigate to edit recipe page
    console.log("Edit recipe:", recipe._id);
    // router.push(`/recipe/${recipe._id}/edit`);
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
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={THEME_COLOR} />
        <ThemedText style={{ marginTop: 16 }}>
          Loading recipe...
        </ThemedText>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
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
            styles.button,
            { backgroundColor: THEME_COLOR, marginTop: 16 },
          ]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={
          colorScheme === "dark" ? "light-content" : "dark-content"
        }
      />

      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#333"}
          />
        </TouchableOpacity>

        <ThemedView style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={shareRecipe}
          >
            <Ionicons
              name="share-outline"
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
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
              style={styles.headerButton}
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
        style={styles.content}
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
        <ThemedView style={styles.recipeHeader}>
          <ThemedText style={styles.recipeEmoji}>
            {recipe.image || "🍽️"}
          </ThemedText>
          <ThemedText type="title" style={styles.recipeName}>
            {recipe.name}
          </ThemedText>
          <ThemedText type="default" style={styles.recipeDescription}>
            {recipe.description}
          </ThemedText>

          {/* Badges */}
          <ThemedView style={styles.badgesContainer}>
            {recipe.isOwned && (
              <ThemedView
                style={[styles.badge, { backgroundColor: "#10b981" }]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="white"
                />
                <ThemedText style={styles.badgeText}>
                  Your Recipe
                </ThemedText>
              </ThemedView>
            )}

            {recipe.tags?.includes("ai-generated") && (
              <ThemedView
                style={[styles.badge, { backgroundColor: THEME_COLOR }]}
              >
                <Ionicons name="sparkles" size={14} color="white" />
                <ThemedText style={styles.badgeText}>
                  AI Generated
                </ThemedText>
              </ThemedView>
            )}

            <ThemedView
              style={[
                styles.badge,
                {
                  backgroundColor: getDifficultyColor(
                    recipe.difficulty || "Medium"
                  ),
                },
              ]}
            >
              <ThemedText style={styles.badgeText}>
                {recipe.difficulty || "Medium"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Recipe Stats */}
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <Ionicons name="time" size={20} color={THEME_COLOR} />
            <ThemedText type="defaultSemiBold" style={styles.statLabel}>
              Prep Time
            </ThemedText>
            <ThemedText type="default" style={styles.statValue}>
              {formatTime(recipe.prepTime || "N/A")}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statItem}>
            <Ionicons name="flame" size={20} color={THEME_COLOR} />
            <ThemedText type="defaultSemiBold" style={styles.statLabel}>
              Cook Time
            </ThemedText>
            <ThemedText type="default" style={styles.statValue}>
              {formatTime(recipe.cookTime || "N/A")}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statItem}>
            <Ionicons name="people" size={20} color={THEME_COLOR} />
            <ThemedText type="defaultSemiBold" style={styles.statLabel}>
              Servings
            </ThemedText>
            <ThemedText type="default" style={styles.statValue}>
              {recipe.servings || "4"}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statItem}>
            <Ionicons name="star" size={20} color={THEME_COLOR} />
            <ThemedText type="defaultSemiBold" style={styles.statLabel}>
              Rating
            </ThemedText>
            <ThemedText type="default" style={styles.statValue}>
              {recipe.rating || "New"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Ingredients Section */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <Ionicons name="list" size={24} color={THEME_COLOR} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Ingredients ({recipe.ingredients?.length || 0})
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.ingredientsList}>
            {recipe.ingredients?.map((ingredient, index) => (
              <ThemedView key={index} style={styles.ingredientItem}>
                <ThemedView style={styles.ingredientBullet} />
                <ThemedText style={styles.ingredientText}>
                  {ingredient}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Instructions Section */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <Ionicons
              name="document-text"
              size={24}
              color={THEME_COLOR}
            />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Instructions ({recipe.instructions?.length || 0} steps)
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.instructionsList}>
            {recipe.instructions?.map((instruction, index) => (
              <ThemedView key={index} style={styles.instructionItem}>
                <ThemedView style={styles.stepNumber}>
                  <ThemedText style={styles.stepText}>
                    {index + 1}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={styles.instructionText}>
                  {instruction}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Tags Section */}
        {recipe.tags && recipe.tags.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedView style={styles.sectionHeader}>
              <Ionicons
                name="pricetags"
                size={24}
                color={THEME_COLOR}
              />
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Tags
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.tagsList}>
              {recipe.tags.map((tag, index) => (
                <ThemedView key={index} style={styles.tag}>
                  <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {/* Recipe Info */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <Ionicons
              name="information-circle"
              size={24}
              color={THEME_COLOR}
            />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Recipe Details
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoList}>
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Cuisine:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {recipe.cuisine || "Various"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>
                Total Time:
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {recipe.prepTime && recipe.cookTime
                  ? `${formatTime(recipe.prepTime)} + ${formatTime(
                      recipe.cookTime
                    )}`
                  : "N/A"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Created:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {recipe.createdAt
                  ? new Date(recipe.createdAt).toLocaleDateString()
                  : "Unknown"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Action Buttons */}
        {recipe.isOwned && (
          <ThemedView style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={editRecipe}
            >
              <Ionicons name="create" size={20} color={THEME_COLOR} />
              <ThemedText
                style={[
                  styles.actionButtonText,
                  { color: THEME_COLOR },
                ]}
              >
                Edit Recipe
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={deleteRecipe}
            >
              <Ionicons name="trash" size={20} color="#ef4444" />
              <ThemedText
                style={[styles.actionButtonText, { color: "#ef4444" }]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
  },
  recipeHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },
  recipeEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 34,
  },
  recipeDescription: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "transparent",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 20,
  },
  ingredientsList: {
    backgroundColor: "transparent",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME_COLOR,
    marginTop: 6,
    marginRight: 16,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
  },
  instructionsList: {
    backgroundColor: "transparent",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${THEME_COLOR}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    marginTop: 2,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLOR,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "transparent",
  },
  tag: {
    backgroundColor: `${THEME_COLOR}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${THEME_COLOR}30`,
  },
  tagText: {
    fontSize: 14,
    color: THEME_COLOR,
    fontWeight: "500",
  },
  infoList: {
    backgroundColor: "transparent",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: "transparent",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  editButton: {
    borderColor: THEME_COLOR,
    backgroundColor: `${THEME_COLOR}10`,
  },
  deleteButton: {
    borderColor: "#ef4444",
    backgroundColor: "#ef444410",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
