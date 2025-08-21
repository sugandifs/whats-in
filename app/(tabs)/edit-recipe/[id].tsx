import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import { FormInput } from "@/components/forms/FormInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActionButton } from "@/components/ui/ActionButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Header } from "@/components/ui/Header";
import { KeyboardAvoidingContainer } from "@/components/ui/KeyboardAvoidingContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";

import { useAuth } from "@/context/AuthContext";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import ApiService from "@/services/api";
import { styles } from "@/styles";

type DifficultyLevel = "Easy" | "Medium" | "Hard";

interface EditableRecipe {
  name: string;
  description: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: DifficultyLevel;
  cuisine: string;
  tags: string[];
  notes?: string;
}

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { themedColors, theme } = useThemedStyles();
  const { getResponsivePadding } = useResponsiveStyles();

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipe, setRecipe] = useState<EditableRecipe>({
    name: "",
    description: "",
    image: "🍽️",
    ingredients: [""],
    instructions: [""],
    prepTime: "",
    cookTime: "",
    servings: "4",
    difficulty: "Medium",
    cuisine: "",
    tags: [],
    notes: "",
  });

  // Modal states
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [discardDialogVisible, setDiscardDialogVisible] =
    useState(false);

  // Form states
  const [newTag, setNewTag] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const popularEmojis = [
    "🍽️",
    "🍕",
    "🍔",
    "🍝",
    "🍛",
    "🍜",
    "🍲",
    "🥘",
    "🍳",
    "🥞",
    "🧇",
    "🥗",
    "🍰",
    "🧁",
    "🍪",
    "🥧",
    "🍎",
    "🥑",
    "🥕",
    "🌶️",
    "🥦",
    "🍄",
    "🧄",
    "🧅",
  ];

  const difficultyOptions: DifficultyLevel[] = [
    "Easy",
    "Medium",
    "Hard",
  ];
  const cuisineOptions = [
    "Italian",
    "Mexican",
    "Asian",
    "American",
    "French",
    "Indian",
    "Mediterranean",
    "Thai",
    "Chinese",
    "Japanese",
    "Other",
  ];

  // Load recipe data
  const loadRecipe = async () => {
    if (!id) {
      Alert.alert("Error", "Recipe ID not found");
      router.back();
      return;
    }

    try {
      setLoading(true);
      const recipeData = await ApiService.getRecipe(id);

      // Check if user owns this recipe
      if (!recipeData.isOwned) {
        Alert.alert(
          "Permission Denied",
          "You can only edit recipes that you created.",
          [{ text: "OK", onPress: () => router.back() }]
        );
        return;
      }

      setRecipe({
        name: recipeData.name || "",
        description: recipeData.description || "",
        image: recipeData.image || "🍽️",
        ingredients: recipeData.ingredients?.length
          ? recipeData.ingredients
          : [""],
        instructions: recipeData.instructions?.length
          ? recipeData.instructions
          : [""],
        prepTime: recipeData.prepTime || "",
        cookTime: recipeData.cookTime || "",
        servings: String(recipeData.servings) || "4",
        difficulty:
          (recipeData.difficulty as DifficultyLevel) || "Medium",
        cuisine: recipeData.cuisine || "",
        tags: recipeData.tags || [],
      });
    } catch (error) {
      console.error("Failed to load recipe:", error);
      Alert.alert("Error", "Failed to load recipe. Please try again.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && id) {
      loadRecipe();
    }
  }, [currentUser, id]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!recipe.name.trim()) {
      newErrors.name = "Recipe name is required";
    }

    if (!recipe.description.trim()) {
      newErrors.description = "Description is required";
    }

    const validIngredients = recipe.ingredients.filter((ing) =>
      ing.trim()
    );
    if (validIngredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    const validInstructions = recipe.instructions.filter((inst) =>
      inst.trim()
    );
    if (validInstructions.length === 0) {
      newErrors.instructions =
        "At least one instruction step is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save recipe
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields"
      );
      return;
    }

    try {
      setSaving(true);

      const updatedRecipe = {
        ...recipe,
        ingredients: recipe.ingredients.filter((ing) => ing.trim()),
        instructions: recipe.instructions.filter((inst) => inst.trim()),
      };

      await ApiService.updateRecipe(id!, updatedRecipe);

      Alert.alert("Success", "Recipe updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            loadRecipe();
            router.back();
          },
        },
      ]);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save recipe:", error);
      Alert.alert("Error", "Failed to save recipe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle back button
  const handleBackPress = () => {
    if (hasChanges) {
      setDiscardDialogVisible(true);
    } else {
      router.back();
    }
  };

  // Update recipe field
  const updateRecipe = (field: keyof EditableRecipe, value: any) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Add/remove ingredients
  const addIngredient = () => {
    updateRecipe("ingredients", [...recipe.ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = recipe.ingredients.filter(
      (_, i) => i !== index
    );
    updateRecipe(
      "ingredients",
      newIngredients.length ? newIngredients : [""]
    );
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    updateRecipe("ingredients", newIngredients);
  };

  // Add/remove instructions
  const addInstruction = () => {
    updateRecipe("instructions", [...recipe.instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    const newInstructions = recipe.instructions.filter(
      (_, i) => i !== index
    );
    updateRecipe(
      "instructions",
      newInstructions.length ? newInstructions : [""]
    );
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    updateRecipe("instructions", newInstructions);
  };

  // Tag management
  const addTag = () => {
    if (
      newTag.trim() &&
      !recipe.tags.includes(newTag.trim().toLowerCase())
    ) {
      updateRecipe("tags", [
        ...recipe.tags,
        newTag.trim().toLowerCase(),
      ]);
      setNewTag("");
      setTagModalVisible(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateRecipe(
      "tags",
      recipe.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading recipe..." />;
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
        title="Edit Recipe"
        subtitle="Make your recipe even better"
        onBackPress={handleBackPress}
      />

      <KeyboardAvoidingContainer>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            paddingHorizontal: getResponsivePadding(),
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Basic Information */}
          <ThemedView
            style={[styles.section, { paddingHorizontal: 0 }]}
          >
            <ThemedText
              type="subtitle"
              style={{ marginBottom: theme.spacing.lg }}
            >
              Basic Information
            </ThemedText>

            <FormInput
              label="Recipe Name *"
              placeholder="Enter recipe name"
              value={recipe.name}
              onChangeText={(text) => updateRecipe("name", text)}
              error={errors.name}
            />

            <FormInput
              label="Description *"
              placeholder="Describe your recipe"
              value={recipe.description}
              onChangeText={(text) => updateRecipe("description", text)}
              multiline
              style={{ height: 80 }}
              error={errors.description}
            />

            {/* Emoji Selection */}
            <ThemedView style={styles.formGroup}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.formLabel}
              >
                Recipe Image
              </ThemedText>
              <TouchableOpacity
                style={[
                  styles.formInput,
                  {
                    backgroundColor: themedColors.backgroundTertiary,
                    borderColor: themedColors.border,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 60,
                  },
                ]}
                onPress={() => setEmojiModalVisible(true)}
              >
                <ThemedText style={{ fontSize: 32 }}>
                  {recipe.image}
                </ThemedText>
                <ThemedText
                  style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}
                >
                  Tap to change
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {/* Recipe Details */}
          <ThemedView
            style={[styles.section, { paddingHorizontal: 0 }]}
          >
            <ThemedText
              type="subtitle"
              style={{ marginBottom: theme.spacing.lg }}
            >
              Recipe Details
            </ThemedText>

            <ThemedView
              style={[styles.row, { backgroundColor: "transparent" }]}
            >
              <FormInput
                label="Prep Time"
                placeholder="e.g., 15 min"
                value={recipe.prepTime}
                onChangeText={(text) => updateRecipe("prepTime", text)}
                containerStyle={{
                  flex: 1,
                  marginRight: theme.spacing.sm,
                }}
              />
              <FormInput
                label="Cook Time"
                placeholder="e.g., 30 min"
                value={recipe.cookTime}
                onChangeText={(text) => updateRecipe("cookTime", text)}
                containerStyle={{
                  flex: 1,
                  marginLeft: theme.spacing.sm,
                }}
              />
            </ThemedView>

            <ThemedView
              style={[styles.row, { backgroundColor: "transparent" }]}
            >
              <FormInput
                label="Servings"
                placeholder="4"
                value={recipe.servings}
                onChangeText={(text) => updateRecipe("servings", text)}
                keyboardType="numeric"
                containerStyle={{
                  flex: 1,
                  marginRight: theme.spacing.sm,
                }}
              />
              <ThemedView
                style={[
                  styles.formGroup,
                  { flex: 1, marginLeft: theme.spacing.sm },
                ]}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.formLabel}
                >
                  Difficulty
                </ThemedText>
                <ThemedView
                  style={[
                    styles.row,
                    { backgroundColor: "transparent" },
                  ]}
                >
                  {difficultyOptions.map((diff) => (
                    <TouchableOpacity
                      key={diff}
                      style={[
                        styles.chip,
                        {
                          backgroundColor:
                            recipe.difficulty === diff
                              ? themedColors.primary
                              : themedColors.backgroundTertiary,
                          borderColor:
                            recipe.difficulty === diff
                              ? themedColors.primary
                              : themedColors.border,
                        },
                      ]}
                      onPress={() =>
                        updateRecipe(
                          "difficulty",
                          diff as DifficultyLevel
                        )
                      }
                    >
                      <ThemedText
                        style={{
                          color:
                            recipe.difficulty === diff
                              ? "white"
                              : themedColors.text,
                          fontSize: 12,
                          fontWeight: "500",
                        }}
                      >
                        {diff}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ThemedView>
            </ThemedView>

            <FormInput
              label="Cuisine"
              placeholder="e.g., Italian, Mexican, Asian"
              value={recipe.cuisine}
              onChangeText={(text) => updateRecipe("cuisine", text)}
            />
          </ThemedView>

          {/* Ingredients */}
          <ThemedView
            style={[styles.section, { paddingHorizontal: 0 }]}
          >
            <ThemedView
              style={[
                styles.rowBetween,
                { marginBottom: theme.spacing.lg },
              ]}
            >
              <ThemedText type="subtitle">
                Ingredients * (
                {recipe.ingredients.filter((ing) => ing.trim()).length})
              </ThemedText>
              <TouchableOpacity onPress={addIngredient}>
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={themedColors.primary}
                />
              </TouchableOpacity>
            </ThemedView>

            {recipe.ingredients.map((ingredient, index) => (
              <ThemedView
                key={index}
                style={[
                  styles.row,
                  {
                    backgroundColor: "transparent",
                    marginBottom: theme.spacing.md,
                    alignItems: "flex-end",
                  },
                ]}
              >
                <FormInput
                  label=""
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChangeText={(text) => updateIngredient(index, text)}
                  containerStyle={{ flex: 1, marginBottom: 0 }}
                />
                {recipe.ingredients.length > 1 && (
                  <TouchableOpacity
                    style={{ padding: 8, marginLeft: theme.spacing.sm }}
                    onPress={() => removeIngredient(index)}
                  >
                    <Ionicons
                      name="remove-circle"
                      size={20}
                      color={themedColors.error}
                    />
                  </TouchableOpacity>
                )}
              </ThemedView>
            ))}
            {errors.ingredients && (
              <ThemedText
                style={{ fontSize: 12, color: themedColors.error }}
              >
                {errors.ingredients}
              </ThemedText>
            )}
          </ThemedView>

          {/* Instructions */}
          <ThemedView
            style={[styles.section, { paddingHorizontal: 0 }]}
          >
            <ThemedView
              style={[
                styles.rowBetween,
                { marginBottom: theme.spacing.lg },
              ]}
            >
              <ThemedText type="subtitle">
                Instructions * (
                {
                  recipe.instructions.filter((inst) => inst.trim())
                    .length
                }{" "}
                steps)
              </ThemedText>
              <TouchableOpacity onPress={addInstruction}>
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={themedColors.primary}
                />
              </TouchableOpacity>
            </ThemedView>

            {recipe.instructions.map((instruction, index) => (
              <ThemedView
                key={index}
                style={[
                  styles.row,
                  {
                    backgroundColor: "transparent",
                    marginBottom: theme.spacing.md,
                    alignItems: "flex-start",
                  },
                ]}
              >
                <ThemedView
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: themedColors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: theme.spacing.sm,
                    marginTop: 8,
                  }}
                >
                  <ThemedText
                    style={{
                      color: "white",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {index + 1}
                  </ThemedText>
                </ThemedView>
                <FormInput
                  label=""
                  placeholder={`Step ${index + 1}`}
                  value={instruction}
                  onChangeText={(text) =>
                    updateInstruction(index, text)
                  }
                  multiline
                  style={{ minHeight: 60 }}
                  containerStyle={{ flex: 1, marginBottom: 0 }}
                />
                {recipe.instructions.length > 1 && (
                  <TouchableOpacity
                    style={{ padding: 8, marginLeft: theme.spacing.sm }}
                    onPress={() => removeInstruction(index)}
                  >
                    <Ionicons
                      name="remove-circle"
                      size={20}
                      color={themedColors.error}
                    />
                  </TouchableOpacity>
                )}
              </ThemedView>
            ))}
            {errors.instructions && (
              <ThemedText
                style={{ fontSize: 12, color: themedColors.error }}
              >
                {errors.instructions}
              </ThemedText>
            )}
          </ThemedView>

          {/* Tags */}
          <ThemedView
            style={[styles.section, { paddingHorizontal: 0 }]}
          >
            <ThemedView
              style={[
                styles.rowBetween,
                { marginBottom: theme.spacing.lg },
              ]}
            >
              <ThemedText type="subtitle">
                Tags ({recipe.tags.length})
              </ThemedText>
              <TouchableOpacity
                onPress={() => setTagModalVisible(true)}
              >
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={themedColors.primary}
                />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView
              style={[
                styles.row,
                { flexWrap: "wrap", backgroundColor: "transparent" },
              ]}
            >
              {recipe.tags.map((tag, index) => (
                <ThemedView
                  key={index}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: themedColors.primary,
                      marginRight: theme.spacing.sm,
                      marginBottom: theme.spacing.sm,
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                >
                  <ThemedText style={{ color: "white", fontSize: 12 }}>
                    #{tag}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => removeTag(tag)}
                    style={{ marginLeft: theme.spacing.xs }}
                  >
                    <Ionicons name="close" size={14} color="white" />
                  </TouchableOpacity>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </ScrollView>

        {/* Save Button */}
        <ThemedView
          style={{
            padding: getResponsivePadding(),
            borderTopWidth: 1,
            borderTopColor: themedColors.border,
          }}
        >
          <ActionButton
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            disabled={!hasChanges}
            icon="save"
          />
        </ThemedView>
      </KeyboardAvoidingContainer>

      {/* Emoji Selection Modal */}
      <Modal
        visible={emojiModalVisible}
        onClose={() => setEmojiModalVisible(false)}
        title="Choose Recipe Image"
      >
        <ThemedView
          style={[
            styles.row,
            { flexWrap: "wrap", backgroundColor: "transparent" },
          ]}
        >
          {popularEmojis.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                margin: 4,
                borderRadius: 8,
                backgroundColor:
                  recipe.image === emoji
                    ? `${themedColors.primary}20`
                    : themedColors.backgroundTertiary,
              }}
              onPress={() => {
                updateRecipe("image", emoji);
                setEmojiModalVisible(false);
              }}
            >
              <ThemedText style={{ fontSize: 24 }}>{emoji}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </Modal>

      {/* Add Tag Modal */}
      <Modal
        visible={tagModalVisible}
        onClose={() => setTagModalVisible(false)}
        title="Add Tag"
        size="small"
      >
        <FormInput
          label=""
          placeholder="Enter tag name"
          value={newTag}
          onChangeText={setNewTag}
          autoFocus
        />
        <ActionButton
          title="Add Tag"
          onPress={addTag}
          disabled={!newTag.trim()}
          style={{ marginTop: theme.spacing.lg }}
        />
      </Modal>

      {/* Discard Changes Dialog */}
      <ConfirmDialog
        visible={discardDialogVisible}
        onClose={() => setDiscardDialogVisible(false)}
        onConfirm={() => router.back()}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        confirmText="Discard"
        destructive
      />

      <ThemedView style={{ height: 50 }} />
    </SafeAreaView>
  );
}
