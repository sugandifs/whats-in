import { FormInput } from "@/components/forms/FormInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActionButton } from "@/components/ui/ActionButton";
import { Header } from "@/components/ui/Header";
import { HeaderAction } from "@/components/ui/HeaderActions";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { SearchBar } from "@/components/ui/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import ApiService from "@/services/api";
import {
  CreateGroceryItemData,
  GroceryItem,
  QuickAddItem,
} from "@/services/types";
import { baseTheme, pantryPageStyles, styles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface GroceryCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export default function GroceryListPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { themedColors, theme } = useThemedStyles();
  const colorScheme = useColorScheme();

  // State management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");

  // Data states
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);

  // Form state for adding new items
  const [newItem, setNewItem] = useState<CreateGroceryItemData>({
    name: "",
    quantity: 1,
    unit: "piece",
    category: "fresh",
    emoji: "🛒",
    notes: "",
    priority: "medium",
  });

  const quickAddItems: QuickAddItem[] = [
    { name: "Milk", emoji: "🥛", category: "dairy", unit: "gallon" },
    { name: "Eggs", emoji: "🥚", category: "dairy", unit: "dozen" },
    { name: "Bread", emoji: "🍞", category: "bakery", unit: "loaf" },
    { name: "Bananas", emoji: "🍌", category: "fresh", unit: "bunch" },
    { name: "Tomatoes", emoji: "🍅", category: "fresh", unit: "lb" },
    { name: "Chicken", emoji: "🍗", category: "meat", unit: "lb" },
    { name: "Rice", emoji: "🍚", category: "pantry", unit: "bag" },
    { name: "Pasta", emoji: "🍝", category: "pantry", unit: "box" },
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
    "box",
    "bag",
    "bunch",
    "dozen",
    "gallon",
    "loaf",
    "jar",
    "can",
    "pint",
    "quart",
    "liter",
  ];

  const categories: GroceryCategory[] = [
    {
      id: "fresh",
      name: "Fresh Produce",
      emoji: "🥬",
      color: themedColors.categories?.fresh || "#22c55e",
    },
    { id: "dairy", name: "Dairy", emoji: "🥛", color: "#3b82f6" },
    { id: "meat", name: "Meat & Fish", emoji: "🍗", color: "#ef4444" },
    { id: "pantry", name: "Pantry", emoji: "🥫", color: "#8b5cf6" },
    { id: "bakery", name: "Bakery", emoji: "🍞", color: "#f59e0b" },
    { id: "frozen", name: "Frozen", emoji: "🧊", color: "#06b6d4" },
    { id: "snacks", name: "Snacks", emoji: "🍿", color: "#f97316" },
    {
      id: "beverages",
      name: "Beverages",
      emoji: "🥤",
      color: "#10b981",
    },
    {
      id: "household",
      name: "Household",
      emoji: "🧽",
      color: "#6366f1",
    },
    {
      id: "other",
      name: "Other",
      emoji: "🛒",
      color: themedColors.textSecondary,
    },
  ];

  // Load grocery items from API
  const loadGroceryItems = async () => {
    try {
      setLoading(true);
      if (currentUser) {
        const filters = {
          category:
            selectedCategory !== "all" ? selectedCategory : undefined,
          sortBy: "addedDate" as const,
        };
        const items = await ApiService.getGroceryItems(filters);
        setGroceryList(items);
      }
    } catch (error) {
      console.error("Failed to load grocery items:", error);
      Alert.alert(
        "Error",
        "Failed to load grocery list. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroceryItems();
    setRefreshing(false);
  };

  useEffect(() => {
    if (currentUser) {
      loadGroceryItems();
    }
  }, [currentUser, selectedCategory]);

  // Filter items based on search and completion status
  const filteredItems = groceryList.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesVisibility = showCompleted || !item.isCompleted;
    return matchesSearch && matchesVisibility;
  });

  const pendingItems = filteredItems.filter(
    (item) => !item.isCompleted
  );
  const completedItems = filteredItems.filter(
    (item) => item.isCompleted
  );

  const toggleItem = async (id: string) => {
    try {
      // Optimistic update
      setGroceryList((prevList) =>
        prevList.map((item) =>
          item._id === id
            ? { ...item, isCompleted: !item.isCompleted }
            : item
        )
      );

      await ApiService.toggleGroceryItem(id);
    } catch (error) {
      console.error("Failed to toggle item:", error);
      // Revert optimistic update
      setGroceryList((prevList) =>
        prevList.map((item) =>
          item._id === id
            ? { ...item, isCompleted: !item.isCompleted }
            : item
        )
      );
      Alert.alert("Error", "Failed to update item. Please try again.");
    }
  };

  const removeItem = async (id: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // Optimistic update
              setGroceryList((prevList) =>
                prevList.filter((item) => item._id !== id)
              );

              await ApiService.deleteGroceryItem(id);
            } catch (error) {
              console.error("Failed to remove item:", error);
              Alert.alert(
                "Error",
                "Failed to remove item. Please try again."
              );
              // Reload the list to revert the optimistic update
              await loadGroceryItems();
            }
          },
        },
      ]
    );
  };

  const addNewItem = async () => {
    if (!newItem.name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    try {
      const createdItem = await ApiService.createGroceryItem({
        ...newItem,
        name: newItem.name.trim(),
      });

      setGroceryList((prevList) => [createdItem, ...prevList]);

      // Reset form
      setNewItem({
        name: "",
        quantity: 1,
        unit: "piece",
        category: "fresh",
        emoji: "🛒",
        notes: "",
        priority: "medium",
      });

      setAddItemModalVisible(false);
      Alert.alert("Success", "Item added to grocery list!");
    } catch (error) {
      console.error("Failed to add item:", error);
      Alert.alert("Error", "Failed to add item. Please try again.");
    }
  };

  const quickAddItem = async (quickItem: QuickAddItem) => {
    const existingItem = groceryList.find(
      (item) =>
        item.name.toLowerCase() === quickItem.name.toLowerCase() &&
        !item.isCompleted
    );

    if (existingItem) {
      Alert.alert(
        "Item Already Added",
        `${quickItem.name} is already in your list.`,
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const itemData: CreateGroceryItemData = {
        name: quickItem.name,
        quantity: 1,
        unit: quickItem.unit,
        category: quickItem.category,
        emoji: quickItem.emoji,
        priority: "medium",
      };

      const createdItem = await ApiService.createGroceryItem(itemData);
      setGroceryList((prevList) => [createdItem, ...prevList]);
    } catch (error) {
      console.error("Failed to add quick item:", error);
      Alert.alert("Error", "Failed to add item. Please try again.");
    }
  };

  const clearCompleted = async () => {
    const completedCount = groceryList.filter(
      (item) => item.isCompleted
    ).length;

    if (completedCount === 0) {
      Alert.alert("No Items", "No completed items to clear.");
      return;
    }

    Alert.alert(
      "Clear Completed Items",
      `Remove ${completedCount} completed item${
        completedCount > 1 ? "s" : ""
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await ApiService.clearCompletedGroceryItems();
              setGroceryList((prevList) =>
                prevList.filter((item) => !item.isCompleted)
              );
              Alert.alert("Success", "Completed items cleared!");
            } catch (error) {
              console.error("Failed to clear completed items:", error);
              Alert.alert(
                "Error",
                "Failed to clear completed items. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const renderGroceryItem = (item: GroceryItem) => {
    const itemDate = new Date(item.addedDate);
    const formattedDate = itemDate.toLocaleDateString();

    return (
      <ThemedView
        key={item._id}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: themedColors.border,
            backgroundColor: themedColors.backgroundSecondary,
          },
          item.isCompleted && {
            opacity: 0.6,
            backgroundColor: themedColors.backgroundTertiary,
          },
        ]}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => toggleItem(item._id)}
        >
          <ThemedView
            style={[
              {
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: item.isCompleted
                  ? themedColors.success
                  : themedColors.border,
                marginRight: theme.spacing.md,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: item.isCompleted
                  ? themedColors.success
                  : "transparent",
              },
            ]}
          >
            {item.isCompleted && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </ThemedView>

          <ThemedText
            style={{ fontSize: 24, marginRight: theme.spacing.md }}
          >
            {item.emoji}
          </ThemedText>

          <ThemedView
            style={{ flex: 1, backgroundColor: "transparent" }}
          >
            <ThemedText
              type="defaultSemiBold"
              style={[
                { fontSize: 16, marginBottom: 2 },
                item.isCompleted && {
                  textDecorationLine: "line-through",
                  opacity: 0.6,
                },
              ]}
            >
              {item.name}
            </ThemedText>
            <ThemedText
              type="default"
              style={[
                { fontSize: 14, opacity: 0.7 },
                item.isCompleted && { opacity: 0.5 },
              ]}
            >
              {item.quantity} {item.unit}
            </ThemedText>
            {item.notes && (
              <ThemedText
                type="default"
                style={[
                  {
                    fontSize: 12,
                    opacity: 0.6,
                    marginTop: 2,
                    fontStyle: "italic",
                  },
                  item.isCompleted && { opacity: 0.4 },
                ]}
              >
                {item.notes}
              </ThemedText>
            )}
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: theme.spacing.sm }}
          onPress={() => removeItem(item._id)}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={themedColors.error}
          />
        </TouchableOpacity>
      </ThemedView>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading grocery list..." />;
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
        title="Grocery List"
        subtitle={`${pendingItems.length} item${
          pendingItems.length !== 1 ? "s" : ""
        } to buy`}
        onBackPress={() => router.navigate("/")}
        rightActions={
          <HeaderAction icon="trash" onPress={clearCompleted} />
        }
      />

      <ThemedView style={pantryPageStyles.statsContainer}>
        <ThemedView style={pantryPageStyles.statCard}>
          <ThemedText
            type="default"
            style={[
              styles.statNumber,
              { color: baseTheme.colors.primary },
            ]}
          >
            {pendingItems.length}
          </ThemedText>
          <ThemedText type="default" style={pantryPageStyles.statLabel}>
            Pending
          </ThemedText>
        </ThemedView>
        <ThemedView style={pantryPageStyles.statCard}>
          <ThemedText
            type="default"
            style={[
              pantryPageStyles.statNumber,
              { color: baseTheme.colors.success },
            ]}
          >
            {completedItems.length}
          </ThemedText>
          <ThemedText type="default" style={pantryPageStyles.statLabel}>
            Completed
          </ThemedText>
        </ThemedView>
        <ThemedView style={pantryPageStyles.statCard}>
          <ThemedText
            type="default"
            style={[
              pantryPageStyles.statNumber,
              { color: baseTheme.colors.primary },
            ]}
          >
            {groceryList.length}
          </ThemedText>
          <ThemedText type="default" style={pantryPageStyles.statLabel}>
            Total
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Add Item Button */}
      <ThemedView
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
          backgroundColor: "transparent",
        }}
      >
        <ActionButton
          title="Add Item"
          icon="add"
          onPress={() => setAddItemModalVisible(true)}
        />
      </ThemedView>

      {/* Search Bar */}
      <ThemedView
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.lg,
          backgroundColor: "transparent",
        }}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search items..."
        />
      </ThemedView>

      <ScrollView
        style={[styles.container]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themedColors.primary]}
          />
        }
      >
        {/* Quick Add */}
        <ThemedView
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
            backgroundColor: "transparent",
          }}
        >
          <ThemedText
            type="subtitle"
            style={{ fontSize: 18, marginBottom: theme.spacing.lg }}
          >
            Quick Add
          </ThemedText>
          <ThemedView
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              backgroundColor: "transparent",
            }}
          >
            {quickAddItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "23%",
                  alignItems: "center",
                  paddingVertical: theme.spacing.md,
                  marginBottom: theme.spacing.md,
                  borderRadius: theme.borderRadius.sm,
                  borderWidth: 1,
                  borderColor: themedColors.border,
                  backgroundColor: themedColors.backgroundTertiary,
                }}
                onPress={() => quickAddItem(item)}
              >
                <ThemedText style={{ fontSize: 24, marginBottom: 4 }}>
                  {item.emoji}
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 10, textAlign: "center" }}
                >
                  {item.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Grocery Items */}
        <ThemedView
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: 100,
            backgroundColor: "transparent",
          }}
        >
          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <ThemedView
              style={{
                marginBottom: theme.spacing.xl,
                backgroundColor: "transparent",
              }}
            >
              <ThemedText
                type="subtitle"
                style={{ fontSize: 16, marginBottom: theme.spacing.md }}
              >
                To Buy ({pendingItems.length})
              </ThemedText>
              {pendingItems.map(renderGroceryItem)}
            </ThemedView>
          )}

          {/* Completed Items */}
          {showCompleted && completedItems.length > 0 && (
            <ThemedView
              style={{
                marginBottom: theme.spacing.xl,
                backgroundColor: "transparent",
              }}
            >
              <ThemedText
                type="subtitle"
                style={{
                  fontSize: 16,
                  marginBottom: theme.spacing.md,
                  opacity: 0.7,
                }}
              >
                Completed ({completedItems.length})
              </ThemedText>
              {completedItems.map(renderGroceryItem)}
            </ThemedView>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <ThemedView style={pantryPageStyles.emptyState}>
              <Ionicons
                name={"cart" as IoniconsName}
                size={48}
                color={colorScheme === "dark" ? "#666" : "#ccc"}
              />
              <ThemedText style={pantryPageStyles.emptyText}>
                {searchQuery
                  ? "No items match your search"
                  : "Your grocery list is empty"}
              </ThemedText>
              <TouchableOpacity
                onPress={() => {
                  if (searchQuery) {
                    setSearchQuery("");
                  } else {
                    setAddItemModalVisible(true);
                  }
                }}
              >
                <ThemedText type="link">
                  {searchQuery ? "Clear search" : "Add your first item"}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={addItemModalVisible}
        onClose={() => setAddItemModalVisible(false)}
        title="Add Item"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Item Name */}
          <FormInput
            label="Item Name"
            placeholder="e.g., Organic Milk"
            value={newItem.name}
            onChangeText={(text) =>
              setNewItem({ ...newItem, name: text })
            }
          />

          {/* Quantity and Unit */}
          <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
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
              containerStyle={{ flex: 1 }}
            />
            <FormInput
              label="Unit"
              value={newItem.unit}
              containerStyle={{ flex: 1 }}
            />
          </View>

          {/* Category */}
          <FormInput
            label="Category"
            value={
              categories.find((cat) => cat.id === newItem.category)
                ?.name || "Other"
            }
            containerStyle={{ marginBottom: theme.spacing.lg }}
          />

          {/* Notes */}
          <FormInput
            label="Notes (Optional)"
            placeholder="e.g., Brand preference, size, etc."
            value={newItem.notes}
            onChangeText={(text) =>
              setNewItem({ ...newItem, notes: text })
            }
            multiline
            style={{ minHeight: 80, textAlignVertical: "top" }}
          />

          <ActionButton
            title="Add to List"
            icon="add"
            onPress={addNewItem}
            disabled={!newItem.name.trim()}
            style={{ marginTop: theme.spacing.lg }}
          />
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
}
