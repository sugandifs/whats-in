import { PantryItemCard } from "@/components/pantry/PantryItemCard";
import PantryModal from "@/components/pantry/PantryModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CategorySelector } from "@/components/ui/CategorySelector";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/services/api";
import { PantryItem, PantryStats } from "@/services/types";
import { pantryPageStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;
const THEME_COLOR = "#FFB902";

interface PantryCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

// New item type that matches the modal interface
interface NewItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expirationDate: Date;
  location: string;
  emoji: string;
  notes: string;
}

export default function PantryPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "expiration" | "category"
  >("expiration");
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  // Data states
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [pantryStats, setPantryStats] = useState<PantryStats | null>(
    null
  );
  const [filteredItems, setFilteredItems] = useState<PantryItem[]>([]);

  // Form state for adding new items
  const [newItem, setNewItem] = useState<NewItem>({
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
      count: pantryStats?.totalItems || 0,
    },
    {
      id: "fresh",
      name: "Fresh",
      icon: "leaf",
      color: "#22c55e",
      count: pantryStats?.categories.fresh || 0,
    },
    {
      id: "dairy",
      name: "Dairy",
      icon: "water",
      color: "#3b82f6",
      count: pantryStats?.categories.dairy || 0,
    },
    {
      id: "meat",
      name: "Meat & Fish",
      icon: "fish",
      color: "#ef4444",
      count: pantryStats?.categories.meat || 0,
    },
    {
      id: "pantry",
      name: "Pantry",
      icon: "archive",
      color: "#8b5cf6",
      count: pantryStats?.categories.pantry || 0,
    },
    {
      id: "frozen",
      name: "Frozen",
      icon: "snow",
      color: "#06b6d4",
      count: pantryStats?.categories.frozen || 0,
    },
  ];

  // Load data from backend
  const loadData = async () => {
    try {
      setLoading(true);

      const filters = {
        category:
          selectedCategory !== "all" ? selectedCategory : undefined,
        sortBy: sortBy,
      };

      const [items, stats] = await Promise.all([
        ApiService.getPantryItems(filters),
        ApiService.getPantryStats(),
      ]);

      setPantryItems(items);
      setPantryStats(stats);
    } catch (error) {
      console.error("Failed to load pantry data:", error);
      Alert.alert(
        "Error",
        "Failed to load pantry data. Please try again."
      );
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
  }, [currentUser, selectedCategory, sortBy]);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(pantryItems);
    } else {
      const filtered = pantryItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [pantryItems, searchQuery]);

  const getDaysUntilExpiration = (expirationDate: Date | string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddItem = async (item: NewItem) => {
    try {
      setAddingItem(true);

      const itemData = {
        name: item.name,
        category: item.category as PantryItem["category"],
        quantity: item.quantity,
        unit: item.unit as PantryItem["unit"],
        expirationDate: item.expirationDate,
        purchaseDate: new Date(),
        location: item.location as PantryItem["location"],
        emoji: item.emoji,
        notes: item.notes,
      };

      await ApiService.createPantryItem(itemData);
      Alert.alert("Success", "Item added to pantry!");

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
      await loadData();
    } catch (error) {
      console.error("Failed to add item:", error);
      Alert.alert("Error", "Failed to add item. Please try again.");
    } finally {
      setAddingItem(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your pantry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await ApiService.deletePantryItem(id);
              Alert.alert("Success", "Item removed from pantry!");
              await loadData();
            } catch (error) {
              console.error("Failed to remove item:", error);
              Alert.alert(
                "Error",
                "Failed to remove item. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleQuantityUpdate = async (
    itemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return;

    try {
      if (newQuantity === 0) {
        await ApiService.deletePantryItem(itemId);
        Alert.alert(
          "Item Removed",
          "Item was automatically removed from your pantry."
        );
        await loadData();
      } else {
        await ApiService.updatePantryItemQuantity(itemId, newQuantity);
        await loadData();
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      Alert.alert("Error", "Failed to update quantity.");
    }
  };

  if (loading && pantryItems.length === 0) {
    return (
      <SafeAreaView
        style={[
          pantryPageStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={THEME_COLOR} />
        <ThemedText style={{ marginTop: 16 }}>
          Loading your pantry...
        </ThemedText>
      </SafeAreaView>
    );
  }

  const expiringItems = pantryItems.filter(
    (item) =>
      getDaysUntilExpiration(item.expirationDate) <= 3 &&
      getDaysUntilExpiration(item.expirationDate) >= 0
  );

  return (
    <SafeAreaView style={pantryPageStyles.container}>
      <StatusBar
        barStyle={
          colorScheme === "dark" ? "light-content" : "dark-content"
        }
      />

      {/* Header */}
      <ThemedView style={pantryPageStyles.header}>
        <ThemedView style={pantryPageStyles.headerLeft}>
          <TouchableOpacity
            style={pantryPageStyles.backButton}
            onPress={() => router.navigate("/")}
          >
            <Ionicons
              name={"chevron-back" as IoniconsName}
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#333"}
            />
          </TouchableOpacity>
          <ThemedView style={pantryPageStyles.headerText}>
            <ThemedText
              type="title"
              style={pantryPageStyles.headerTitle}
            >
              Pantry
            </ThemedText>
            <ThemedText
              type="default"
              style={pantryPageStyles.headerSubtitle}
            >
              Track your ingredients
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Quick Stats */}
      <ThemedView style={pantryPageStyles.statsContainer}>
        <ThemedView style={pantryPageStyles.statCard}>
          <ThemedText
            type="default"
            style={pantryPageStyles.statNumber}
          >
            {pantryStats?.totalItems || 0}
          </ThemedText>
          <ThemedText type="default" style={pantryPageStyles.statLabel}>
            Total Items
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={[
            pantryPageStyles.statCard,
            pantryPageStyles.urgentStat,
          ]}
        >
          <ThemedText
            type="default"
            style={[pantryPageStyles.statNumber, { color: "#ef4444" }]}
          >
            {expiringItems.length}
          </ThemedText>
          <ThemedText type="default" style={pantryPageStyles.statLabel}>
            Expiring Soon
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Add Item Button */}
      <ThemedView style={pantryPageStyles.addButtonContainer}>
        <TouchableOpacity
          style={pantryPageStyles.addButton}
          onPress={() => setAddItemModalVisible(true)}
        >
          <Ionicons
            name={"add" as IoniconsName}
            size={20}
            color="white"
          />
          <ThemedText
            type="defaultSemiBold"
            style={pantryPageStyles.addButtonText}
          >
            Add Item
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Search and Controls */}
      <ThemedView style={pantryPageStyles.controlsContainer}>
        <ThemedView style={pantryPageStyles.searchBar}>
          <Ionicons
            name={"search" as IoniconsName}
            size={20}
            color={colorScheme === "dark" ? "#fff" : "#666"}
          />
          <TextInput
            style={[
              pantryPageStyles.searchInput,
              { color: colorScheme === "dark" ? "#fff" : "#333" },
            ]}
            placeholder="Search items..."
            placeholderTextColor={
              colorScheme === "dark" ? "#888" : "#999"
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>

        <TouchableOpacity
          style={pantryPageStyles.sortButton}
          onPress={() => {
            const sortOptions: (typeof sortBy)[] = [
              "expiration",
              "name",
              "category",
            ];
            const currentIndex = sortOptions.indexOf(sortBy);
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            setSortBy(sortOptions[nextIndex]);
          }}
        >
          <Ionicons
            name={"funnel" as IoniconsName}
            size={18}
            color={THEME_COLOR}
          />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        style={pantryPageStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[THEME_COLOR]}
          />
        }
      >
        {/* Categories */}
        <ThemedView style={pantryPageStyles.categoriesSection}>
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </ThemedView>

        {/* Items Grid/List */}
        <ThemedView style={pantryPageStyles.itemsSection}>
          <ThemedView style={pantryPageStyles.sectionHeader}>
            <ThemedText
              type="subtitle"
              style={pantryPageStyles.sectionTitle}
            >
              {selectedCategory === "all"
                ? "All Items"
                : categories.find((cat) => cat.id === selectedCategory)
                    ?.name || "Items"}
            </ThemedText>
            <ThemedText
              type="default"
              style={pantryPageStyles.itemCount}
            >
              {filteredItems.length} items
            </ThemedText>
          </ThemedView>

          {filteredItems.length > 0 ? (
            <ThemedView
              style={[
                pantryPageStyles.itemsGrid,
                activeView === "list" && pantryPageStyles.itemsList,
              ]}
            >
              {filteredItems.map((item) => (
                <ThemedView
                  key={item._id}
                  style={[
                    pantryPageStyles.itemContainer,
                    activeView === "list" &&
                      pantryPageStyles.itemContainerList,
                  ]}
                >
                  <PantryItemCard
                    item={item}
                    onQuantityUpdate={handleQuantityUpdate}
                    onLongPress={handleRemoveItem}
                    viewMode={activeView}
                  />
                </ThemedView>
              ))}
            </ThemedView>
          ) : (
            <ThemedView style={pantryPageStyles.emptyState}>
              <Ionicons
                name={"archive-outline" as IoniconsName}
                size={48}
                color={colorScheme === "dark" ? "#666" : "#ccc"}
              />
              <ThemedText style={pantryPageStyles.emptyText}>
                {searchQuery
                  ? "No items match your search"
                  : "Your pantry is empty"}
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

      <PantryModal
        visible={addItemModalVisible}
        onClose={() => setAddItemModalVisible(false)}
        onAddItem={handleAddItem}
        newItem={newItem}
        setNewItem={setNewItem}
        loading={addingItem}
      />
    </SafeAreaView>
  );
}
