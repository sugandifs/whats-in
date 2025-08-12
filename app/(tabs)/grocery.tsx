import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  emoji: string;
  isCompleted: boolean;
  addedDate: Date;
  notes?: string;
}

interface QuickAddItem {
  name: string;
  emoji: string;
  category: string;
  unit: string;
}

export default function GroceryListPage() {
  const router = useRouter();
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([
    {
      id: "1",
      name: "Milk",
      quantity: 1,
      unit: "gallon",
      category: "dairy",
      emoji: "🥛",
      isCompleted: false,
      addedDate: new Date(),
    },
    {
      id: "2",
      name: "Bananas",
      quantity: 6,
      unit: "piece",
      category: "fresh",
      emoji: "🍌",
      isCompleted: true,
      addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Bread",
      quantity: 1,
      unit: "loaf",
      category: "bakery",
      emoji: "🍞",
      isCompleted: false,
      addedDate: new Date(),
    },
    {
      id: "4",
      name: "Chicken Breast",
      quantity: 2,
      unit: "lb",
      category: "meat",
      emoji: "🍗",
      isCompleted: false,
      addedDate: new Date(),
    },
    {
      id: "5",
      name: "Apples",
      quantity: 5,
      unit: "piece",
      category: "fresh",
      emoji: "🍎",
      isCompleted: true,
      addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const colorScheme = useColorScheme();

  // Form state for adding new items
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    unit: "piece",
    category: "fresh",
    emoji: "🛒",
    notes: "",
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
  ];

  const categories = [
    {
      id: "fresh",
      name: "Fresh Produce",
      emoji: "🥬",
      color: "#22c55e",
    },
    { id: "dairy", name: "Dairy", emoji: "🥛", color: "#3b82f6" },
    { id: "meat", name: "Meat & Fish", emoji: "🍗", color: "#ef4444" },
    { id: "pantry", name: "Pantry", emoji: "🥫", color: "#8b5cf6" },
    { id: "bakery", name: "Bakery", emoji: "🍞", color: "#f59e0b" },
    { id: "frozen", name: "Frozen", emoji: "🧊", color: "#06b6d4" },
    { id: "snacks", name: "Snacks", emoji: "🍿", color: "#f97316" },
    { id: "other", name: "Other", emoji: "🛒", color: "#6b7280" },
  ];

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

  const toggleItem = (id: string) => {
    setGroceryList(
      groceryList.map((item) =>
        item.id === id
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            setGroceryList(
              groceryList.filter((item) => item.id !== id)
            ),
        },
      ]
    );
  };

  const addNewItem = () => {
    if (!newItem.name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    const item: GroceryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      category: newItem.category,
      emoji: newItem.emoji,
      isCompleted: false,
      addedDate: new Date(),
      notes: newItem.notes,
    };

    setGroceryList([...groceryList, item]);
    setNewItem({
      name: "",
      quantity: 1,
      unit: "piece",
      category: "fresh",
      emoji: "🛒",
      notes: "",
    });
    setAddItemModalVisible(false);
  };

  const quickAddItem = (quickItem: QuickAddItem) => {
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

    const item: GroceryItem = {
      id: Date.now().toString(),
      name: quickItem.name,
      quantity: 1,
      unit: quickItem.unit,
      category: quickItem.category,
      emoji: quickItem.emoji,
      isCompleted: false,
      addedDate: new Date(),
    };

    setGroceryList([...groceryList, item]);
  };

  const clearCompleted = () => {
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
          onPress: () =>
            setGroceryList(
              groceryList.filter((item) => !item.isCompleted)
            ),
        },
      ]
    );
  };

  const renderGroceryItem = (item: GroceryItem) => (
    <ThemedView
      key={item.id}
      style={[
        styles.groceryItem,
        item.isCompleted && styles.completedItem,
      ]}
    >
      <TouchableOpacity
        style={styles.itemLeft}
        onPress={() => toggleItem(item.id)}
      >
        <ThemedView
          style={[
            styles.checkbox,
            item.isCompleted && styles.checkedCheckbox,
          ]}
        >
          {item.isCompleted && (
            <Ionicons
              name={"checkmark" as IoniconsName}
              size={16}
              color="white"
            />
          )}
        </ThemedView>

        <ThemedText style={styles.itemEmoji}>{item.emoji}</ThemedText>

        <ThemedView style={styles.itemInfo}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.itemName,
              item.isCompleted && styles.completedText,
            ]}
          >
            {item.name}
          </ThemedText>
          <ThemedText
            type="default"
            style={[
              styles.itemQuantity,
              item.isCompleted && styles.completedText,
            ]}
          >
            {item.quantity} {item.unit}
          </ThemedText>
          {item.notes && (
            <ThemedText
              type="default"
              style={[
                styles.itemNotes,
                item.isCompleted && styles.completedText,
              ]}
            >
              {item.notes}
            </ThemedText>
          )}
        </ThemedView>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Ionicons
          name={"trash-outline" as IoniconsName}
          size={18}
          color="#ef4444"
        />
      </TouchableOpacity>
    </ThemedView>
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
              Grocery List
            </ThemedText>
            <ThemedText type="default" style={styles.headerSubtitle}>
              {pendingItems.length} item
              {pendingItems.length !== 1 ? "s" : ""} to buy
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={clearCompleted}
        >
          <Ionicons
            name={"trash" as IoniconsName}
            size={20}
            color="#ef4444"
          />
        </TouchableOpacity>
      </ThemedView>

      {/* Stats */}
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statCard}>
          <ThemedText type="default" style={styles.statNumber}>
            {pendingItems.length}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Pending
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard}>
          <ThemedText
            type="default"
            style={[styles.statNumber, { color: "#10b981" }]}
          >
            {completedItems.length}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Completed
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard}>
          <ThemedText type="default" style={styles.statNumber}>
            {groceryList.length}
          </ThemedText>
          <ThemedText type="default" style={styles.statLabel}>
            Total
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
            size={18}
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
            placeholder="Search items..."
            placeholderTextColor={
              colorScheme === "dark" ? "#888" : "#999"
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.filterButton,
            showCompleted && styles.activeFilter,
          ]}
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <Ionicons
            name={"eye" as IoniconsName}
            size={18}
            color={showCompleted ? "white" : THEME_COLOR}
          />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Add */}
        <ThemedView style={styles.quickAddSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Add
          </ThemedText>
          <ThemedView style={styles.quickAddGrid}>
            {quickAddItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickAddItem}
                onPress={() => quickAddItem(item)}
              >
                <ThemedText style={styles.quickAddEmoji}>
                  {item.emoji}
                </ThemedText>
                <ThemedText type="default" style={styles.quickAddName}>
                  {item.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Grocery Items */}
        <ThemedView style={styles.itemsSection}>
          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <ThemedView style={styles.itemsGroup}>
              <ThemedText type="subtitle" style={styles.groupTitle}>
                To Buy ({pendingItems.length})
              </ThemedText>
              {pendingItems.map(renderGroceryItem)}
            </ThemedView>
          )}

          {/* Completed Items */}
          {showCompleted && completedItems.length > 0 && (
            <ThemedView style={styles.itemsGroup}>
              <ThemedText
                type="subtitle"
                style={[styles.groupTitle, styles.completedGroupTitle]}
              >
                Completed ({completedItems.length})
              </ThemedText>
              {completedItems.map(renderGroceryItem)}
            </ThemedView>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <ThemedView style={styles.emptyState}>
              <Ionicons
                name={"cart-outline" as IoniconsName}
                size={64}
                color={colorScheme === "dark" ? "#666" : "#ccc"}
              />
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                {searchQuery ? "No items found" : "Your list is empty"}
              </ThemedText>
              <ThemedText type="default" style={styles.emptySubtitle}>
                {searchQuery
                  ? "Try a different search term"
                  : "Add items to get started"}
              </ThemedText>
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
          <ThemedView style={styles.modalContent}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Add Item
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
                  placeholder="e.g., Organic Milk"
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
                  {categories.map((category) => (
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
                      <ThemedText style={styles.categoryEmoji}>
                        {category.emoji}
                      </ThemedText>
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
                  placeholder="e.g., Brand preference, size, etc."
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
                  Add to List
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
  statNumber: {
    fontSize: 18,
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
  searchContainer: {
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
  filterButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME_COLOR,
    backgroundColor: "transparent",
  },
  activeFilter: {
    backgroundColor: THEME_COLOR,
  },
  content: {
    flex: 1,
  },
  quickAddSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  quickAddGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  quickAddItem: {
    width: "23%",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "rgba(128, 128, 128, 0.05)",
  },
  quickAddEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickAddName: {
    fontSize: 10,
    textAlign: "center",
  },
  itemsSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    backgroundColor: "transparent",
  },
  itemsGroup: {
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  groupTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  completedGroupTitle: {
    opacity: 0.7,
  },
  groceryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  completedItem: {
    opacity: 0.6,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(128, 128, 128, 0.3)",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCheckbox: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  itemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    backgroundColor: "transparent",
  },
  itemName: {
    fontSize: 16,
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    opacity: 0.7,
  },
  itemNotes: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
    fontStyle: "italic",
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "transparent",
  },
  emptyTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    backgroundColor: "#ffffff",
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
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryOptionText: {
    fontSize: 12,
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
});
