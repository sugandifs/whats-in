import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/services/api";
import { Recipe } from "@/services/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const THEME_COLOR = "#FFB902";

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
  const colorScheme = useColorScheme();

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
      color: THEME_COLOR,
    },
    {
      id: "breakfast",
      name: "Breakfast",
      icon: "sunny",
      count: allRecipes.filter((r) => r.tags?.includes("breakfast"))
        .length,
      color: "#f59e0b",
    },
    {
      id: "lunch",
      name: "Lunch",
      icon: "partly-sunny",
      count: allRecipes.filter((r) => r.tags?.includes("lunch")).length,
      color: "#10b981",
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
      color: "#22c55e",
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

      // Load all recipes
      const recipes = await ApiService.getRecipes();
      setAllRecipes(recipes);

      // Load user's own recipes
      if (currentUser) {
        // TODO: change to a getUserGeneratedRecipes endpoint later
        const ownRecipes = await ApiService.getRecipes();
        setUserRecipes(ownRecipes);
      }

      // Load favorite recipes
      if (currentUser) {
        const favorites = await ApiService.getFavoriteRecipes();
        setFavoriteRecipes(favorites);
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

  const handleToggleFavorite = async (
    recipeId: string,
    isFavorite: boolean
  ) => {
    try {
      if (isFavorite) {
        await ApiService.addToFavorites(recipeId);
      } else {
        await ApiService.removeFromFavorites(recipeId);
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
      // TODO: Implement recipe import in backend
      // await ApiService.importRecipe(importUrl);

      console.log("Importing recipe from:", importUrl);
      setImportUrl("");
      setImportModalVisible(false);
      Alert.alert("Success", "Recipe imported successfully!");

      // Refresh data after import
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
      // TODO: Implement recipe generation in backend
      // const newRecipe = await ApiService.generateRecipe(generatePrompt);

      console.log("Generating recipe with prompt:", generatePrompt);
      setGeneratePrompt("");
      setGenerateModalVisible(false);
      Alert.alert("Success", "Recipe generated successfully!");

      // Refresh data after generation
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
    console.log("route is: ", `/recipe/${recipe._id}`);
    router.push(`/recipe/${recipe._id}` as any);
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => handleRecipePress(item)}
    >
      <ThemedView style={styles.recipeImageContainer}>
        <ThemedText style={styles.recipeEmoji}>
          {item.image || "🍽️"}
        </ThemedText>
        {item.isOwned && (
          <ThemedView style={styles.ownedBadge}>
            <Ionicons
              name={"checkmark-circle" as IoniconsName}
              size={16}
              color="white"
            />
          </ThemedView>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() =>
            handleToggleFavorite(item._id, !item.isFavorite)
          }
        >
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={
              item.isFavorite
                ? "#ef4444"
                : colorScheme === "dark"
                ? "#fff"
                : "#666"
            }
          />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.recipeInfo}>
        <ThemedText type="defaultSemiBold" style={styles.recipeName}>
          {item.name}
        </ThemedText>
        <ThemedText type="default" style={styles.recipeCuisine}>
          {item.cuisine || "Various"}
        </ThemedText>

        <ThemedView style={styles.recipeStats}>
          <ThemedView style={styles.recipeStat}>
            <Ionicons
              name={"time" as IoniconsName}
              size={14}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
            <ThemedText type="default" style={styles.recipeStatText}>
              {item.prepTime || "N/A"}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.recipeStat}>
            <Ionicons
              name={"people" as IoniconsName}
              size={14}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
            <ThemedText type="default" style={styles.recipeStatText}>
              {item.servings || "N/A"}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.recipeStat}>
            <Ionicons
              name={"star" as IoniconsName}
              size={14}
              color={THEME_COLOR}
            />
            <ThemedText type="default" style={styles.recipeStatText}>
              {item.rating || "N/A"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.recipeTags}>
          {item.difficulty && (
            <ThemedView
              style={[
                styles.difficultyTag,
                {
                  backgroundColor: getDifficultyColor(item.difficulty),
                },
              ]}
            >
              <ThemedText style={styles.difficultyText}>
                {item.difficulty}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: RecipeCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === item.id && {
          backgroundColor: `${item.color}20`,
          borderColor: item.color,
        },
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <ThemedView
        style={[
          styles.categoryIcon,
          { backgroundColor: `${item.color}20` },
        ]}
      >
        <Ionicons
          name={item.icon as IoniconsName}
          size={20}
          color={item.color}
        />
      </ThemedView>
      <ThemedText type="defaultSemiBold" style={styles.categoryName}>
        {item.name}
      </ThemedText>
      <ThemedText type="default" style={styles.categoryCount}>
        {item.count}
      </ThemedText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={THEME_COLOR} />
        <ThemedText style={{ marginTop: 16 }}>
          Loading recipes...
        </ThemedText>
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
        <ThemedView style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.navigate("/")}
          >
            <Ionicons
              name={"chevron-back" as IoniconsName}
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#333"}
            />
          </TouchableOpacity>
          <ThemedView style={styles.headerText}>
            <ThemedText type="title" style={styles.headerTitle}>
              Recipes
            </ThemedText>
            <ThemedText type="default" style={styles.headerSubtitle}>
              Discover & cook amazing meals
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons
            name={"search" as IoniconsName}
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#666"}
          />
        </TouchableOpacity>
      </ThemedView>

      {/* Action Buttons */}
      <ThemedView style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: `${THEME_COLOR}20`,
              borderColor: THEME_COLOR,
            },
          ]}
          onPress={() => router.navigate("/generate-recipe")}
        >
          <Ionicons
            name={"sparkles" as IoniconsName}
            size={18}
            color={THEME_COLOR}
          />
          <ThemedText
            type="defaultSemiBold"
            style={[styles.actionButtonText, { color: "black" }]}
          >
            Generate Recipe
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: `${THEME_COLOR}20`,
              borderColor: THEME_COLOR,
            },
          ]}
          onPress={() => setImportModalVisible(true)}
        >
          <Ionicons
            name={"download" as IoniconsName}
            size={18}
            color={THEME_COLOR}
          />
          <ThemedText
            type="defaultSemiBold"
            style={[styles.actionButtonText, { color: "black" }]}
          >
            Import Recipe
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <ThemedView style={styles.searchBar}>
          <Ionicons
            name={"search" as IoniconsName}
            size={20}
            color={colorScheme === "dark" ? "#fff" : "#666"}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: colorScheme === "dark" ? "#fff" : "#333" },
            ]}
            placeholder="Search recipes..."
            placeholderTextColor={
              colorScheme === "dark" ? "#888" : "#999"
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>
      </ThemedView>

      {/* Tab Navigation */}
      <ThemedView style={styles.tabNavigation}>
        {[
          { key: "discover", label: "Discover", icon: "compass" },
          { key: "yours", label: "Your Recipes", icon: "book" },
          { key: "favorites", label: "Favorites", icon: "heart" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as IoniconsName}
              size={16}
              color={
                activeTab === tab.key
                  ? "white"
                  : colorScheme === "dark"
                  ? "#fff"
                  : "#666"
              }
            />
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Categories */}
        <ThemedView style={styles.categoriesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Categories
          </ThemedText>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          />
        </ThemedView>

        {/* Recipes Grid */}
        <ThemedView style={styles.recipesSection}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {activeTab === "yours"
                ? "Your Recipes"
                : activeTab === "favorites"
                ? "Favorite Recipes"
                : "Discover Recipes"}
            </ThemedText>
            <ThemedText type="default" style={styles.recipeCount}>
              {filteredRecipes.length} recipes
            </ThemedText>
          </ThemedView>

          {filteredRecipes.length > 0 ? (
            <ThemedView style={styles.recipesGrid}>
              {filteredRecipes.map((recipe) => (
                <ThemedView
                  key={recipe._id}
                  style={styles.recipeCardContainer}
                >
                  {renderRecipeCard({ item: recipe })}
                </ThemedView>
              ))}
            </ThemedView>
          ) : (
            <ThemedView style={styles.emptyState}>
              <Ionicons
                name={"book-outline" as IoniconsName}
                size={48}
                color={colorScheme === "dark" ? "#666" : "#ccc"}
              />
              <ThemedText style={styles.emptyText}>
                {activeTab === "yours"
                  ? "No recipes created yet"
                  : activeTab === "favorites"
                  ? "No favorite recipes yet"
                  : "No recipes found"}
              </ThemedText>
              <TouchableOpacity
                onPress={() => {
                  if (activeTab === "discover") {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  } else {
                    setActiveTab("discover");
                  }
                }}
              >
                <ThemedText type="link">
                  {activeTab === "discover"
                    ? "Clear filters"
                    : "Browse recipes"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>

      {/* Import Recipe Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={importModalVisible}
        onRequestClose={() => setImportModalVisible(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView
            style={[
              styles.modalContent,
              {
                backgroundColor:
                  colorScheme === "dark" ? "#1a1a1a" : "#ffffff",
              },
            ]}
          >
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Import Recipe
              </ThemedText>
              <TouchableOpacity
                onPress={() => setImportModalVisible(false)}
              >
                <Ionicons
                  name={"close" as IoniconsName}
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#333"}
                />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.modalBody}>
              <ThemedText
                type="default"
                style={styles.modalDescription}
              >
                Paste a recipe URL or website link to automatically
                import the recipe
              </ThemedText>

              <TextInput
                style={[
                  styles.modalInput,
                  {
                    borderColor:
                      colorScheme === "dark" ? "#444" : "#e5e7eb",
                    backgroundColor:
                      colorScheme === "dark" ? "#333" : "#fff",
                    color: colorScheme === "dark" ? "#fff" : "#333",
                  },
                ]}
                placeholder="https://example.com/recipe"
                placeholderTextColor={
                  colorScheme === "dark" ? "#888" : "#999"
                }
                value={importUrl}
                onChangeText={setImportUrl}
                multiline
              />

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: THEME_COLOR },
                ]}
                onPress={handleImportRecipe}
                disabled={!importUrl.trim()}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.modalButtonText}
                >
                  Import Recipe
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Generate Recipe Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={generateModalVisible}
        onRequestClose={() => setGenerateModalVisible(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView
            style={[
              styles.modalContent,
              {
                backgroundColor:
                  colorScheme === "dark" ? "#1a1a1a" : "#ffffff",
              },
            ]}
          >
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Generate Recipe
              </ThemedText>
              <TouchableOpacity
                onPress={() => setGenerateModalVisible(false)}
              >
                <Ionicons
                  name={"close" as IoniconsName}
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#333"}
                />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.modalBody}>
              <ThemedText
                type="default"
                style={styles.modalDescription}
              >
                Describe what you'd like to cook and AI will generate a
                custom recipe for you
              </ThemedText>

              <TextInput
                style={[
                  styles.modalInput,
                  {
                    borderColor:
                      colorScheme === "dark" ? "#444" : "#e5e7eb",
                    backgroundColor:
                      colorScheme === "dark" ? "#333" : "#fff",
                    color: colorScheme === "dark" ? "#fff" : "#333",
                    height: 100,
                  },
                ]}
                placeholder="E.g., A healthy vegetarian pasta dish with seasonal vegetables..."
                placeholderTextColor={
                  colorScheme === "dark" ? "#888" : "#999"
                }
                value={generatePrompt}
                onChangeText={setGeneratePrompt}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: THEME_COLOR },
                ]}
                onPress={handleGenerateRecipe}
                disabled={!generatePrompt.trim()}
              >
                <Ionicons
                  name={"sparkles" as IoniconsName}
                  size={18}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.modalButtonText}
                >
                  Generate Recipe
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  headerText: {
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  headerAction: {
    padding: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: "transparent",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    marginLeft: 6,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "rgba(128, 128, 128, 0.05)",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  tabNavigation: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  activeTab: {
    backgroundColor: THEME_COLOR,
  },
  tabText: {
    fontSize: 12,
    marginLeft: 6,
    opacity: 0.7,
  },
  activeTabText: {
    color: "white",
    opacity: 1,
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoriesList: {
    paddingLeft: 16,
  },
  categoryCard: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    minWidth: 80,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 10,
    opacity: 0.7,
  },
  recipesSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    backgroundColor: "transparent",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  recipeCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  recipesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  recipeCardContainer: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  recipeCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    overflow: "hidden",
  },
  recipeImageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
  },
  recipeEmoji: {
    fontSize: 48,
  },
  ownedBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#10b981",
    borderRadius: 12,
    padding: 4,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
  recipeInfo: {
    padding: 12,
    backgroundColor: "transparent",
  },
  recipeName: {
    fontSize: 14,
    marginBottom: 2,
  },
  recipeCuisine: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  recipeStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  recipeStat: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  recipeStatText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.7,
  },
  recipeTags: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  emptyText: {
    marginTop: 12,
    marginBottom: 8,
    opacity: 0.7,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "transparent",
  },
  modalTitle: {
    fontSize: 18,
  },
  modalBody: {
    padding: 20,
    backgroundColor: "transparent",
  },
  modalDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 44,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});
