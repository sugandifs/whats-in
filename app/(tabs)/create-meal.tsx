import { FormInput } from "@/components/forms/FormInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActionButton } from "@/components/ui/ActionButton";
import { CategorySelector } from "@/components/ui/CategorySelector";
import { Header } from "@/components/ui/Header";
import { KeyboardAvoidingContainer } from "@/components/ui/KeyboardAvoidingContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import ApiService from "@/services/api";
import { CreateMealData } from "@/services/types";
import { styles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const MEAL_EMOJIS = [
  "🍳",
  "🥐",
  "🥞",
  "🧇",
  "🥓",
  "🍗",
  "🥗",
  "🍝",
  "🍕",
  "🍔",
  "🌮",
  "🍜",
  "🍲",
  "🥘",
  "🍛",
  "🍣",
  "🥙",
  "🌯",
  "🥪",
  "🍖",
  "🍤",
  "🦞",
  "🐟",
  "🥩",
  "🥚",
  "🧀",
  "🥖",
  "🍯",
  "🥤",
  "🍰",
];

const DIFFICULTY_OPTIONS = [
  { id: "Easy", name: "Easy", color: "#10b981" },
  { id: "Medium", name: "Medium", color: "#f59e0b" },
  { id: "Hard", name: "Hard", color: "#ef4444" },
];

const MEAL_TYPE_OPTIONS = [
  {
    id: "breakfast",
    name: "Breakfast",
    icon: "sunny",
    color: "#f59e0b",
  },
  {
    id: "lunch",
    name: "Lunch",
    icon: "partly-sunny",
    color: "#10b981",
  },
  { id: "dinner", name: "Dinner", icon: "moon", color: "#8b5cf6" },
  { id: "snack", name: "Snack", icon: "star", color: "#f97316" },
];

const CUISINE_OPTIONS = [
  "Italian",
  "Mexican",
  "Asian",
  "American",
  "Mediterranean",
  "Indian",
  "Thai",
  "French",
  "Japanese",
  "Chinese",
  "Greek",
  "Other",
];

interface FormData extends Omit<CreateMealData, "userId"> {
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export default function CreateMealPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { themedColors, theme } = useThemedStyles();

  const [loading, setLoading] = useState(false);
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [currentTag, setCurrentTag] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "dinner",
    difficulty: "Medium",
    prepTime: "",
    servings: 4,
    ingredients: [],
    instructions: [],
    tags: [],
    emoji: "🍽️",
    notes: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Meal name is required";
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    if (formData.instructions.length === 0) {
      newErrors.instructions = "At least one instruction is required";
    }

    if (!formData.prepTime?.trim()) {
      newErrors.prepTime = "Prep time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields"
      );
      return;
    }

    try {
      setLoading(true);

      const mealData: CreateMealData = {
        ...formData,
        userId: currentUser?.uid || "",
      };

      const newMeal = await ApiService.createMeal(mealData);

      Alert.alert("Success", "Meal created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Failed to create meal:", error);
      Alert.alert("Error", "Failed to create meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()],
      }));
      setCurrentIngredient("");
      setErrors((prev) => ({ ...prev, ingredients: undefined }));
    }
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addInstruction = () => {
    if (currentInstruction.trim()) {
      setFormData((prev) => ({
        ...prev,
        instructions: [...prev.instructions, currentInstruction.trim()],
      }));
      setCurrentInstruction("");
      setErrors((prev) => ({ ...prev, instructions: undefined }));
    }
  };

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (
      currentTag.trim() &&
      !formData.tags.includes(currentTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return <LoadingSpinner message="Creating meal..." />;
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

      <Header
        title="Create Meal"
        subtitle="Add a new meal to your collection"
        rightActions={
          <ActionButton
            title="Save"
            onPress={handleSave}
            disabled={loading}
            style={{ paddingHorizontal: 16 }}
          />
        }
      />

      <KeyboardAvoidingContainer>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <ThemedView style={{ padding: theme.spacing.lg }}>
            {/* Basic Information */}
            <ThemedView style={localStyles.section}>
              <ThemedText
                type="subtitle"
                style={localStyles.sectionTitle}
              >
                Basic Information
              </ThemedText>

              {/* Emoji Selector */}
              <ThemedView style={localStyles.emojiSection}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.formLabel}
                >
                  Emoji
                </ThemedText>
                <TouchableOpacity
                  style={[
                    localStyles.emojiButton,
                    {
                      backgroundColor: themedColors.backgroundSecondary,
                      borderColor: themedColors.border,
                    },
                  ]}
                  onPress={() => setEmojiModalVisible(true)}
                >
                  <ThemedText style={localStyles.selectedEmoji}>
                    {formData.emoji}
                  </ThemedText>
                  <ThemedText style={localStyles.emojiButtonText}>
                    Tap to change
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>

              <FormInput
                label="Meal Name *"
                placeholder="e.g., Chicken Teriyaki Bowl"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, name: text }));
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={errors.name}
              />
            </ThemedView>

            {/* Meal Type */}
            <ThemedView style={localStyles.section}>
              <ThemedText
                type="subtitle"
                style={localStyles.sectionTitle}
              >
                Meal Type
              </ThemedText>
              <CategorySelector
                categories={MEAL_TYPE_OPTIONS.map((type) => ({
                  ...type,
                  count: 0,
                }))}
                selectedCategory={formData.type}
                onSelectCategory={(type) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: type as any,
                  }))
                }
              />
            </ThemedView>

            {/* Details */}
            <ThemedView style={localStyles.section}>
              <ThemedText
                type="subtitle"
                style={localStyles.sectionTitle}
              >
                Details
              </ThemedText>

              <ThemedView style={styles.row}>
                <FormInput
                  label="Prep Time *"
                  placeholder="15 min"
                  value={formData.prepTime}
                  onChangeText={(text) => {
                    setFormData((prev) => ({
                      ...prev,
                      prepTime: text,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      prepTime: undefined,
                    }));
                  }}
                  containerStyle={{
                    flex: 1,
                    marginRight: theme.spacing.sm,
                  }}
                  error={errors.prepTime}
                />
              </ThemedView>

              <ThemedView style={styles.row}>
                <FormInput
                  label="Servings"
                  placeholder="4"
                  value={formData.servings?.toString()}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      servings: parseInt(text) || 1,
                    }))
                  }
                  keyboardType="numeric"
                  containerStyle={{
                    flex: 1,
                    marginRight: theme.spacing.sm,
                  }}
                />
              </ThemedView>

              {/* Difficulty */}
              <ThemedView style={localStyles.difficultySection}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.formLabel}
                >
                  Difficulty
                </ThemedText>
                <ThemedView style={localStyles.difficultyButtons}>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        localStyles.difficultyButton,
                        {
                          borderColor: option.color,
                          backgroundColor:
                            formData.difficulty === option.id
                              ? option.color
                              : themedColors.backgroundSecondary,
                        },
                      ]}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: option.id as any,
                        }))
                      }
                    >
                      <ThemedText
                        style={[
                          localStyles.difficultyButtonText,
                          {
                            color:
                              formData.difficulty === option.id
                                ? "white"
                                : option.color,
                          },
                        ]}
                      >
                        {option.name}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {/* Ingredients */}
            <ThemedView style={localStyles.section}>
              <ThemedText
                type="subtitle"
                style={localStyles.sectionTitle}
              >
                Ingredients *
              </ThemedText>

              <ThemedView style={localStyles.addItemSection}>
                <FormInput
                  label=""
                  placeholder="Enter ingredient..."
                  value={currentIngredient}
                  onChangeText={setCurrentIngredient}
                  containerStyle={{
                    flex: 1,
                    marginRight: theme.spacing.sm,
                  }}
                />
                <ActionButton
                  title="Add"
                  onPress={addIngredient}
                  disabled={!currentIngredient.trim()}
                  style={{ paddingHorizontal: 16 }}
                />
              </ThemedView>

              {errors.ingredients && (
                <ThemedText style={localStyles.errorText}>
                  {errors.ingredients}
                </ThemedText>
              )}

              <ThemedView style={localStyles.itemsList}>
                {formData.ingredients.map((ingredient, index) => (
                  <ThemedView
                    key={index}
                    style={[
                      localStyles.listItem,
                      {
                        backgroundColor:
                          themedColors.backgroundSecondary,
                        borderColor: themedColors.border,
                      },
                    ]}
                  >
                    <ThemedView style={localStyles.itemBullet} />
                    <ThemedText style={localStyles.itemText}>
                      {ingredient}
                    </ThemedText>
                    <TouchableOpacity
                      onPress={() => removeIngredient(index)}
                      style={localStyles.removeButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={themedColors.error}
                      />
                    </TouchableOpacity>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>

            {/* Instructions */}
            <ThemedView style={localStyles.section}>
              <ThemedText
                type="subtitle"
                style={localStyles.sectionTitle}
              >
                Instructions *
              </ThemedText>

              <ThemedView style={localStyles.addItemSection}>
                <FormInput
                  label=""
                  placeholder="Enter cooking step..."
                  value={currentInstruction}
                  onChangeText={setCurrentInstruction}
                  multiline
                  style={{ height: 60 }}
                  containerStyle={{
                    flex: 1,
                    marginRight: theme.spacing.sm,
                  }}
                />
                <ActionButton
                  title="Add"
                  onPress={addInstruction}
                  disabled={!currentInstruction.trim()}
                  style={{
                    paddingHorizontal: 16,
                    alignSelf: "flex-end",
                  }}
                />
              </ThemedView>

              {errors.instructions && (
                <ThemedText style={localStyles.errorText}>
                  {errors.instructions}
                </ThemedText>
              )}

              <ThemedView style={localStyles.itemsList}>
                {formData.instructions.map((instruction, index) => (
                  <ThemedView
                    key={index}
                    style={[
                      localStyles.listItem,
                      {
                        backgroundColor:
                          themedColors.backgroundSecondary,
                        borderColor: themedColors.border,
                      },
                    ]}
                  >
                    <ThemedView
                      style={[
                        localStyles.stepNumber,
                        { backgroundColor: themedColors.primary },
                      ]}
                    >
                      <ThemedText style={localStyles.stepText}>
                        {index + 1}
                      </ThemedText>
                    </ThemedView>
                    <ThemedText style={localStyles.itemText}>
                      {instruction}
                    </ThemedText>
                    <TouchableOpacity
                      onPress={() => removeInstruction(index)}
                      style={localStyles.removeButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={themedColors.error}
                      />
                    </TouchableOpacity>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>

            {/* Tags */}
            <ThemedView style={localStyles.section}>
              <ThemedText
                type="subtitle"
                style={localStyles.sectionTitle}
              >
                Tags (Optional)
              </ThemedText>

              <ThemedView style={localStyles.addItemSection}>
                <FormInput
                  label=""
                  placeholder="Enter tag..."
                  value={currentTag}
                  onChangeText={setCurrentTag}
                  containerStyle={{
                    flex: 1,
                    marginRight: theme.spacing.sm,
                  }}
                />
                <ActionButton
                  title="Add"
                  onPress={addTag}
                  disabled={!currentTag.trim()}
                  style={{ paddingHorizontal: 16 }}
                />
              </ThemedView>

              <ThemedView style={localStyles.tagsContainer}>
                {formData.tags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      localStyles.tag,
                      {
                        backgroundColor: `${themedColors.primary}15`,
                        borderColor: `${themedColors.primary}30`,
                      },
                    ]}
                    onPress={() => removeTag(index)}
                  >
                    <ThemedText
                      style={[
                        localStyles.tagText,
                        { color: themedColors.primary },
                      ]}
                    >
                      #{tag}
                    </ThemedText>
                    <Ionicons
                      name="close"
                      size={14}
                      color={themedColors.primary}
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ThemedView>

            {/* Notes */}
            <ThemedView style={localStyles.section}>
              <FormInput
                label="Additional Notes (Optional)"
                placeholder="Any additional notes or tips..."
                value={formData.notes}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, notes: text }))
                }
                multiline
                style={{ height: 80 }}
              />
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingContainer>

      {/* Emoji Selection Modal */}
      <Modal
        visible={emojiModalVisible}
        onClose={() => setEmojiModalVisible(false)}
        title="Choose Emoji"
        size="medium"
      >
        <ThemedView style={localStyles.emojiGrid}>
          {MEAL_EMOJIS.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={[
                localStyles.emojiOption,
                {
                  backgroundColor:
                    formData.emoji === emoji
                      ? themedColors.primary
                      : themedColors.backgroundTertiary,
                },
              ]}
              onPress={() => {
                setFormData((prev) => ({ ...prev, emoji }));
                setEmojiModalVisible(false);
              }}
            >
              <ThemedText style={localStyles.emojiOptionText}>
                {emoji}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </Modal>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  emojiSection: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  emojiButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  emojiButtonText: {
    opacity: 0.7,
  },
  difficultySection: {
    marginTop: 16,
    backgroundColor: "transparent",
  },
  difficultyButtons: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "transparent",
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addItemSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  itemsList: {
    backgroundColor: "transparent",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  itemBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFB902",
    marginRight: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  removeButton: {
    padding: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "transparent",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    padding: 8,
    backgroundColor: "transparent",
  },
  emojiOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiOptionText: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginBottom: 8,
  },
});
