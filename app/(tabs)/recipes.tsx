import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
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

interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: string;
  cookTime: string;
  servings: number;
  rating: number;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  isOwned: boolean;
  isFavorite: boolean;
}

interface RecipeCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export default function RecipesPage() {
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
  const colorScheme = useColorScheme();

  const categories: RecipeCategory[] = [
    {
      id: "all",
      name: "All",
      icon: "grid",
      count: 156,
      color: THEME_COLOR,
    },
    {
      id: "breakfast",
      name: "Breakfast",
      icon: "sunny",
      count: 24,
      color: "#f59e0b",
    },
    {
      id: "lunch",
      name: "Lunch",
      icon: "partly-sunny",
      count: 38,
      color: "#10b981",
    },
    {
      id: "dinner",
      name: "Dinner",
      icon: "moon",
      count: 52,
      color: "#8b5cf6",
    },
    {
      id: "dessert",
      name: "Dessert",
      icon: "heart",
      count: 18,
      color: "#ec4899",
    },
    {
      id: "vegetarian",
      name: "Vegetarian",
      icon: "leaf",
      count: 31,
      color: "#22c55e",
    },
    {
      id: "quick",
      name: "Quick & Easy",
      icon: "flash",
      count: 42,
      color: "#f97316",
    },
  ];

  const discoverRecipes: Recipe[] = [
    {
      id: "1",
      name: "Mediterranean Quinoa Bowl",
      cuisine: "Mediterranean",
      difficulty: "Easy",
      prepTime: "15 min",
      cookTime: "20 min",
      servings: 4,
      rating: 4.8,
      image: "🥗",
      description:
        "A healthy and flavorful quinoa bowl with fresh vegetables",
      ingredients: [
        "Quinoa",
        "Cucumber",
        "Tomatoes",
        "Feta cheese",
        "Olive oil",
      ],
      instructions: [
        "Cook quinoa",
        "Chop vegetables",
        "Mix together",
        "Serve",
      ],
      tags: ["healthy", "vegetarian", "mediterranean"],
      isOwned: false,
      isFavorite: false,
    },
    {
      id: "2",
      name: "Honey Garlic Chicken",
      cuisine: "Asian",
      difficulty: "Medium",
      prepTime: "10 min",
      cookTime: "25 min",
      servings: 6,
      rating: 4.9,
      image: "🍗",
      description: "Sweet and savory chicken with a sticky glaze",
      ingredients: [
        "Chicken thighs",
        "Honey",
        "Garlic",
        "Soy sauce",
        "Ginger",
      ],
      instructions: [
        "Marinate chicken",
        "Cook in pan",
        "Add sauce",
        "Simmer",
      ],
      tags: ["asian", "chicken", "sweet"],
      isOwned: false,
      isFavorite: true,
    },
    {
      id: "3",
      name: "Chocolate Lava Cake",
      cuisine: "French",
      difficulty: "Hard",
      prepTime: "20 min",
      cookTime: "12 min",
      servings: 2,
      rating: 4.7,
      image: "🍰",
      description: "Decadent chocolate dessert with molten center",
      ingredients: [
        "Dark chocolate",
        "Butter",
        "Eggs",
        "Sugar",
        "Flour",
      ],
      instructions: [
        "Melt chocolate",
        "Mix batter",
        "Bake",
        "Serve warm",
      ],
      tags: ["dessert", "chocolate", "romantic"],
      isOwned: false,
      isFavorite: false,
    },
  ];

  const yourRecipes: Recipe[] = [
    {
      id: "4",
      name: "Grandma's Apple Pie",
      cuisine: "American",
      difficulty: "Medium",
      prepTime: "30 min",
      cookTime: "50 min",
      servings: 8,
      rating: 5.0,
      image: "🥧",
      description: "Family recipe passed down through generations",
      ingredients: ["Apples", "Flour", "Butter", "Sugar", "Cinnamon"],
      instructions: [
        "Make crust",
        "Prepare filling",
        "Assemble",
        "Bake",
      ],
      tags: ["family", "dessert", "traditional"],
      isOwned: true,
      isFavorite: true,
    },
    {
      id: "5",
      name: "Spicy Thai Curry",
      cuisine: "Thai",
      difficulty: "Medium",
      prepTime: "15 min",
      cookTime: "30 min",
      servings: 4,
      rating: 4.6,
      image: "🍛",
      description: "Homemade curry with fresh ingredients",
      ingredients: [
        "Coconut milk",
        "Curry paste",
        "Vegetables",
        "Rice",
        "Herbs",
      ],
      instructions: [
        "Sauté paste",
        "Add coconut milk",
        "Simmer with vegetables",
        "Serve over rice",
      ],
      tags: ["spicy", "thai", "curry"],
      isOwned: true,
      isFavorite: false,
    },
  ];

  const favoriteRecipes = [...discoverRecipes, ...yourRecipes].filter(
    (recipe) => recipe.isFavorite
  );

  const getCurrentRecipes = () => {
    switch (activeTab) {
      case "yours":
        return yourRecipes;
      case "favorites":
        return favoriteRecipes;
      default:
        return discoverRecipes;
    }
  };

  const filteredRecipes = getCurrentRecipes().filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      recipe.tags.includes(selectedCategory) ||
      (selectedCategory === "breakfast" &&
        recipe.tags.includes("breakfast")) ||
      (selectedCategory === "lunch" && recipe.tags.includes("lunch")) ||
      (selectedCategory === "dinner" &&
        recipe.tags.includes("dinner")) ||
      (selectedCategory === "dessert" &&
        recipe.tags.includes("dessert")) ||
      (selectedCategory === "vegetarian" &&
        recipe.tags.includes("vegetarian")) ||
      (selectedCategory === "quick" &&
        (recipe.tags.includes("quick") ||
          parseInt(recipe.prepTime) <= 15));
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#10b981";
      case "Medium":
        return "#f59e0b";
      case "Hard":
        return "#ef4444";
      default:
        return THEME_COLOR;
    }
  };

  const handleImportRecipe = () => {
    // Simulate recipe import
    console.log("Importing recipe from:", importUrl);
    setImportUrl("");
    setImportModalVisible(false);
  };

  const handleGenerateRecipe = () => {
    // Simulate recipe generation
    console.log("Generating recipe with prompt:", generatePrompt);
    setGeneratePrompt("");
    setGenerateModalVisible(false);
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <ThemedView style={styles.recipeImageContainer}>
        <ThemedText style={styles.recipeEmoji}>{item.image}</ThemedText>
        {item.isOwned && (
          <ThemedView style={styles.ownedBadge}>
            <Ionicons
              name={"checkmark-circle" as IoniconsName}
              size={16}
              color="white"
            />
          </ThemedView>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
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
          {item.cuisine}
        </ThemedText>

        <ThemedView style={styles.recipeStats}>
          <ThemedView style={styles.recipeStat}>
            <Ionicons
              name={"time" as IoniconsName}
              size={14}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
            <ThemedText type="default" style={styles.recipeStatText}>
              {item.prepTime}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.recipeStat}>
            <Ionicons
              name={"people" as IoniconsName}
              size={14}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
            <ThemedText type="default" style={styles.recipeStatText}>
              {item.servings}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.recipeStat}>
            <Ionicons
              name={"star" as IoniconsName}
              size={14}
              color={THEME_COLOR}
            />
            <ThemedText type="default" style={styles.recipeStatText}>
              {item.rating}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.recipeTags}>
          <ThemedView
            style={[
              styles.difficultyTag,
              { backgroundColor: getDifficultyColor(item.difficulty) },
            ]}
          >
            <ThemedText style={styles.difficultyText}>
              {item.difficulty}
            </ThemedText>
          </ThemedView>
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
          <TouchableOpacity style={styles.backButton}>
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
          onPress={() => setGenerateModalVisible(true)}
        >
          <Ionicons
            name={"sparkles" as IoniconsName}
            size={18}
            color={THEME_COLOR}
          />
          <ThemedText
            type="defaultSemiBold"
            style={[styles.actionButtonText, { color: THEME_COLOR }]}
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
            style={[styles.actionButtonText, { color: THEME_COLOR }]}
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

          <ThemedView style={styles.recipesGrid}>
            {filteredRecipes.map((recipe) => (
              <ThemedView
                key={recipe.id}
                style={styles.recipeCardContainer}
              >
                {renderRecipeCard({ item: recipe })}
              </ThemedView>
            ))}
          </ThemedView>
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
          <ThemedView style={styles.modalContent}>
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
          <ThemedView style={styles.modalContent}>
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
    backgroundColor: "#ffffff", // For light mode
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
