import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const THEME_COLOR = "#FFB902";

interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  emoji: string;
  prepTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface DayPlan {
  date: string;
  dayName: string;
  meals: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
    snack?: Meal;
  };
}

export default function MealPlannerPage() {
  const router = useRouter();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const colorScheme = useColorScheme();

  const suggestedMeals: Meal[] = [
    {
      id: "1",
      name: "Avocado Toast",
      type: "breakfast",
      emoji: "🥑",
      prepTime: "10 min",
      difficulty: "Easy",
    },
    {
      id: "2",
      name: "Greek Yogurt Bowl",
      type: "breakfast",
      emoji: "🥣",
      prepTime: "5 min",
      difficulty: "Easy",
    },
    {
      id: "3",
      name: "Mediterranean Salad",
      type: "lunch",
      emoji: "🥗",
      prepTime: "15 min",
      difficulty: "Easy",
    },
    {
      id: "4",
      name: "Chicken Stir Fry",
      type: "dinner",
      emoji: "🍗",
      prepTime: "25 min",
      difficulty: "Medium",
    },
    {
      id: "5",
      name: "Pasta Primavera",
      type: "dinner",
      emoji: "🍝",
      prepTime: "30 min",
      difficulty: "Medium",
    },
    {
      id: "6",
      name: "Fruit Smoothie",
      type: "snack",
      emoji: "🥤",
      prepTime: "5 min",
      difficulty: "Easy",
    },
    {
      id: "7",
      name: "Quinoa Bowl",
      type: "lunch",
      emoji: "🍲",
      prepTime: "20 min",
      difficulty: "Medium",
    },
    {
      id: "8",
      name: "Salmon Teriyaki",
      type: "dinner",
      emoji: "🐟",
      prepTime: "35 min",
      difficulty: "Hard",
    },
  ];

  const [weekPlans, setWeekPlans] = useState<DayPlan[]>([
    {
      date: "Dec 2",
      dayName: "Monday",
      meals: {
        breakfast: suggestedMeals[0],
        lunch: suggestedMeals[2],
        dinner: suggestedMeals[3],
      },
    },
    {
      date: "Dec 3",
      dayName: "Tuesday",
      meals: {
        breakfast: suggestedMeals[1],
        dinner: suggestedMeals[4],
      },
    },
    {
      date: "Dec 4",
      dayName: "Wednesday",
      meals: {
        lunch: suggestedMeals[6],
        dinner: suggestedMeals[7],
        snack: suggestedMeals[5],
      },
    },
    {
      date: "Dec 5",
      dayName: "Thursday",
      meals: {},
    },
    {
      date: "Dec 6",
      dayName: "Friday",
      meals: {
        breakfast: suggestedMeals[0],
      },
    },
    {
      date: "Dec 7",
      dayName: "Saturday",
      meals: {},
    },
    {
      date: "Dec 8",
      dayName: "Sunday",
      meals: {},
    },
  ]);

  const mealTypes = [
    {
      key: "breakfast" as const,
      label: "Breakfast",
      icon: "sunny",
      color: "#f59e0b",
    },
    {
      key: "lunch" as const,
      label: "Lunch",
      icon: "partly-sunny",
      color: "#10b981",
    },
    {
      key: "dinner" as const,
      label: "Dinner",
      icon: "moon",
      color: "#8b5cf6",
    },
    {
      key: "snack" as const,
      label: "Snack",
      icon: "star",
      color: "#f97316",
    },
  ];

  const addMealToPlan = (meal: Meal) => {
    const updatedPlans = weekPlans.map((day) => {
      if (day.date === selectedDay) {
        return {
          ...day,
          meals: {
            ...day.meals,
            [selectedMealType]: meal,
          },
        };
      }
      return day;
    });
    setWeekPlans(updatedPlans);
    setModalVisible(false);
  };

  const removeMealFromPlan = (dayDate: string, mealType: string) => {
    const updatedPlans = weekPlans.map((day) => {
      if (day.date === dayDate) {
        const newMeals = { ...day.meals };
        delete newMeals[mealType as keyof typeof day.meals];
        return {
          ...day,
          meals: newMeals,
        };
      }
      return day;
    });
    setWeekPlans(updatedPlans);
  };

  const openMealSelector = (
    dayDate: string,
    mealType: "breakfast" | "lunch" | "dinner" | "snack"
  ) => {
    setSelectedDay(dayDate);
    setSelectedMealType(mealType);
    setModalVisible(true);
  };

  const getMealTypeColor = (type: string) => {
    const mealType = mealTypes.find((mt) => mt.key === type);
    return mealType?.color || THEME_COLOR;
  };

  const renderMealSlot = (
    day: DayPlan,
    mealType: "breakfast" | "lunch" | "dinner" | "snack"
  ) => {
    const meal = day.meals[mealType];
    const mealTypeInfo = mealTypes.find((mt) => mt.key === mealType)!;

    return (
      <ThemedView key={mealType} style={styles.mealSlot}>
        <ThemedView style={styles.mealTypeHeader}>
          <Ionicons
            name={mealTypeInfo.icon as IoniconsName}
            size={16}
            color={mealTypeInfo.color}
          />
          <ThemedText
            type="default"
            style={[
              styles.mealTypeLabel,
              { color: mealTypeInfo.color },
            ]}
          >
            {mealTypeInfo.label}
          </ThemedText>
        </ThemedView>
        {meal ? (
          <TouchableOpacity
            style={[
              styles.mealCard,
              { borderColor: mealTypeInfo.color },
            ]}
            onLongPress={() => removeMealFromPlan(day.date, mealType)}
          >
            <ThemedText style={styles.mealEmoji}>
              {meal.emoji}
            </ThemedText>
            <ThemedView style={styles.mealInfo}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.mealName}
              >
                {meal.name}
              </ThemedText>
              <ThemedText type="default" style={styles.mealTime}>
                {meal.prepTime}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.emptyMealSlot,
              { borderColor: mealTypeInfo.color },
            ]}
            onPress={() => openMealSelector(day.date, mealType)}
          >
            <Ionicons
              name={"add" as IoniconsName}
              size={20}
              color={mealTypeInfo.color}
            />
            <ThemedText
              type="default"
              style={[
                styles.addMealText,
                { color: mealTypeInfo.color },
              ]}
            >
              Add {mealTypeInfo.label}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    );
  };

  const renderMealSuggestion = ({ item }: { item: Meal }) => (
    <TouchableOpacity
      style={styles.suggestionCard}
      onPress={() => addMealToPlan(item)}
    >
      <ThemedText style={styles.suggestionEmoji}>
        {item.emoji}
      </ThemedText>
      <ThemedView style={styles.suggestionInfo}>
        <ThemedText
          type="defaultSemiBold"
          style={styles.suggestionName}
        >
          {item.name}
        </ThemedText>
        <ThemedView style={styles.suggestionDetails}>
          <ThemedText type="default" style={styles.suggestionTime}>
            {item.prepTime}
          </ThemedText>
          <ThemedView
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(item.difficulty) },
            ]}
          >
            <ThemedText style={styles.difficultyText}>
              {item.difficulty}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#10b981";
      case "Medium":
        return "#f59e0b";
      case "Hard":
        return "#ef4444";
      default:
        return THEME_COLOR;
    }
  };

  const filteredMeals = suggestedMeals.filter(
    (meal) => meal.type === selectedMealType
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
              Meal Planner
            </ThemedText>
            <ThemedText type="default" style={styles.headerSubtitle}>
              Plan your week ahead
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons
            name={"calendar" as IoniconsName}
            size={24}
            color={THEME_COLOR}
          />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Week Navigation */}
        <ThemedView style={styles.weekNavigation}>
          <TouchableOpacity style={styles.weekNavButton}>
            <Ionicons
              name={"chevron-back" as IoniconsName}
              size={20}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.weekTitle}>
            This Week
          </ThemedText>
          <TouchableOpacity style={styles.weekNavButton}>
            <Ionicons
              name={"chevron-forward" as IoniconsName}
              size={20}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
          </TouchableOpacity>
        </ThemedView>

        {/* Week Overview Stats */}
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statCard}>
            <ThemedText type="default" style={styles.statNumber}>
              18
            </ThemedText>
            <ThemedText type="default" style={styles.statLabel}>
              Meals Planned
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText type="default" style={styles.statNumber}>
              4
            </ThemedText>
            <ThemedText type="default" style={styles.statLabel}>
              Days Complete
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText type="default" style={styles.statNumber}>
              25m
            </ThemedText>
            <ThemedText type="default" style={styles.statLabel}>
              Avg Prep Time
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.quickActions}>
          <ThemedText type="subtitle" style={styles.quickActionsTitle}>
            Quick Actions
          </ThemedText>
          <ThemedView style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name={"restaurant" as IoniconsName}
                size={20}
                color={THEME_COLOR}
              />
              <ThemedText
                type="defaultSemiBold"
                style={styles.actionButtonText}
              >
                Generate Week
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name={"copy" as IoniconsName}
                size={20}
                color={THEME_COLOR}
              />
              <ThemedText
                type="defaultSemiBold"
                style={styles.actionButtonText}
              >
                Copy Last Week
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Daily Meal Plans */}
        <ThemedView style={styles.daysContainer}>
          {weekPlans.map((day, index) => (
            <ThemedView key={day.date} style={styles.dayCard}>
              <ThemedView style={styles.dayHeader}>
                <ThemedView style={styles.dayInfo}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.dayName}
                  >
                    {day.dayName}
                  </ThemedText>
                  <ThemedText type="default" style={styles.dayDate}>
                    {day.date}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.dayProgress}>
                  <ThemedText
                    type="default"
                    style={styles.progressText}
                  >
                    {Object.keys(day.meals).length}/4 meals
                  </ThemedText>
                  <ThemedView style={styles.progressBar}>
                    <ThemedView
                      style={[
                        styles.progressFill,
                        {
                          width: `${
                            (Object.keys(day.meals).length / 4) * 100
                          }%`,
                          backgroundColor: THEME_COLOR,
                        },
                      ]}
                    />
                  </ThemedView>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.mealsGrid}>
                {mealTypes.map((mealType) =>
                  renderMealSlot(day, mealType.key)
                )}
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>

      {/* Meal Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Choose {selectedMealType}
              </ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons
                  name={"close" as IoniconsName}
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#333"}
                />
              </TouchableOpacity>
            </ThemedView>

            <FlatList
              data={filteredMeals}
              renderItem={renderMealSuggestion}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.suggestionsList}
            />
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
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  weekNavButton: {
    padding: 8,
  },
  weekTitle: {
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME_COLOR,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  daysContainer: {
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  dayCard: {
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    overflow: "hidden",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.1)",
    backgroundColor: "transparent",
  },
  dayInfo: {
    backgroundColor: "transparent",
  },
  dayName: {
    fontSize: 16,
  },
  dayDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  dayProgress: {
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  progressText: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  mealsGrid: {
    padding: 16,
    backgroundColor: "transparent",
  },
  mealSlot: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  mealTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  mealTypeLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "rgba(128, 128, 128, 0.05)",
  },
  mealEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
    backgroundColor: "transparent",
  },
  mealName: {
    fontSize: 14,
  },
  mealTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyMealSlot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    backgroundColor: "rgba(128, 128, 128, 0.02)",
  },
  addMealText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  quickActions: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  quickActionsTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME_COLOR,
    backgroundColor: "rgba(255, 185, 2, 0.1)",
  },
  actionButtonText: {
    fontSize: 14,
    color: THEME_COLOR,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingTop: 20,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "transparent",
  },
  modalTitle: {
    fontSize: 18,
  },
  suggestionsList: {
    padding: 20,
  },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  suggestionEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  suggestionInfo: {
    flex: 1,
    backgroundColor: "transparent",
  },
  suggestionName: {
    fontSize: 16,
    marginBottom: 4,
  },
  suggestionDetails: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  suggestionTime: {
    fontSize: 14,
    opacity: 0.7,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
});
