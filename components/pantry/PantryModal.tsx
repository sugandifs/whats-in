import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActionButton } from "@/components/ui/ActionButton";
import { Modal } from "@/components/ui/Modal";
import { pantryPageStyles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
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
}

interface Location {
  id: string;
  name: string;
  icon: string;
}

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

interface PantryModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: NewItem) => void;
  loading?: boolean;
  newItem: NewItem;
  setNewItem: (item: NewItem) => void;
}

export default function PantryModal({
  visible,
  onClose,
  onAddItem,
  loading = false,
  newItem,
  setNewItem,
}: PantryModalProps) {
  const colorScheme = useColorScheme();

  const [showUnitPicker, setShowUnitPicker] = useState(false);

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

  const locations: Location[] = [
    { id: "fridge", name: "Refrigerator", icon: "snow" },
    { id: "freezer", name: "Freezer", icon: "cube" },
    { id: "pantry", name: "Pantry", icon: "archive" },
    { id: "counter", name: "Counter", icon: "home" },
  ];

  const categories: PantryCategory[] = [
    { id: "fresh", name: "Fresh", icon: "leaf", color: "#22c55e" },
    { id: "dairy", name: "Dairy", icon: "water", color: "#3b82f6" },
    { id: "meat", name: "Meat & Fish", icon: "fish", color: "#ef4444" },
    { id: "pantry", name: "Pantry", icon: "archive", color: "#8b5cf6" },
    { id: "frozen", name: "Frozen", icon: "snow", color: "#06b6d4" },
  ];

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    onAddItem(newItem);
  };

  return (
    <>
      <Modal
        visible={visible}
        onClose={onClose}
        title="Add New Item"
        size="large"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Item Name */}
          <ThemedView style={pantryPageStyles.formGroup}>
            <ThemedText
              type="defaultSemiBold"
              style={pantryPageStyles.formLabel}
            >
              Item Name
            </ThemedText>
            <TextInput
              style={[
                pantryPageStyles.formInput,
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
          <ThemedView style={pantryPageStyles.formRow}>
            <ThemedView
              style={[
                pantryPageStyles.formGroup,
                { flex: 1, marginRight: 8 },
              ]}
            >
              <ThemedText
                type="defaultSemiBold"
                style={pantryPageStyles.formLabel}
              >
                Quantity
              </ThemedText>
              <TextInput
                style={[
                  pantryPageStyles.formInput,
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

            {/* Unit Dropdown */}
            <ThemedView
              style={[
                pantryPageStyles.formGroup,
                { flex: 1, marginLeft: 8 },
              ]}
            >
              <ThemedText
                type="defaultSemiBold"
                style={pantryPageStyles.formLabel}
              >
                Unit
              </ThemedText>
              <TouchableOpacity
                style={[
                  pantryPageStyles.formInput,
                  pantryPageStyles.pickerButton,
                  {
                    borderColor:
                      colorScheme === "dark" ? "#444" : "#e5e7eb",
                    backgroundColor:
                      colorScheme === "dark" ? "#333" : "#fff",
                  },
                ]}
                onPress={() => setShowUnitPicker(!showUnitPicker)}
              >
                <ThemedText
                  type="default"
                  style={pantryPageStyles.pickerText}
                >
                  {newItem.unit}
                </ThemedText>
                <Ionicons
                  name={showUnitPicker ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colorScheme === "dark" ? "#fff" : "#666"}
                />
              </TouchableOpacity>

              {/* Unit Dropdown List */}
              {showUnitPicker && (
                <ThemedView
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 8,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor:
                      colorScheme === "dark" ? "#333" : "#fff",
                    borderWidth: 1,
                    borderColor:
                      colorScheme === "dark" ? "#444" : "#e5e7eb",
                    borderRadius: 8,
                    maxHeight: 200,
                  }}
                >
                  <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  >
                    {units.map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        style={{
                          padding: 12,
                          borderBottomWidth: 1,
                          borderBottomColor:
                            colorScheme === "dark" ? "#444" : "#f3f4f6",
                        }}
                        onPress={() => {
                          setNewItem({ ...newItem, unit });
                          setShowUnitPicker(false);
                        }}
                      >
                        <ThemedText
                          style={{
                            color:
                              newItem.unit === unit
                                ? THEME_COLOR
                                : undefined,
                            fontWeight:
                              newItem.unit === unit ? "600" : "normal",
                          }}
                        >
                          {unit}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </ThemedView>
              )}
            </ThemedView>
          </ThemedView>

          {/* Category */}
          <ThemedView style={pantryPageStyles.formGroup}>
            <ThemedText
              type="defaultSemiBold"
              style={pantryPageStyles.formLabel}
            >
              Category
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={pantryPageStyles.categoryPicker}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    pantryPageStyles.categoryOption,
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
                      pantryPageStyles.categoryOptionText,
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
          <ThemedView style={pantryPageStyles.formGroup}>
            <ThemedText
              type="defaultSemiBold"
              style={pantryPageStyles.formLabel}
            >
              Storage Location
            </ThemedText>
            <ThemedView style={pantryPageStyles.locationPicker}>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  style={[
                    pantryPageStyles.locationOption,
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
                      pantryPageStyles.locationOptionText,
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

          {/* Notes */}
          <ThemedView style={pantryPageStyles.formGroup}>
            <ThemedText
              type="defaultSemiBold"
              style={pantryPageStyles.formLabel}
            >
              Notes (Optional)
            </ThemedText>
            <TextInput
              style={[
                pantryPageStyles.formInput,
                pantryPageStyles.notesInput,
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
          <ThemedView style={{ marginTop: 20, paddingHorizontal: 0 }}>
            <ActionButton
              title="Add to Pantry"
              icon="add"
              onPress={handleAddItem}
              disabled={!newItem.name.trim() || loading}
              loading={loading}
            />
          </ThemedView>
        </ScrollView>
      </Modal>
    </>
  );
}
