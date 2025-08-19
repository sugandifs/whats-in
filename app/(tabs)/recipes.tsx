// recipes.tsx - Migrated to use modular styling system
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import { FormInput } from "@/components/forms/FormInput";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActionButton } from "@/components/ui/ActionButton";
import { CategorySelector } from "@/components/ui/CategorySelector";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { HeaderAction } from "@/components/ui/HeaderActions";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { SearchBar } from "@/components/ui/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import ApiService from "@/services/api";
import { Recipe } from "@/services/types";
import { styles } from "@/styles";
import { recipePageStyles } from "@/styles/pages";

interface RecipeCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export default function RecipesPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { themedColors, theme } = useThemedStyles();

  // State management
  const [activeTab, setActiveTab] = useState<
    "discover" | "yours" | "favorites"
  >("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] =
    useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  const categories: RecipeCategory[] = [
    {
      id: "all",
      name: "All",
      icon: "grid",
      count: allRecipes.length,
      color: themedColors.primary,
    },
    {
      id: "breakfast",
      name: "Breakfast",
      icon: "sunny",
      count: allRecipes.filter((r) => r.tags?.includes("breakfast"))
        .length,
      color: themedColors.warning,
    },
    {
      id: "lunch",
      name: "Lunch",
      icon: "partly-sunny",
      count: allRecipes.filter((r) => r.tags?.includes("lunch")).length,
      color: themedColors.success,
    },
    {
      id: "dinner",
      name: "Dinner",
      icon: "moon",
      count: allRecipes.filter((r) => r.tags?.includes("dinner"))
        .length,
      color: "#8b5cf6",
    },
    {
      id: "dessert",
      name: "Dessert",
      icon: "heart",
      count: allRecipes.filter((r) => r.tags?.includes("dessert"))
        .length,
      color: "#ec4899",
    },
    {
      id: "vegetarian",
      name: "Vegetarian",
      icon: "leaf",
      count: allRecipes.filter((r) => r.tags?.includes("vegetarian"))
        .length,
      color: themedColors.categories.fresh,
    },
    {
      id: "quick",
      name: "Quick & Easy",
      icon: "flash",
      count: allRecipes.filter(
        (r) =>
          r.tags?.includes("quick") ||
          (r.prepTime && parseInt(r.prepTime) <= 15)
      ).length,
      color: "#f97316",
    },
  ];

  // Load data from backend
  const loadData = async () => {
    try {
      setLoading(true);

      if (currentUser) {
        const [allRecipesData, userRecipesData, favoritesData] =
          await Promise.all([
            ApiService.getRecipes(),
            ApiService.getRecipes(),
            ApiService.getFavoriteRecipes(),
          ]);

        setAllRecipes(allRecipesData);
        setUserRecipes(userRecipesData);
        setFavoriteRecipes(favoritesData);
      }
    } catch (error) {
      console.error("Failed to load recipes:", error);
      Alert.alert("Error", "Failed to load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const getCurrentRecipes = () => {
    switch (activeTab) {
      case "yours":
        return userRecipes;
      case "favorites":
        return favoriteRecipes;
      default:
        return allRecipes;
    }
  };

  const filteredRecipes = getCurrentRecipes().filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.cuisine?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      recipe.tags?.includes(selectedCategory) ||
      (selectedCategory === "quick" &&
        (recipe.tags?.includes("quick") ||
          (recipe.prepTime && parseInt(recipe.prepTime) <= 15)));

    return matchesSearch && matchesCategory;
  });

  const handleToggleFavorite = async (
    recipeId: string,
    isFavorite: boolean
  ) => {
    try {
      if (isFavorite) {
        await ApiService.removeFromFavorites(recipeId);
      } else {
        await ApiService.addToFavorites(recipeId);
      }
      await loadData();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      Alert.alert("Error", "Failed to update favorite status.");
    }
  };

  const handleImportRecipe = async () => {
    if (!importUrl.trim()) {
      Alert.alert("Error", "Please enter a recipe URL");
      return;
    }

    try {
      setLoading(true);
      const importedRecipe = await ApiService.importRecipe(
        importUrl.trim()
      );
      setImportUrl("");
      setImportModalVisible(false);
      Alert.alert(
        "Success",
        `Recipe "${importedRecipe.name}" imported successfully!`
      );
      await loadData();
    } catch (error) {
      console.error("Failed to import recipe:", error);
      Alert.alert(
        "Error",
        "Failed to import recipe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecipe = async () => {
    if (!generatePrompt.trim()) {
      Alert.alert("Error", "Please enter a recipe description");
      return;
    }

    try {
      setLoading(true);
      console.log("Generating recipe with prompt:", generatePrompt);
      setGeneratePrompt("");
      setGenerateModalVisible(false);
      Alert.alert("Success", "Recipe generated successfully!");
      await loadData();
    } catch (error) {
      console.error("Failed to generate recipe:", error);
      Alert.alert(
        "Error",
        "Failed to generate recipe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipe: Recipe) => {
    console.log("Navigating to recipe:", recipe._id);
    router.push(`/recipe/${recipe._id}` as any);
  };

  if (loading) {
    return <LoadingSpinner message="Loading recipes..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={
          themedColors.text === "#1A1A21"
            ? "dark-content"
            : "light-content"
        }
      />

      {/* Header */}
      <Header
        title="Recipes"
        subtitle="Discover & cook amazing meals"
        rightActions={
          <HeaderAction
            icon="search"
            onPress={() => console.log("search")}
          />
        }
      />

      {/* Action Buttons */}
      <ThemedView style={recipePageStyles.actionButtonsContainer}>
        <ActionButton
          title="Generate Recipe"
          icon="sparkles"
          variant="outline"
          onPress={() => router.navigate("/generate-recipe")}
          style={{ flex: 1 }}
        />

        <ActionButton
          title="Import Recipe"
          icon="download"
          variant="outline"
          onPress={() => setImportModalVisible(true)}
          style={{ flex: 1 }}
        />
      </ThemedView>

      {/* Search Bar */}
      <ThemedView
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
        }}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search recipes..."
        />
      </ThemedView>

      {/* Tab Navigation */}
      <ThemedView style={recipePageStyles.tabNavigation}>
        {[
          { key: "discover", label: "Discover", icon: "compass" },
          { key: "yours", label: "Your Recipes", icon: "book" },
          { key: "favorites", label: "Favorites", icon: "heart" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              recipePageStyles.tab,
              {
                backgroundColor:
                  activeTab === tab.key
                    ? themedColors.primary
                    : themedColors.backgroundTertiary,
              },
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <ThemedText
              style={[
                recipePageStyles.tabText,
                {
                  color:
                    activeTab === tab.key ? "white" : themedColors.text,
                },
              ]}
            >
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themedColors.primary]}
          />
        }
      >
        {/* Categories */}
        <ThemedView style={{ paddingVertical: theme.spacing.lg }}>
          <ThemedText
            type="subtitle"
            style={{
              paddingHorizontal: theme.spacing.lg,
              marginBottom: theme.spacing.md,
            }}
          >
            Categories
          </ThemedText>
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </ThemedView>

        {/* Recipes Grid */}
        <ThemedView
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: 100,
          }}
        >
          <ThemedView
            style={[
              styles.rowBetween,
              { marginBottom: theme.spacing.lg },
            ]}
          >
            <ThemedText type="subtitle">
              {activeTab === "yours"
                ? "Your Recipes"
                : activeTab === "favorites"
                ? "Favorite Recipes"
                : "Discover Recipes"}
            </ThemedText>
            <ThemedText style={{ opacity: 0.7 }}>
              {filteredRecipes.length} recipes
            </ThemedText>
          </ThemedView>

          {filteredRecipes.length > 0 ? (
            <ThemedView style={recipePageStyles.recipesGrid}>
              {filteredRecipes.map((recipe) => (
                <ThemedView
                  key={recipe._id}
                  style={recipePageStyles.recipeCardContainer}
                >
                  <RecipeCard
                    recipe={recipe}
                    onPress={handleRecipePress}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </ThemedView>
              ))}
            </ThemedView>
          ) : (
            <EmptyState
              icon="book-outline"
              title={
                activeTab === "yours"
                  ? "No recipes created yet"
                  : activeTab === "favorites"
                  ? "No favorite recipes yet"
                  : "No recipes found"
              }
              actionText={
                activeTab === "discover"
                  ? "Clear filters"
                  : "Browse recipes"
              }
              onActionPress={() => {
                if (activeTab === "discover") {
                  setSearchQuery("");
                  setSelectedCategory("all");
                } else {
                  setActiveTab("discover");
                }
              }}
            />
          )}
        </ThemedView>
      </ScrollView>

      {/* Import Recipe Modal */}
      <Modal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        title="Import Recipe"
      >
        <ThemedText
          style={{
            fontSize: 14,
            opacity: 0.7,
            marginBottom: theme.spacing.lg,
            lineHeight: 20,
          }}
        >
          Paste a recipe URL or website link to automatically import the
          recipe
        </ThemedText>

        <FormInput
          label=""
          placeholder="https://example.com/recipe"
          value={importUrl}
          onChangeText={setImportUrl}
          multiline
          style={{ minHeight: 80 }}
        />

        <ActionButton
          title="Import Recipe"
          onPress={handleImportRecipe}
          disabled={!importUrl.trim()}
          style={{ marginTop: theme.spacing.lg }}
        />
      </Modal>

      {/* Generate Recipe Modal */}
      <Modal
        visible={generateModalVisible}
        onClose={() => setGenerateModalVisible(false)}
        title="Generate Recipe"
      >
        <ThemedText
          style={{
            fontSize: 14,
            opacity: 0.7,
            marginBottom: theme.spacing.lg,
            lineHeight: 20,
          }}
        >
          Describe what you'd like to cook and AI will generate a custom
          recipe for you
        </ThemedText>

        <FormInput
          label=""
          placeholder="E.g., A healthy vegetarian pasta dish with seasonal vegetables..."
          value={generatePrompt}
          onChangeText={setGeneratePrompt}
          multiline
          style={{ height: 100 }}
        />

        <ActionButton
          title="Generate Recipe"
          icon="sparkles"
          onPress={handleGenerateRecipe}
          disabled={!generatePrompt.trim()}
          style={{ marginTop: theme.spacing.lg }}
        />
      </Modal>
    </SafeAreaView>
  );
}
