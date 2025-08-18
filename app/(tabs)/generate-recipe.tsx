import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import ApiService from "@/services/api";
import { PantryItem, Recipe } from "@/services/types";
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

interface GenerationOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface GenerationPreferences {
  selectedIngredients: string[];
  cuisine: string;
  style: string;
  prepTime: string;
  dietaryRestrictions: string[];
  additionalPrompt: string;
}

export default function RecipeGeneratorPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  // Data states
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(
    null
  );
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Generation preferences
  const [preferences, setPreferences] = useState<GenerationPreferences>(
    {
      selectedIngredients: [],
      cuisine: "",
      style: "",
      prepTime: "",
      dietaryRestrictions: [],
      additionalPrompt: "",
    }
  );

  const cuisineOptions: GenerationOption[] = [
    {
      id: "any",
      name: "Any Cuisine",
      icon: "restaurant",
      color: "#6b7280",
    },
    { id: "italian", name: "Italian", icon: "wine", color: "#dc2626" },
    { id: "mexican", name: "Mexican", icon: "sunny", color: "#ea580c" },
    {
      id: "chinese",
      name: "Chinese",
      icon: "restaurant",
      color: "#dc2626",
    },
    { id: "indian", name: "Indian", icon: "flame", color: "#d97706" },
    { id: "thai", name: "Thai", icon: "leaf", color: "#16a34a" },
    {
      id: "japanese",
      name: "Japanese",
      icon: "fish",
      color: "#0891b2",
    },
    {
      id: "mediterranean",
      name: "Mediterranean",
      icon: "sunny",
      color: "#0ea5e9",
    },
    {
      id: "american",
      name: "American",
      icon: "fast-food",
      color: "#dc2626",
    },
    { id: "french", name: "French", icon: "wine", color: "#7c3aed" },
  ];

  const styleOptions: GenerationOption[] = [
    {
      id: "any",
      name: "Any Style",
      icon: "restaurant",
      color: "#6b7280",
    },
    {
      id: "comfort",
      name: "Comfort Food",
      icon: "heart",
      color: "#dc2626",
    },
    { id: "healthy", name: "Healthy", icon: "leaf", color: "#16a34a" },
    { id: "gourmet", name: "Gourmet", icon: "star", color: "#d97706" },
    {
      id: "simple",
      name: "Simple & Easy",
      icon: "checkmark-circle",
      color: "#0891b2",
    },
    { id: "spicy", name: "Spicy", icon: "flame", color: "#dc2626" },
    {
      id: "fresh",
      name: "Fresh & Light",
      icon: "leaf",
      color: "#22c55e",
    },
    {
      id: "hearty",
      name: "Hearty & Filling",
      icon: "nutrition",
      color: "#a855f7",
    },
  ];

  const prepTimeOptions: GenerationOption[] = [
    { id: "any", name: "Any Time", icon: "time", color: "#6b7280" },
    {
      id: "quick",
      name: "Quick (< 30 min)",
      icon: "flash",
      color: "#f59e0b",
    },
    {
      id: "medium",
      name: "Medium (30-60 min)",
      icon: "time",
      color: "#0891b2",
    },
    {
      id: "slow",
      name: "Slow Cook (> 1 hour)",
      icon: "hourglass",
      color: "#7c3aed",
    },
  ];

  const dietaryOptions: GenerationOption[] = [
    {
      id: "vegetarian",
      name: "Vegetarian",
      icon: "leaf",
      color: "#16a34a",
    },
    { id: "vegan", name: "Vegan", icon: "leaf", color: "#22c55e" },
    {
      id: "gluten-free",
      name: "Gluten-Free",
      icon: "ban",
      color: "#d97706",
    },
    {
      id: "dairy-free",
      name: "Dairy-Free",
      icon: "water",
      color: "#0891b2",
    },
    {
      id: "low-carb",
      name: "Low Carb",
      icon: "fitness",
      color: "#dc2626",
    },
    { id: "keto", name: "Keto", icon: "nutrition", color: "#7c3aed" },
    { id: "paleo", name: "Paleo", icon: "leaf", color: "#a855f7" },
    {
      id: "nut-free",
      name: "Nut-Free",
      icon: "close-circle",
      color: "#ef4444",
    },
  ];

  // Load pantry items
  const loadPantryItems = async () => {
    try {
      setLoading(true);
      const items = await ApiService.getPantryItems();
      setPantryItems(items);
    } catch (error) {
      console.error("Failed to load pantry items:", error);
      Alert.alert("Error", "Failed to load pantry items.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPantryItems();
    setRefreshing(false);
  };

  useEffect(() => {
    if (currentUser) {
      loadPantryItems();
    }
  }, [currentUser]);

  const toggleIngredient = (ingredient: string) => {
    setPreferences((prev) => ({
      ...prev,
      selectedIngredients: prev.selectedIngredients.includes(ingredient)
        ? prev.selectedIngredients.filter((item) => item !== ingredient)
        : [...prev.selectedIngredients, ingredient],
    }));
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setPreferences((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(
        restriction
      )
        ? prev.dietaryRestrictions.filter(
            (item) => item !== restriction
          )
        : [...prev.dietaryRestrictions, restriction],
    }));
  };

  const buildPrompt = (): string => {
    let prompt = "Create a detailed recipe";

    // Add selected ingredients
    if (preferences.selectedIngredients.length > 0) {
      prompt += ` using these ingredients: ${preferences.selectedIngredients.join(
        ", "
      )}`;
    }

    // Add cuisine
    if (preferences.cuisine && preferences.cuisine !== "any") {
      prompt += `. Make it ${preferences.cuisine} cuisine`;
    }

    // Add style
    if (preferences.style && preferences.style !== "any") {
      prompt += ` in a ${preferences.style} style`;
    }

    // Add prep time
    if (preferences.prepTime && preferences.prepTime !== "any") {
      const timeMap = {
        quick: "that can be prepared in under 30 minutes",
        medium: "that takes 30-60 minutes to prepare",
        slow: "that's perfect for slow cooking (over 1 hour)",
      };
      prompt += ` ${
        timeMap[preferences.prepTime as keyof typeof timeMap]
      }`;
    }

    // Add dietary restrictions
    if (preferences.dietaryRestrictions.length > 0) {
      prompt += `. Make sure it's ${preferences.dietaryRestrictions.join(
        " and "
      )}`;
    }

    // Add additional prompt
    if (preferences.additionalPrompt.trim()) {
      prompt += `. ${preferences.additionalPrompt}`;
    }

    prompt +=
      ". Include detailed ingredients list, step-by-step instructions, cooking time, servings, and difficulty level.";

    return prompt;
  };

  const generateRecipe = async () => {
    if (
      preferences.selectedIngredients.length === 0 &&
      !preferences.additionalPrompt.trim()
    ) {
      Alert.alert(
        "Selection Required",
        "Please select at least one ingredient or add a custom prompt."
      );
      return;
    }

    try {
      setGenerating(true);

      console.log("Generating recipe with preferences:", {
        selectedIngredients: preferences.selectedIngredients,
        cuisine: preferences.cuisine,
        style: preferences.style,
        prepTime: preferences.prepTime,
        dietaryRestrictions: preferences.dietaryRestrictions,
        additionalPrompt: preferences.additionalPrompt,
      });

      // Call the Gemini-powered API
      const generatedRecipe = await ApiService.generateRecipe({
        selectedIngredients: preferences.selectedIngredients,
        cuisine: preferences.cuisine || "any",
        style: preferences.style || "any",
        prepTime: preferences.prepTime || "any",
        dietaryRestrictions: preferences.dietaryRestrictions,
        additionalPrompt: preferences.additionalPrompt.trim(),
      });

      console.log("Generated recipe received:", generatedRecipe);

      setGeneratedRecipe(generatedRecipe);
      setShowRecipeModal(true);
    } catch (error) {
      console.error("Failed to generate recipe:", error);

      Alert.alert(
        "Generation Failed",
        "Failed to generate recipe. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  const saveRecipe = async () => {
    if (!generatedRecipe) return;

    try {
      Alert.alert(
        "Recipe Saved!",
        "Your AI-generated recipe has been saved to your collection. You can find it in your recipes list.",
        [
          {
            text: "View Recipes",
            onPress: () => {
              setShowRecipeModal(false);
              router.push("/recipes");
            },
          },
          {
            text: "Generate Another",
            style: "cancel",
            onPress: () => {
              setShowRecipeModal(false);
              // Reset preferences for new generation
              setPreferences({
                selectedIngredients: [],
                cuisine: "",
                style: "",
                prepTime: "",
                dietaryRestrictions: [],
                additionalPrompt: "",
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in save flow:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const renderIngredientItem = ({ item }: { item: PantryItem }) => {
    const isSelected = preferences.selectedIngredients.includes(
      item.name
    );

    return (
      <TouchableOpacity
        style={[
          styles.ingredientCard,
          isSelected && {
            backgroundColor: `${THEME_COLOR}20`,
            borderColor: THEME_COLOR,
          },
        ]}
        onPress={() => toggleIngredient(item.name)}
      >
        <ThemedText style={styles.ingredientEmoji}>
          {item.emoji}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.ingredientName,
            isSelected && { color: THEME_COLOR },
          ]}
        >
          {item.name}
        </ThemedText>
        <ThemedText type="default" style={styles.ingredientQuantity}>
          {item.quantity} {item.unit}
        </ThemedText>
        {isSelected && (
          <ThemedView style={styles.selectedBadge}>
            <Ionicons name="checkmark" size={16} color="white" />
          </ThemedView>
        )}
      </TouchableOpacity>
    );
  };

  const renderOptionButton = (
    option: GenerationOption,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionButton,
        isSelected && {
          backgroundColor: option.color,
          borderColor: option.color,
        },
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={option.icon as IoniconsName}
        size={18}
        color={isSelected ? "white" : option.color}
      />
      <ThemedText
        type="defaultSemiBold"
        style={[styles.optionText, isSelected && { color: "white" }]}
      >
        {option.name}
      </ThemedText>
    </TouchableOpacity>
  );

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
          Loading your pantry...
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name={"chevron-back" as IoniconsName}
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#333"}
            />
          </TouchableOpacity>
          <ThemedView style={styles.headerText}>
            <ThemedText type="title" style={styles.headerTitle}>
              Recipe Generator
            </ThemedText>
            <ThemedText type="default" style={styles.headerSubtitle}>
              Create recipes with AI
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons
            name={"sparkles" as IoniconsName}
            size={24}
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
        {/* Selected Ingredients Summary */}
        {preferences.selectedIngredients.length > 0 && (
          <ThemedView style={styles.summaryCard}>
            <ThemedText type="subtitle" style={styles.summaryTitle}>
              Selected Ingredients (
              {preferences.selectedIngredients.length})
            </ThemedText>
            <ThemedView style={styles.selectedIngredientsList}>
              {preferences.selectedIngredients.map(
                (ingredient, index) => (
                  <ThemedView
                    key={index}
                    style={styles.selectedIngredientTag}
                  >
                    <ThemedText style={styles.selectedIngredientText}>
                      {ingredient}
                    </ThemedText>
                    <TouchableOpacity
                      onPress={() => toggleIngredient(ingredient)}
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color={THEME_COLOR}
                      />
                    </TouchableOpacity>
                  </ThemedView>
                )
              )}
            </ThemedView>
          </ThemedView>
        )}

        {/* Pantry Ingredients */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Your Pantry Ingredients
          </ThemedText>
          <ThemedText type="default" style={styles.sectionSubtitle}>
            Select ingredients you want to use
          </ThemedText>

          {pantryItems.length > 0 ? (
            <FlatList
              data={pantryItems}
              renderItem={renderIngredientItem}
              keyExtractor={(item) => item._id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.ingredientsGrid}
            />
          ) : (
            <ThemedView style={styles.emptyState}>
              <Ionicons
                name={"archive-outline" as IoniconsName}
                size={48}
                color={colorScheme === "dark" ? "#666" : "#ccc"}
              />
              <ThemedText style={styles.emptyText}>
                No pantry items found
              </ThemedText>
              <TouchableOpacity onPress={() => router.push("/pantry")}>
                <ThemedText type="link">
                  Add items to your pantry
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ThemedView>

        {/* Cuisine Selection */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Cuisine Type
          </ThemedText>
          <ThemedView style={styles.optionsGrid}>
            {cuisineOptions.map((option) =>
              renderOptionButton(
                option,
                preferences.cuisine === option.id,
                () =>
                  setPreferences((prev) => ({
                    ...prev,
                    cuisine: option.id,
                  }))
              )
            )}
          </ThemedView>
        </ThemedView>

        {/* Style Selection */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Cooking Style
          </ThemedText>
          <ThemedView style={styles.optionsGrid}>
            {styleOptions.map((option) =>
              renderOptionButton(
                option,
                preferences.style === option.id,
                () =>
                  setPreferences((prev) => ({
                    ...prev,
                    style: option.id,
                  }))
              )
            )}
          </ThemedView>
        </ThemedView>

        {/* Prep Time Selection */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Preparation Time
          </ThemedText>
          <ThemedView style={styles.optionsGrid}>
            {prepTimeOptions.map((option) =>
              renderOptionButton(
                option,
                preferences.prepTime === option.id,
                () =>
                  setPreferences((prev) => ({
                    ...prev,
                    prepTime: option.id,
                  }))
              )
            )}
          </ThemedView>
        </ThemedView>

        {/* Dietary Restrictions */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Dietary Restrictions
          </ThemedText>
          <ThemedText type="default" style={styles.sectionSubtitle}>
            Select all that apply
          </ThemedText>
          <ThemedView style={styles.optionsGrid}>
            {dietaryOptions.map((option) =>
              renderOptionButton(
                option,
                preferences.dietaryRestrictions.includes(option.id),
                () => toggleDietaryRestriction(option.id)
              )
            )}
          </ThemedView>
        </ThemedView>

        {/* Additional Prompt */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Additional Instructions
          </ThemedText>
          <ThemedText type="default" style={styles.sectionSubtitle}>
            Tell the AI anything specific you want
          </ThemedText>
          <TextInput
            style={[
              styles.promptInput,
              {
                borderColor:
                  colorScheme === "dark" ? "#444" : "#e5e7eb",
                backgroundColor:
                  colorScheme === "dark" ? "#333" : "#fff",
                color: colorScheme === "dark" ? "#fff" : "#333",
              },
            ]}
            placeholder="e.g., Make it spicy, use leftovers, quick weeknight dinner..."
            placeholderTextColor={
              colorScheme === "dark" ? "#888" : "#999"
            }
            value={preferences.additionalPrompt}
            onChangeText={(text) =>
              setPreferences((prev) => ({
                ...prev,
                additionalPrompt: text,
              }))
            }
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </ThemedView>

        {/* Generate Button */}
        <ThemedView style={styles.generateSection}>
          <TouchableOpacity
            style={[
              styles.generateButton,
              { backgroundColor: THEME_COLOR },
              (generating ||
                (preferences.selectedIngredients.length === 0 &&
                  !preferences.additionalPrompt.trim())) && {
                opacity: 0.6,
              },
            ]}
            onPress={generateRecipe}
            disabled={
              generating ||
              (preferences.selectedIngredients.length === 0 &&
                !preferences.additionalPrompt.trim())
            }
          >
            {generating ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <ThemedText style={styles.generateButtonText}>
                  AI is creating your recipe...
                </ThemedText>
              </>
            ) : (
              <>
                <Ionicons
                  name={"sparkles" as IoniconsName}
                  size={20}
                  color="white"
                />
                <ThemedText style={styles.generateButtonText}>
                  Generate with AI
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

          {preferences.selectedIngredients.length === 0 &&
            !preferences.additionalPrompt.trim() && (
              <ThemedText style={styles.generateHint}>
                Select ingredients or add custom instructions to
                generate
              </ThemedText>
            )}

          {generating && (
            <ThemedText style={styles.generateHint}>
              This may take 10-30 seconds while our AI chef works...
            </ThemedText>
          )}
        </ThemedView>
      </ScrollView>

      {/* Generated Recipe Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRecipeModal}
        onRequestClose={() => setShowRecipeModal(false)}
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
                Generated Recipe
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowRecipeModal(false)}
              >
                <Ionicons
                  name={"close" as IoniconsName}
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#333"}
                />
              </TouchableOpacity>
            </ThemedView>

            {generatedRecipe && (
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                <ThemedView style={styles.recipeHeader}>
                  <ThemedText style={styles.recipeEmoji}>
                    {generatedRecipe.image}
                  </ThemedText>
                  <ThemedText type="title" style={styles.recipeName}>
                    {generatedRecipe.name}
                  </ThemedText>
                  <ThemedText
                    type="default"
                    style={styles.recipeDescription}
                  >
                    {generatedRecipe.description}
                  </ThemedText>

                  {/* AI Generated Badge */}
                  <ThemedView style={styles.aiBadge}>
                    <Ionicons name="sparkles" size={12} color="white" />
                    <ThemedText style={styles.aiBadgeText}>
                      AI Generated
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.recipeDetails}>
                  <ThemedView style={styles.recipeDetailItem}>
                    <Ionicons
                      name="time"
                      size={16}
                      color={THEME_COLOR}
                    />
                    <ThemedText style={styles.recipeDetailText}>
                      Prep: {generatedRecipe.prepTime}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.recipeDetailItem}>
                    <Ionicons
                      name="flame"
                      size={16}
                      color={THEME_COLOR}
                    />
                    <ThemedText style={styles.recipeDetailText}>
                      Cook: {generatedRecipe.cookTime}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.recipeDetailItem}>
                    <Ionicons
                      name="people"
                      size={16}
                      color={THEME_COLOR}
                    />
                    <ThemedText style={styles.recipeDetailText}>
                      {generatedRecipe.servings} servings
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.recipeDetailItem}>
                    <Ionicons
                      name="bar-chart"
                      size={16}
                      color={THEME_COLOR}
                    />
                    <ThemedText style={styles.recipeDetailText}>
                      {generatedRecipe.difficulty}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.ingredientsList}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.sectionLabel}
                  >
                    Ingredients (
                    {generatedRecipe.ingredients?.length || 0})
                  </ThemedText>
                  {generatedRecipe.ingredients?.map(
                    (ingredient, index) => (
                      <ThemedView
                        key={index}
                        style={styles.ingredientRow}
                      >
                        <ThemedView style={styles.ingredientBullet} />
                        <ThemedText style={styles.ingredientItem}>
                          {ingredient}
                        </ThemedText>
                      </ThemedView>
                    )
                  )}
                </ThemedView>

                <ThemedView style={styles.instructionsList}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.sectionLabel}
                  >
                    Instructions (
                    {generatedRecipe.instructions?.length || 0} steps)
                  </ThemedText>
                  {generatedRecipe.instructions?.map(
                    (instruction, index) => (
                      <ThemedView
                        key={index}
                        style={styles.instructionRow}
                      >
                        <ThemedView style={styles.stepNumber}>
                          <ThemedText style={styles.stepNumberText}>
                            {index + 1}
                          </ThemedText>
                        </ThemedView>
                        <ThemedText style={styles.instructionItem}>
                          {instruction}
                        </ThemedText>
                      </ThemedView>
                    )
                  )}
                </ThemedView>

                {/* Recipe Tags */}
                {generatedRecipe.tags &&
                  generatedRecipe.tags.length > 0 && (
                    <ThemedView style={styles.tagsSection}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.sectionLabel}
                      >
                        Tags
                      </ThemedText>
                      <ThemedView style={styles.tagsList}>
                        {generatedRecipe.tags.map((tag, index) => (
                          <ThemedView key={index} style={styles.tag}>
                            <ThemedText style={styles.tagText}>
                              #{tag}
                            </ThemedText>
                          </ThemedView>
                        ))}
                      </ThemedView>
                    </ThemedView>
                  )}

                <ThemedView style={styles.modalActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.secondaryButton,
                    ]}
                    onPress={() => {
                      setShowRecipeModal(false);
                      // Keep current preferences for easy regeneration
                    }}
                  >
                    <Ionicons
                      name="refresh"
                      size={18}
                      color={colorScheme === "dark" ? "#fff" : "#666"}
                    />
                    <ThemedText style={styles.secondaryButtonText}>
                      Try Again
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: THEME_COLOR },
                    ]}
                    onPress={saveRecipe}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="white"
                    />
                    <ThemedText style={styles.primaryButtonText}>
                      Save Recipe
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ScrollView>
            )}
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: `${THEME_COLOR}20`,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: THEME_COLOR,
  },
  summaryTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: THEME_COLOR,
  },
  selectedIngredientsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "transparent",
  },
  selectedIngredientTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_COLOR,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 6,
  },
  selectedIngredientText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginVertical: 16,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  ingredientsGrid: {
    gap: 12,
  },
  ingredientCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    margin: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    position: "relative",
  },
  ingredientEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  ingredientQuantity: {
    fontSize: 10,
    opacity: 0.7,
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    backgroundColor: "transparent",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    gap: 6,
  },
  optionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  promptInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  generateSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingBottom: 100,
    backgroundColor: "transparent",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    minWidth: 200,
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  generateHint: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 8,
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 500,
    maxHeight: "85%",
    borderRadius: 16,
    overflow: "hidden",
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
  recipeHeader: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  recipeEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 20,
  },
  recipeDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "transparent",
  },
  recipeDetailItem: {
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
  },
  recipeDetailText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ingredientsList: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  instructionsList: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  ingredientItem: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  instructionItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    backgroundColor: "transparent",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.3)",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
    gap: 4,
  },
  aiBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME_COLOR,
    marginTop: 8,
    marginRight: 12,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${THEME_COLOR}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME_COLOR,
  },
  tagsSection: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "transparent",
  },
  tag: {
    backgroundColor: `${THEME_COLOR}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${THEME_COLOR}30`,
  },
  tagText: {
    fontSize: 12,
    color: THEME_COLOR,
    fontWeight: "500",
  },
});
