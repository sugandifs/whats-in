import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/services/api";
import { PantryItem, PantryStats } from "@/services/types";
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

interface PantryCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export default function PantryPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "expiration" | "category"
  >("expiration");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  // Data states
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [pantryStats, setPantryStats] = useState<PantryStats | null>(
    null
  );
  const [filteredItems, setFilteredItems] = useState<PantryItem[]>([]);

  // Form state for adding new items
  const [newItem, setNewItem] = useState({
    name: "",
    category: "fresh" as const,
    quantity: 1,
    unit: "piece" as const,
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    location: "fridge" as const,
    emoji: "🥬",
    notes: "",
  });

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

      // Load pantry items with current filters
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

  // Load data on component mount and when filters change
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

  const getExpirationStatus = (expirationDate: Date | string) => {
    const days = getDaysUntilExpiration(expirationDate);
    if (days < 0)
      return { status: "expired", color: "#ef4444", text: "Expired" };
    if (days === 0)
      return { status: "today", color: "#f97316", text: "Today" };
    if (days <= 2)
      return { status: "urgent", color: "#ef4444", text: `${days}d` };
    if (days <= 7)
      return { status: "soon", color: "#f59e0b", text: `${days}d` };
    return { status: "good", color: "#10b981", text: `${days}d` };
  };

  const addNewItem = async () => {
    if (!newItem.name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    try {
      setLoading(true);

      const itemData = {
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

      await ApiService.createPantryItem(itemData);

      // Reset form
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

      // Refresh data
      await loadData();
    } catch (error) {
      console.error("Failed to add item:", error);
      Alert.alert("Error", "Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (id: string) => {
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
        // Normal quantity update
        await ApiService.updatePantryItemQuantity(itemId, newQuantity);
        await loadData();
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      Alert.alert("Error", "Failed to update quantity.");
    }
  };

  // const handleBarcodeScan = async (barcode: string) => {
  //   try {
  //     setLoading(true);
  //     const result = await ApiService.scanBarcode(barcode);

  //     if (result.success) {
  //       // Pre-fill the form with scanned data
  //       setNewItem({
  //         name: result.item.name || "",
  //         category: result.item.category || "pantry",
  //         quantity: result.item.quantity || 1,
  //         unit: result.item.unit || "piece",
  //         expirationDate: result.item.expirationDate
  //           ? new Date(result.item.expirationDate)
  //           : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  //         location: result.item.location || "pantry",
  //         emoji: result.item.emoji || "📦",
  //         notes: result.item.notes || "",
  //       });

  //       setScanModalVisible(false);
  //       setAddItemModalVisible(true);
  //       Alert.alert("Barcode Scanned", result.message);
  //     }
  //   } catch (error) {
  //     console.error("Barcode scan failed:", error);
  //     Alert.alert("Error", "Failed to scan barcode. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderItemCard = ({ item }: { item: PantryItem }) => {
    const expiration = getExpirationStatus(item.expirationDate);
    const location = locations.find((loc) => loc.id === item.location);

    return (
      <TouchableOpacity
        style={[
          styles.itemCard,
          activeView === "list" && styles.itemCardList,
        ]}
        onLongPress={() => removeItem(item._id)}
      >
        <ThemedView style={styles.itemHeader}>
          <ThemedText style={styles.itemEmoji}>{item.emoji}</ThemedText>
          <ThemedView
            style={[
              styles.expirationBadge,
              { backgroundColor: expiration.color },
            ]}
          >
            <ThemedText style={styles.expirationText}>
              {expiration.text}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.itemInfo}>
          <ThemedText type="defaultSemiBold" style={styles.itemName}>
            {item.name}
          </ThemedText>

          <ThemedView style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                handleQuantityUpdate(item._id, item.quantity - 1)
              }
            >
              <Ionicons name="remove" size={16} color={THEME_COLOR} />
            </TouchableOpacity>

            <ThemedText type="default" style={styles.itemQuantity}>
              {item.quantity} {item.unit}
            </ThemedText>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                handleQuantityUpdate(item._id, item.quantity + 1)
              }
            >
              <Ionicons name="add" size={16} color={THEME_COLOR} />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.itemDetails}>
            <ThemedView style={styles.itemDetail}>
              <Ionicons
                name={location?.icon as IoniconsName}
                size={12}
                color={colorScheme === "dark" ? "#fff" : "#666"}
              />
              <ThemedText type="default" style={styles.itemDetailText}>
                {location?.name}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.itemDetail}>
              <Ionicons
                name={"calendar" as IoniconsName}
                size={12}
                color={colorScheme === "dark" ? "#fff" : "#666"}
              />
              <ThemedText type="default" style={styles.itemDetailText}>
                {new Date(item.expirationDate).toLocaleDateString()}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {item.notes && (
            <ThemedText type="default" style={styles.itemNotes}>
              {item.notes}
            </ThemedText>
          )}
        </ThemedView>
      </TouchableOpacity>
    );
  };

  const renderCategoryCard = ({ item }: { item: PantryCategory }) => (
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

  if (loading && pantryItems.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.container,
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
              Pantry
            </ThemedText>
            <ThemedText type="default" style={styles.headerSubtitle}>
              Track your ingredients
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerAction}
            onPress={() => setScanModalVisible(true)}
          >
            <Ionicons
              name={"scan" as IoniconsName}
              size={20}
              color={THEME_COLOR}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerAction}
            onPress={() =>
              setActiveView(activeView === "grid" ? "list" : "grid")
            }
          >
            <Ionicons
              name={activeView === "grid" ? "list" : "grid"}
              size={20}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* Quick Stats */}
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statCard}>
          <ThemedText type="default" style={styles.statNumber}>
            {pantryStats?.totalItems || 0}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Total Items
          </ThemedText>
        </ThemedView>
        <ThemedView style={[styles.statCard, styles.urgentStat]}>
          <ThemedText
            type="default"
            style={[styles.statNumber, { color: "#ef4444" }]}
          >
            {expiringItems.length}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Expiring Soon
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Add Item Button */}
      <ThemedView style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddItemModalVisible(true)}
        >
          <Ionicons
            name={"add" as IoniconsName}
            size={20}
            color="white"
          />
          <ThemedText
            type="defaultSemiBold"
            style={styles.addButtonText}
          >
            Add Item
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Search and Controls */}
      <ThemedView style={styles.controlsContainer}>
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
            placeholder="Search items..."
            placeholderTextColor={
              colorScheme === "dark" ? "#888" : "#999"
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            // Cycle through sort options
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
        {/* Categories */}
        <ThemedView style={styles.categoriesSection}>
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          />
        </ThemedView>

        {/* Items Grid/List */}
        <ThemedView style={styles.itemsSection}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {selectedCategory === "all"
                ? "All Items"
                : categories.find((cat) => cat.id === selectedCategory)
                    ?.name || "Items"}
            </ThemedText>
            <ThemedText type="default" style={styles.itemCount}>
              {filteredItems.length} items
            </ThemedText>
          </ThemedView>

          {filteredItems.length > 0 ? (
            <ThemedView
              style={[
                styles.itemsGrid,
                activeView === "list" && styles.itemsList,
              ]}
            >
              {filteredItems.map((item) => (
                <ThemedView
                  key={item._id}
                  style={[
                    styles.itemContainer,
                    activeView === "list" && styles.itemContainerList,
                  ]}
                >
                  {renderItemCard({ item })}
                </ThemedView>
              ))}
            </ThemedView>
          ) : (
            <ThemedView style={styles.emptyState}>
              <Ionicons
                name={"archive-outline" as IoniconsName}
                size={48}
                color={colorScheme === "dark" ? "#666" : "#ccc"}
              />
              <ThemedText style={styles.emptyText}>
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

              {/* Category */}
              <ThemedView style={styles.formGroup}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.formLabel}
                >
                  Category
                </ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryPicker}
                >
                  {categories
                    .filter((cat) => cat.id !== "all")
                    .map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryOption,
                          newItem.category === category.id && {
                            backgroundColor: category.color,
                            borderColor: category.color,
                          },
                        ]}
                        onPress={() =>
                          setNewItem({
                            ...newItem,
                            category: category.id as any,
                          })
                        }
                      >
                        <Ionicons
                          name={category.icon as IoniconsName}
                          size={16}
                          color={
                            newItem.category === category.id
                              ? "white"
                              : category.color
                          }
                        />
                        <ThemedText
                          type="default"
                          style={[
                            styles.categoryOptionText,
                            newItem.category === category.id && {
                              color: "white",
                            },
                          ]}
                        >
                          {category.name}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </ThemedView>

              {/* Location */}
              <ThemedView style={styles.formGroup}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.formLabel}
                >
                  Storage Location
                </ThemedText>
                <ThemedView style={styles.locationPicker}>
                  {locations.map((location) => (
                    <TouchableOpacity
                      key={location.id}
                      style={[
                        styles.locationOption,
                        newItem.location === location.id && {
                          backgroundColor: THEME_COLOR,
                          borderColor: THEME_COLOR,
                        },
                      ]}
                      onPress={() =>
                        setNewItem({
                          ...newItem,
                          location: location.id as any,
                        })
                      }
                    >
                      <Ionicons
                        name={location.icon as IoniconsName}
                        size={16}
                        color={
                          newItem.location === location.id
                            ? "white"
                            : THEME_COLOR
                        }
                      />
                      <ThemedText
                        type="default"
                        style={[
                          styles.locationOptionText,
                          newItem.location === location.id && {
                            color: "white",
                          },
                        ]}
                      >
                        {location.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ThemedView>

              {/* Expiration Date */}
              <ThemedView style={styles.formGroup}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.formLabel}
                >
                  Expiration Date
                </ThemedText>
                <TouchableOpacity
                  style={[styles.formInput, styles.dateButton]}
                >
                  <Ionicons
                    name={"calendar" as IoniconsName}
                    size={16}
                    color={colorScheme === "dark" ? "#fff" : "#666"}
                  />
                  <ThemedText type="default" style={styles.dateText}>
                    {newItem.expirationDate.toLocaleDateString()}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>

              {/* Notes */}
              <ThemedView style={styles.formGroup}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.formLabel}
                >
                  Notes (Optional)
                </ThemedText>
                <TextInput
                  style={[
                    styles.formInput,
                    styles.notesInput,
                    {
                      borderColor:
                        colorScheme === "dark" ? "#444" : "#e5e7eb",
                      backgroundColor:
                        colorScheme === "dark" ? "#333" : "#fff",
                      color: colorScheme === "dark" ? "#fff" : "#333",
                    },
                  ]}
                  placeholder="e.g., Organic, from farmer's market"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#888" : "#999"
                  }
                  value={newItem.notes}
                  onChangeText={(text) =>
                    setNewItem({ ...newItem, notes: text })
                  }
                  multiline
                  textAlignVertical="top"
                />
              </ThemedView>

              {/* Add Button */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: THEME_COLOR },
                ]}
                onPress={addNewItem}
                disabled={!newItem.name.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
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
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </ThemedView>
        </ThemedView>
      </Modal>

      {/* Scan Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={scanModalVisible}
        onRequestClose={() => setScanModalVisible(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView
            style={[
              styles.scanModalContent,
              {
                backgroundColor:
                  colorScheme === "dark" ? "#1a1a1a" : "#ffffff",
              },
            ]}
          >
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Scan Barcode
              </ThemedText>
              <TouchableOpacity
                onPress={() => setScanModalVisible(false)}
              >
                <Ionicons
                  name={"close" as IoniconsName}
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#333"}
                />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.scanArea}>
              <ThemedView style={styles.scanFrame}>
                <Ionicons
                  name={"scan" as IoniconsName}
                  size={64}
                  color={THEME_COLOR}
                />
                <ThemedText type="default" style={styles.scanText}>
                  Position barcode within the frame
                </ThemedText>
              </ThemedView>

              {/* Simulate barcode scan for demo */}
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: THEME_COLOR, marginTop: 20 },
                ]}
                onPress={() => console.log("scan")}
              >
                <ThemedText style={styles.modalButtonText}>
                  Simulate Scan (Demo)
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
  headerActions: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  headerAction: {
    padding: 8,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: "transparent",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  urgentStat: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "#ef4444",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME_COLOR,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  addButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_COLOR,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  controlsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: "transparent",
  },
  searchBar: {
    flex: 1,
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
  sortButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME_COLOR,
    backgroundColor: `${THEME_COLOR}20`,
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    paddingVertical: 16,
    backgroundColor: "transparent",
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
  itemsSection: {
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
  sectionTitle: {
    fontSize: 18,
  },
  itemCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  itemsList: {
    flexDirection: "column",
  },
  itemContainer: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  itemContainerList: {
    width: "100%",
  },
  itemCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    padding: 12,
  },
  itemCardList: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  itemEmoji: {
    fontSize: 32,
  },
  expirationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  expirationText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  itemInfo: {
    backgroundColor: "transparent",
  },
  itemName: {
    fontSize: 14,
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  itemDetails: {
    backgroundColor: "transparent",
  },
  itemDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  itemDetailText: {
    fontSize: 12,
    marginLeft: 6,
    opacity: 0.7,
  },
  itemNotes: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
    fontStyle: "italic",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${THEME_COLOR}20`,
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    backgroundColor: "#ffffff", // For light mode
  },
  scanModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "60%",
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
  categoryPicker: {
    marginTop: 8,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  categoryOptionText: {
    fontSize: 12,
    marginLeft: 6,
  },
  locationPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "transparent",
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    flex: 1,
    minWidth: "45%",
  },
  locationOptionText: {
    fontSize: 12,
    marginLeft: 6,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    marginLeft: 8,
  },
  notesInput: {
    height: 80,
    textAlignVertical: "top",
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
  scanArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "transparent",
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: THEME_COLOR,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
  },
  scanText: {
    textAlign: "center",
    marginTop: 16,
    opacity: 0.7,
  },
});
