import { FormInput } from "@/components/forms/FormInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActionButton } from "@/components/ui/ActionButton";
import { Header } from "@/components/ui/Header";
import { HeaderAction } from "@/components/ui/HeaderActions";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import ApiService from "@/services/api";
import { Recipe } from "@/services/types";
import { styles } from "@/styles";
import { homePageStyles } from "@/styles/pages";
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

interface QuickAction {
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  label: string;
  action: string;
}

interface ExpiringItem {
  name: string;
  days: number;
}

export default function MealPrepHome() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { themedColors, theme } = useThemedStyles();

  // State management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);

  // Data states
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

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

  const quickActions: QuickAction[] = [
    { icon: "add", label: "Add Inventory", action: "add" },
    { icon: "cart", label: "Grocery List", action: "grocery" },
    { icon: "calendar", label: "Meal Planner", action: "mealprep" },
    { icon: "book", label: "My Recipes", action: "recipes" },
  ];

  // Calculate expiring items
  const getExpiringItems = (): ExpiringItem[] => {
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

  // Load data from backend
  const loadData = async () => {
    try {
      setLoading(true);

      if (currentUser) {
        // Load recipes (recent ones)
        const recipes = await ApiService.getRecipes();
        setRecentRecipes(recipes.slice(0, 3));

        // Mock pantry items for now (replace with actual API call)
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
            purchaseDate: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ),
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
            purchaseDate: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ),
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
            purchaseDate: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ),
            location: "fridge",
            emoji: "🥛",
          },
        ];
        setPantryItems(mockPantryItems);
      }
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
              router.push("/generate-recipe");
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
    return <LoadingSpinner message="Loading your kitchen..." />;
  }

  const expiringItems = getExpiringItems();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={
          themedColors.text === "#1A1A21"
            ? "dark-content"
            : "light-content"
        }
      />

      <Header
        title="what's in"
        subtitle="your pantry, your chef"
        showBack={false}
        rightActions={
          <>
            <HeaderAction
              icon="search"
              onPress={() => router.push("/recipes")}
            />
            <HeaderAction
              icon="notifications"
              onPress={() => console.log("notifications")}
            />
          </>
        }
      />

      <ScrollView
        style={{ ...styles.container, padding: theme.spacing.lg }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themedColors.primary]}
          />
        }
      >
        {/* Welcome Section */}
        <ThemedView
          style={[
            homePageStyles.welcomeContainer,
            { backgroundColor: themedColors.primary },
          ]}
        >
          <ThemedText type="title" style={homePageStyles.welcomeTitle}>
            Good morning, {getUserFirstName()}!
          </ThemedText>
          <ThemedText
            type="default"
            style={homePageStyles.welcomeSubtitle}
          >
            Ready to create something delicious with what you have?
          </ThemedText>
          <TouchableOpacity
            style={homePageStyles.generateButton}
            onPress={generateRecipeWithPantry}
          >
            <ThemedText
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.semibold,
                color: "#1A1A21",
                marginLeft: theme.spacing.sm,
              }}
            >
              Generate Recipe
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={homePageStyles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                homePageStyles.quickActionCard,
                {
                  backgroundColor: themedColors.backgroundSecondary,
                  borderColor: themedColors.border,
                },
              ]}
              onPress={() => handleQuickAction(action.action)}
            >
              <ThemedView
                style={[
                  homePageStyles.quickActionIcon,
                  { backgroundColor: `${themedColors.primary}20` },
                ]}
              >
                <ThemedText style={{ fontSize: 24 }}>
                  {action.icon === "add"
                    ? "+"
                    : action.icon === "cart"
                    ? "🛒"
                    : action.icon === "calendar"
                    ? "📅"
                    : "📖"}
                </ThemedText>
              </ThemedView>
              <ThemedText
                style={[
                  homePageStyles.quickActionText,
                  { color: themedColors.text },
                ]}
              >
                {action.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Main Content */}
        <ThemedView style={homePageStyles.mainContent}>
          {/* Recent Recipes */}
          <ThemedView style={{ marginBottom: theme.spacing.xxl }}>
            <ThemedView style={homePageStyles.sectionHeader}>
              <ThemedText type="subtitle">Recent Recipes</ThemedText>
              <TouchableOpacity onPress={() => router.push("/recipes")}>
                <ThemedText
                  type="link"
                  style={[
                    homePageStyles.viewAllButton,
                    { color: themedColors.primary },
                  ]}
                >
                  View All
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {recentRecipes.length > 0 ? (
              recentRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe._id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: themedColors.backgroundSecondary,
                      borderColor: themedColors.border,
                      marginBottom: theme.spacing.md,
                      padding: theme.spacing.lg,
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                  onPress={() =>
                    router.push(`/recipe/${recipe._id}` as any)
                  }
                >
                  <ThemedText
                    style={{
                      fontSize: 32,
                      marginRight: theme.spacing.lg,
                    }}
                  >
                    {recipe.image || "🍽️"}
                  </ThemedText>
                  <ThemedView
                    style={{ flex: 1, backgroundColor: "transparent" }}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ marginBottom: 4 }}
                    >
                      {recipe.name}
                    </ThemedText>
                    <ThemedView
                      style={{
                        ...styles.row,
                        backgroundColor: "transparent",
                      }}
                    >
                      <ThemedView
                        style={[
                          styles.row,
                          {
                            marginRight: theme.spacing.lg,
                            backgroundColor: "transparent",
                          },
                        ]}
                      >
                        <ThemedText
                          style={{
                            fontSize: 14,
                            opacity: 0.7,
                            marginLeft: 4,
                            backgroundColor: "transparent",
                          }}
                        >
                          {recipe.prepTime}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                  <TouchableOpacity
                    style={{ padding: theme.spacing.sm }}
                  >
                    <ThemedText style={{ fontSize: 20 }}>
                      {recipe.isFavorite ? "❤️" : "🤍"}
                    </ThemedText>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedView
                style={[
                  styles.emptyState,
                  {
                    backgroundColor: themedColors.backgroundTertiary,
                    borderColor: themedColors.border,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    fontSize: 48,
                    marginBottom: theme.spacing.lg,
                  }}
                >
                  📖
                </ThemedText>
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
          <ThemedView style={homePageStyles.sidebar}>
            {/* Expiring Soon */}
            <ThemedView
              style={[
                homePageStyles.sidebarCard,
                {
                  backgroundColor: themedColors.backgroundSecondary,
                  borderColor: themedColors.border,
                },
              ]}
            >
              <ThemedView
                style={[
                  styles.row,
                  {
                    marginBottom: theme.spacing.md,
                    backgroundColor: "transparent",
                  },
                ]}
              >
                <ThemedView
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: themedColors.error,
                    marginRight: theme.spacing.sm,
                  }}
                />
                <ThemedText type="defaultSemiBold">
                  Expiring Soon
                </ThemedText>
              </ThemedView>

              {expiringItems.length > 0 ? (
                expiringItems.map((item, index) => (
                  <ThemedView
                    key={index}
                    style={[
                      styles.rowBetween,
                      { marginBottom: theme.spacing.sm },
                      { backgroundColor: "transparent" },
                    ]}
                  >
                    <ThemedText style={{ fontSize: 14 }}>
                      {item.name}
                    </ThemedText>
                    <ThemedText
                      style={{
                        fontSize: 14,
                        fontWeight: theme.typography.weights.medium,
                        color: themedColors.error,
                      }}
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
                style={{
                  marginTop: theme.spacing.md,
                  alignItems: "center",
                }}
                onPress={() => router.push("/pantry")}
              >
                <ThemedText type="link">Manage Pantry</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* This Week's Plan */}
            <ThemedView
              style={[
                homePageStyles.sidebarCard,
                {
                  backgroundColor: themedColors.backgroundSecondary,
                  borderColor: themedColors.border,
                },
              ]}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{ marginBottom: theme.spacing.md }}
              >
                This Week's Plan
              </ThemedText>

              {["Mon", "Tue", "Wed"].map((day) => (
                <ThemedView
                  key={day}
                  style={[
                    styles.rowBetween,
                    {
                      marginBottom: theme.spacing.sm,
                      backgroundColor: "transparent",
                    },
                  ]}
                >
                  <ThemedText style={{ fontSize: 14 }}>
                    {day}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      opacity: 0.7,
                    }}
                  >
                    Not planned
                  </ThemedText>
                </ThemedView>
              ))}

              <TouchableOpacity
                style={{
                  marginTop: theme.spacing.md,
                  alignItems: "center",
                }}
                onPress={() => router.push("/planner")}
              >
                <ThemedText type="link">Plan Week</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={addItemModalVisible}
        onClose={() => setAddItemModalVisible(false)}
        title="Add New Item"
      >
        <FormInput
          label="Item Name"
          placeholder="e.g., Organic Spinach"
          value={newItem.name}
          onChangeText={(text) =>
            setNewItem({ ...newItem, name: text })
          }
        />

        <ThemedView
          style={[styles.row, { backgroundColor: "transparent" }]}
        >
          <FormInput
            label="Quantity"
            placeholder="1"
            value={newItem.quantity.toString()}
            onChangeText={(text) =>
              setNewItem({
                ...newItem,
                quantity: parseInt(text) || 1,
              })
            }
            keyboardType="numeric"
            containerStyle={{ flex: 1, marginRight: theme.spacing.sm }}
          />
          <FormInput
            label="Unit"
            value={newItem.unit}
            containerStyle={{ flex: 1, marginLeft: theme.spacing.sm }}
          />
        </ThemedView>

        <ActionButton
          title="Add to Pantry"
          icon="add"
          onPress={addNewItem}
          disabled={!newItem.name.trim()}
          style={{ marginTop: theme.spacing.lg }}
        />
      </Modal>
    </SafeAreaView>
  );
}
