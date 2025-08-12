import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

export default function PantryPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "expiration" | "category"
  >("expiration");
  const colorScheme = useColorScheme();

  // Form state for adding new items
  const [newItem, setNewItem] = useState({
    name: "",
    category: "fresh",
    quantity: 1,
    unit: "piece",
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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
      count: 47,
    },
    {
      id: "fresh",
      name: "Fresh",
      icon: "leaf",
      color: "#22c55e",
      count: 12,
    },
    {
      id: "dairy",
      name: "Dairy",
      icon: "water",
      color: "#3b82f6",
      count: 8,
    },
    {
      id: "meat",
      name: "Meat & Fish",
      icon: "fish",
      color: "#ef4444",
      count: 6,
    },
    {
      id: "pantry",
      name: "Pantry",
      icon: "archive",
      color: "#8b5cf6",
      count: 15,
    },
    {
      id: "frozen",
      name: "Frozen",
      icon: "snow",
      color: "#06b6d4",
      count: 6,
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

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    {
      id: "1",
      name: "Spinach",
      category: "fresh",
      quantity: 1,
      unit: "package",
      expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
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
      expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
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
      expirationDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      location: "fridge",
      emoji: "🥛",
    },
    {
      id: "4",
      name: "Chicken Breast",
      category: "meat",
      quantity: 2,
      unit: "lb",
      expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      location: "fridge",
      emoji: "🍗",
    },
    {
      id: "5",
      name: "Pasta",
      category: "pantry",
      quantity: 2,
      unit: "package",
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      location: "pantry",
      emoji: "🍝",
    },
    {
      id: "6",
      name: "Frozen Berries",
      category: "frozen",
      quantity: 1,
      unit: "package",
      expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      location: "freezer",
      emoji: "🫐",
    },
  ]);

  const getDaysUntilExpiration = (expirationDate: Date) => {
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpirationStatus = (expirationDate: Date) => {
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

  const filteredItems = pantryItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "expiration":
        return a.expirationDate.getTime() - b.expirationDate.getTime();
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const addNewItem = () => {
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
          onPress: () =>
            setPantryItems(
              pantryItems.filter((item) => item.id !== id)
            ),
        },
      ]
    );
  };

  const renderItemCard = ({ item }: { item: PantryItem }) => {
    const expiration = getExpirationStatus(item.expirationDate);
    const location = locations.find((loc) => loc.id === item.location);

    return (
      <TouchableOpacity
        style={[
          styles.itemCard,
          activeView === "list" && styles.itemCardList,
        ]}
        onLongPress={() => removeItem(item.id)}
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
          <ThemedText type="default" style={styles.itemQuantity}>
            {item.quantity} {item.unit}
          </ThemedText>

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
                {item.expirationDate.toLocaleDateString()}
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

  const expiringItems = pantryItems.filter(
    (item) => getDaysUntilExpiration(item.expirationDate) <= 3
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
            {pantryItems.length}
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

        <TouchableOpacity style={styles.sortButton}>
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
              {sortedItems.length} items
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.itemsGrid,
              activeView === "list" && styles.itemsList,
            ]}
          >
            {sortedItems.map((item) => (
              <ThemedView
                key={item.id}
                style={[
                  styles.itemContainer,
                  activeView === "list" && styles.itemContainerList,
                ]}
              >
                {renderItemCard({ item })}
              </ThemedView>
            ))}
          </ThemedView>
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
          <ThemedView style={styles.modalContent}>
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
                            category: category.id,
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
                          location: location.id,
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

      {/* Scan Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={scanModalVisible}
        onRequestClose={() => setScanModalVisible(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.scanModalContent}>
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
