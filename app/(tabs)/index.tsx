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

interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expirationDate: Date;
  purchaseDate: Date;
  location: string;
  emoji: string;
  notes?: string;
  barcode?: string;
}

interface PantryCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

interface QuickStat {
  label: string;
  value: string | number;
  icon: IoniconsName;
}

export default function MealPrepHome() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const colorScheme = useColorScheme();
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);

  // Form state for adding new items
  const [newItem, setNewItem] = useState({
    name: "",
    category: "fresh",
    quantity: 1,
    unit: "piece",
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    location: "fridge",
    emoji: "🥬",
    notes: "",
  });

  const categories: PantryCategory[] = [
    {
      id: "all",
      name: "All Items",
      icon: "grid",
      color: THEME_COLOR,
      count: pantryItems.length,
    },
    {
      id: "fresh",
      name: "Fresh",
      icon: "leaf",
      color: "#22c55e",
      count: pantryItems.filter((item) => item.category === "fresh")
        .length,
    },
    {
      id: "dairy",
      name: "Dairy",
      icon: "water",
      color: "#3b82f6",
      count: pantryItems.filter((item) => item.category === "dairy")
        .length,
    },
    {
      id: "meat",
      name: "Meat & Fish",
      icon: "fish",
      color: "#ef4444",
      count: pantryItems.filter((item) => item.category === "meat")
        .length,
    },
    {
      id: "pantry",
      name: "Pantry",
      icon: "archive",
      color: "#8b5cf6",
      count: pantryItems.filter((item) => item.category === "pantry")
        .length,
    },
    {
      id: "frozen",
      name: "Frozen",
      icon: "snow",
      color: "#06b6d4",
      count: pantryItems.filter((item) => item.category === "frozen")
        .length,
    },
  ];

  const locations = [
    { id: "fridge", name: "Refrigerator", icon: "snow" },
    { id: "freezer", name: "Freezer", icon: "cube" },
    { id: "pantry", name: "Pantry", icon: "archive" },
    { id: "counter", name: "Counter", icon: "home" },
  ];

  const units = [
    "piece",
    "lb",
    "kg",
    "oz",
    "g",
    "cup",
    "tbsp",
    "tsp",
    "bottle",
    "package",
  ];

  // Calculate expiring items
  const getExpiringItems = () => {
    return pantryItems
      .filter((item) => {
        const daysUntilExpiration = Math.ceil(
          (item.expirationDate.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiration <= 3 && daysUntilExpiration >= 0;
      })
      .slice(0, 3)
      .map((item) => ({
        name: item.name,
        days: Math.ceil(
          (item.expirationDate.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        ),
      }));
  };

  const quickActions = [
    {
      icon: "add" as IoniconsName,
      label: "Add Inventory",
      action: "add",
    },
    {
      icon: "cart" as IoniconsName,
      label: "Grocery List",
      action: "grocery",
    },
    {
      icon: "calendar" as IoniconsName,
      label: "Meal Planner",
      action: "mealprep",
    },
    {
      icon: "book" as IoniconsName,
      label: "My Recipes",
      action: "recipes",
    },
  ];

  const navigationTabs = [
    { id: "home", icon: "home" as IoniconsName, label: "Home" },
    { id: "recipes", icon: "book" as IoniconsName, label: "Recipes" },
    { id: "plan", icon: "calendar" as IoniconsName, label: "Plan" },
    {
      id: "inventory",
      icon: "add-circle" as IoniconsName,
      label: "Inventory",
    },
  ];

  // Load data from backend
  const loadData = async () => {
    try {
      setLoading(true);

      // Load recipes (recent ones)
      const recipes = await ApiService.getRecipes();
      setRecentRecipes(recipes.slice(0, 3)); // Get first 3 for recent recipes

      // Load pantry items (you'll need to implement this endpoint)
      // For now, using mock data but structure is ready for backend
      const mockPantryItems: PantryItem[] = [
        {
          id: "1",
          name: "Spinach",
          category: "fresh",
          quantity: 1,
          unit: "package",
          expirationDate: new Date(
            Date.now() + 2 * 24 * 60 * 60 * 1000
          ),
          purchaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          location: "fridge",
          emoji: "🥬",
          notes: "Organic baby spinach",
        },
        {
          id: "2",
          name: "Bell Peppers",
          category: "fresh",
          quantity: 3,
          unit: "piece",
          expirationDate: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ),
          purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          location: "fridge",
          emoji: "🫑",
        },
        {
          id: "3",
          name: "Greek Yogurt",
          category: "dairy",
          quantity: 1,
          unit: "package",
          expirationDate: new Date(
            Date.now() + 4 * 24 * 60 * 60 * 1000
          ),
          purchaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          location: "fridge",
          emoji: "🥛",
        },
      ];
      setPantryItems(mockPantryItems);

      // Calculate quick stats
      const stats: QuickStat[] = [
        {
          label: "Recipes Saved",
          value: recipes.length,
          icon: "book" as IoniconsName,
        },
        {
          label: "Items in Pantry",
          value: mockPantryItems.length,
          icon: "archive" as IoniconsName,
        },
        {
          label: "Avg Rating",
          value:
            recipes.length > 0
              ? (
                  recipes.reduce(
                    (sum, recipe) => sum + recipe.rating,
                    0
                  ) / recipes.length
                ).toFixed(1)
              : "0.0",
          icon: "star" as IoniconsName,
        },
      ];
      setQuickStats(stats);
    } catch (error) {
      console.error("Failed to load data:", error);
      Alert.alert("Error", "Failed to load data. Please try again.");
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

  const addNewItem = async () => {
    if (!newItem.name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    try {
      // TODO: Implement pantry item creation in backend
      // const newPantryItem = await ApiService.createPantryItem({
      //   name: newItem.name,
      //   category: newItem.category,
      //   quantity: newItem.quantity,
      //   unit: newItem.unit,
      //   expirationDate: newItem.expirationDate,
      //   location: newItem.location,
      //   emoji: newItem.emoji,
      //   notes: newItem.notes,
      // });

      // For now, add locally
      const item: PantryItem = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        unit: newItem.unit,
        expirationDate: newItem.expirationDate,
        purchaseDate: new Date(),
        location: newItem.location,
        emoji: newItem.emoji,
        notes: newItem.notes,
      };

      setPantryItems([...pantryItems, item]);

      setNewItem({
        name: "",
        category: "fresh",
        quantity: 1,
        unit: "piece",
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: "fridge",
        emoji: "🥬",
        notes: "",
      });

      setAddItemModalVisible(false);
      Alert.alert("Success", "Item added to pantry!");
    } catch (error) {
      console.error("Failed to add item:", error);
      Alert.alert("Error", "Failed to add item. Please try again.");
    }
  };

  const generateRecipeWithPantry = async () => {
    try {
      const availableIngredients = pantryItems
        .map((item) => item.name)
        .join(", ");

      Alert.alert(
        "Generate Recipe",
        `Create a recipe using: ${availableIngredients}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Generate",
            onPress: () => {
              // TODO: Implement recipe generation with pantry items
              router.push("/recipes");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Failed to generate recipe:", error);
    }
  };

  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case "add":
        setAddItemModalVisible(true);
        break;
      case "grocery":
        router.push("/grocery");
        break;
      case "mealprep":
        router.push("/planner");
        break;
      case "recipes":
        router.push("/recipes");
        break;
      default:
        console.log("Unknown action");
    }
  };

  const getUserFirstName = () => {
    if (currentUser) {
      return currentUser.displayName?.split(" ")[0];
    }
    return "Chef";
  };

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
          Loading your kitchen...
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
          <ThemedView style={styles.logoContainer}>
            <Ionicons
              name={"restaurant" as IoniconsName}
              size={24}
              color="white"
            />
          </ThemedView>
          <ThemedView style={styles.headerText}>
            <ThemedText type="title" style={styles.headerTitle}>
              what's in
            </ThemedText>
            <ThemedText type="default" style={styles.headerSubtitle}>
              your pantry, your chef
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/recipes")}
          >
            <Ionicons
              name={"search" as IoniconsName}
              size={20}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name={"notifications" as IoniconsName}
              size={20}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
            {getExpiringItems().length > 0 && (
              <ThemedView style={styles.notificationDot} />
            )}
          </TouchableOpacity>
        </ThemedView>
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
        {/* Welcome Section */}
        <ThemedView style={styles.welcomeContainer}>
          <ThemedText type="title" style={styles.welcomeTitle}>
            Good morning, {getUserFirstName()}!
          </ThemedText>
          <ThemedText type="default" style={styles.welcomeSubtitle}>
            Ready to create something delicious with what you have?
          </ThemedText>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateRecipeWithPantry}
          >
            <Ionicons
              name={"add" as IoniconsName}
              size={20}
              color="#333"
              style={styles.generateButtonIcon}
            />
            <ThemedText
              type="defaultSemiBold"
              style={styles.generateButtonText}
            >
              Generate Recipe
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionCard}
              onPress={() => handleQuickAction(action.action)}
            >
              <ThemedView style={styles.quickActionIcon}>
                <Ionicons
                  name={action.icon as IoniconsName}
                  size={24}
                  color={THEME_COLOR}
                />
              </ThemedView>
              <ThemedText
                type="defaultSemiBold"
                style={styles.quickActionText}
              >
                {action.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.mainContent}>
          {/* Recent Recipes */}
          <ThemedView style={styles.recentRecipesContainer}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedText type="subtitle">Recent Recipes</ThemedText>
              <TouchableOpacity onPress={() => router.push("/recipes")}>
                <ThemedText type="link" style={styles.viewAllButton}>
                  View All
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {recentRecipes.length > 0 ? (
              recentRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe._id}
                  style={styles.recipeCard}
                  onPress={() => {
                    // TODO: Navigate to recipe detail
                    console.log("Navigate to recipe:", recipe._id);
                  }}
                >
                  <ThemedText style={styles.recipeEmoji}>
                    {recipe.image || "🍽️"}
                  </ThemedText>
                  <ThemedView style={styles.recipeInfo}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.recipeName}
                    >
                      {recipe.name}
                    </ThemedText>
                    <ThemedView style={styles.recipeDetails}>
                      <ThemedView style={styles.recipeDetailItem}>
                        <Ionicons
                          name={"time" as IoniconsName}
                          size={16}
                          color={
                            colorScheme === "dark" ? "#fff" : "#666"
                          }
                        />
                        <ThemedText
                          type="default"
                          style={styles.recipeDetailText}
                        >
                          {recipe.prepTime}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView style={styles.recipeDetailItem}>
                        <Ionicons
                          name={"star" as IoniconsName}
                          size={16}
                          color={THEME_COLOR}
                        />
                        <ThemedText
                          type="defaultSemiBold"
                          style={styles.recipeRating}
                        >
                          {recipe.rating}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                  <TouchableOpacity style={styles.recipeAction}>
                    <Ionicons
                      name={"heart" as IoniconsName}
                      size={20}
                      color={recipe.isFavorite ? "#ef4444" : "#999"}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedView style={styles.emptyState}>
                <Ionicons
                  name={"book-outline" as IoniconsName}
                  size={48}
                  color={colorScheme === "dark" ? "#666" : "#ccc"}
                />
                <ThemedText style={styles.emptyText}>
                  No recipes yet
                </ThemedText>
                <TouchableOpacity
                  onPress={() => router.push("/recipes")}
                >
                  <ThemedText type="link">Browse recipes</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}
          </ThemedView>

          {/* Sidebar Content */}
          <ThemedView style={styles.sidebar}>
            {/* Expiring Soon */}
            <ThemedView style={styles.sidebarCard}>
              <ThemedView style={styles.expiringSoonHeader}>
                <ThemedView style={styles.expiringDot} />
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.sidebarCardTitle}
                >
                  Expiring Soon
                </ThemedText>
              </ThemedView>
              {getExpiringItems().length > 0 ? (
                getExpiringItems().map((item, index) => (
                  <ThemedView key={index} style={styles.expiringItem}>
                    <ThemedText
                      type="default"
                      style={styles.expiringItemName}
                    >
                      {item.name}
                    </ThemedText>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.expiringItemDays}
                    >
                      {item.days}d
                    </ThemedText>
                  </ThemedView>
                ))
              ) : (
                <ThemedText style={styles.emptyText}>
                  All items are fresh!
                </ThemedText>
              )}
              <TouchableOpacity
                style={styles.sidebarButton}
                onPress={() => router.push("/pantry")}
              >
                <ThemedText
                  type="link"
                  style={styles.sidebarButtonText}
                >
                  Manage Pantry
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* This Week's Plan */}
            <ThemedView style={styles.sidebarCard}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.sidebarCardTitle}
              >
                This Week's Plan
              </ThemedText>
              <ThemedView style={styles.weekPlanItem}>
                <ThemedText type="default" style={styles.weekDay}>
                  Mon
                </ThemedText>
                <ThemedText type="default" style={styles.weekMealEmpty}>
                  Not planned
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.weekPlanItem}>
                <ThemedText type="default" style={styles.weekDay}>
                  Tue
                </ThemedText>
                <ThemedText type="default" style={styles.weekMealEmpty}>
                  Not planned
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.weekPlanItem}>
                <ThemedText type="default" style={styles.weekDay}>
                  Wed
                </ThemedText>
                <ThemedText type="default" style={styles.weekMealEmpty}>
                  Not planned
                </ThemedText>
              </ThemedView>
              <TouchableOpacity
                style={styles.sidebarButton}
                onPress={() => router.push("/planner")}
              >
                <ThemedText
                  type="link"
                  style={styles.sidebarButtonText}
                >
                  Plan Week
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* Quick Stats */}
            <ThemedView style={styles.sidebarCard}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.sidebarCardTitle}
              >
                Quick Stats
              </ThemedText>
              {quickStats.map((stat, index) => (
                <ThemedView key={index} style={styles.statItem}>
                  <ThemedText type="default" style={styles.statLabel}>
                    {stat.label}
                  </ThemedText>
                  <ThemedView style={styles.ratingContainer}>
                    <Ionicons
                      name={stat.icon}
                      size={16}
                      color={THEME_COLOR}
                    />
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.statValue}
                    >
                      {stat.value}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Bottom Navigation */}
      <ThemedView style={styles.bottomNavigation}>
        {navigationTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              styles.navTab,
              activeTab === tab.id && styles.activeNavTab,
            ]}
          >
            <Ionicons
              name={tab.icon as IoniconsName}
              size={20}
              color={
                activeTab === tab.id
                  ? "white"
                  : colorScheme === "dark"
                  ? "#fff"
                  : "#666"
              }
            />
            <ThemedText
              style={[
                styles.navTabLabel,
                activeTab === tab.id && styles.activeNavTabLabel,
              ]}
            >
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addItemModalVisible}
        onRequestClose={() => setAddItemModalVisible(false)}
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
                Add New Item
              </ThemedText>
              <TouchableOpacity
                onPress={() => setAddItemModalVisible(false)}
              >
                <Ionicons
                  name={"close" as IoniconsName}
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#333"}
                />
              </TouchableOpacity>
            </ThemedView>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Item Name */}
              <ThemedView style={styles.formGroup}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.formLabel}
                >
                  Item Name
                </ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      borderColor:
                        colorScheme === "dark" ? "#444" : "#e5e7eb",
                      backgroundColor:
                        colorScheme === "dark" ? "#333" : "#fff",
                      color: colorScheme === "dark" ? "#fff" : "#333",
                    },
                  ]}
                  placeholder="e.g., Organic Spinach"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#888" : "#999"
                  }
                  value={newItem.name}
                  onChangeText={(text) =>
                    setNewItem({ ...newItem, name: text })
                  }
                />
              </ThemedView>

              {/* Quantity and Unit */}
              <ThemedView style={styles.formRow}>
                <ThemedView
                  style={[
                    styles.formGroup,
                    { flex: 1, marginRight: 8 },
                  ]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.formLabel}
                  >
                    Quantity
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.formInput,
                      {
                        borderColor:
                          colorScheme === "dark" ? "#444" : "#e5e7eb",
                        backgroundColor:
                          colorScheme === "dark" ? "#333" : "#fff",
                        color: colorScheme === "dark" ? "#fff" : "#333",
                      },
                    ]}
                    placeholder="1"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#888" : "#999"
                    }
                    value={newItem.quantity.toString()}
                    onChangeText={(text) =>
                      setNewItem({
                        ...newItem,
                        quantity: parseInt(text) || 1,
                      })
                    }
                    keyboardType="numeric"
                  />
                </ThemedView>
                <ThemedView
                  style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.formLabel}
                  >
                    Unit
                  </ThemedText>
                  <TouchableOpacity
                    style={[styles.formInput, styles.pickerButton]}
                  >
                    <ThemedText
                      type="default"
                      style={styles.pickerText}
                    >
                      {newItem.unit}
                    </ThemedText>
                    <Ionicons
                      name={"chevron-down" as IoniconsName}
                      size={16}
                      color={colorScheme === "dark" ? "#fff" : "#666"}
                    />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              {/* Add Button */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: THEME_COLOR },
                ]}
                onPress={addNewItem}
                disabled={!newItem.name.trim()}
              >
                <Ionicons
                  name={"add" as IoniconsName}
                  size={18}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.modalButtonText}
                >
                  Add to Pantry
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f1e9",
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME_COLOR,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeContainer: {
    backgroundColor: THEME_COLOR,
    borderRadius: 16,
    padding: 24,
    marginVertical: 24,
    position: "relative",
    overflow: "hidden",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A21",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#1A1A21",
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  generateButtonIcon: {
    marginRight: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickActionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  mainContent: {
    flexDirection: "column",
    marginBottom: 100,
  },
  recentRecipesContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLOR,
  },
  recipeCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  recipeEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  recipeDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  recipeDetailText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  recipeRating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 4,
  },
  recipeAction: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  emptyText: {
    marginTop: 12,
    marginBottom: 8,
    opacity: 0.7,
    textAlign: "center",
  },
  sidebar: {
    marginTop: 8,
  },
  sidebarCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sidebarCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  expiringSoonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  expiringDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    marginRight: 8,
  },
  expiringItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  expiringItemName: {
    fontSize: 14,
    color: "#374151",
  },
  expiringItemDays: {
    fontSize: 14,
    fontWeight: "500",
    color: "#dc2626",
  },
  sidebarButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  sidebarButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLOR,
  },
  weekPlanItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  weekDay: {
    fontSize: 14,
    color: "#6b7280",
  },
  weekMeal: {
    fontSize: 14,
    color: "#111827",
  },
  weekMealEmpty: {
    fontSize: 14,
    color: "#9ca3af",
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeNavTab: {
    backgroundColor: THEME_COLOR,
  },
  navTabLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 4,
  },
  activeNavTabLabel: {
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
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
  },
  formGroup: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  formRow: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 44,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  modalButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});
