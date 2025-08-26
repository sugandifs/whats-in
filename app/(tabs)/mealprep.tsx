import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ActionButton } from "@/components/ui/ActionButton";
import { Header } from "@/components/ui/Header";
import { HeaderAction } from "@/components/ui/HeaderActions";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import ApiService from "@/services/api";
import { Meal, MealPlan } from "@/services/types";
import { styles } from "@/styles";
import { mealPrepStyles } from "@/styles/pages";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface WeekNavigation {
  startDate: string;
  endDate: string;
  weekLabel: string;
}

export default function MealPlannerPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { themedColors, theme } = useThemedStyles();

  // State management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");

  // Data states
  const [currentWeek, setCurrentWeek] = useState<WeekNavigation>({
    startDate: "",
    endDate: "",
    weekLabel: "This Week",
  });
  const [weekPlans, setWeekPlans] = useState<MealPlan[]>([]);
  const [suggestedMeals, setSuggestedMeals] = useState<Meal[]>([]);
  const [weekStats, setWeekStats] = useState({
    totalPlans: 0,
    totalMeals: 0,
    completeDays: 0,
    avgMealsPerDay: 0,
  });

  const mealTypes = [
    {
      key: "breakfast" as const,
      label: "Breakfast",
      icon: "sunny",
      color: themedColors.warning,
    },
    {
      key: "lunch" as const,
      label: "Lunch",
      icon: "partly-sunny",
      color: themedColors.success,
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

  // Initialize current week
  useEffect(() => {
    const { startDate, endDate } = ApiService.getCurrentWeekRange();
    const start = new Date(startDate);
    const weekLabel = `Week of ${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;

    setCurrentWeek({
      startDate,
      endDate,
      weekLabel,
    });
  }, []);

  // Load data when user or week changes
  useEffect(() => {
    if (currentUser && currentWeek.startDate) {
      loadWeekData();
      loadMealSuggestions();
    }
  }, [currentUser, currentWeek.startDate]);

  const loadMealSuggestions = async () => {
    try {
      // Get all user's meals and filter by meal type
      const userMeals = await ApiService.getUserMeals();
      setSuggestedMeals(userMeals);
    } catch (error) {
      console.error("Failed to load user meals:", error);
      setSuggestedMeals([]);
    }
  };

  const loadWeekData = async () => {
    try {
      setLoading(true);

      const [mealPlans, stats] = await Promise.all([
        ApiService.getMealPlans(
          currentWeek.startDate,
          currentWeek.endDate
        ),
        ApiService.getMealPlanStats(
          currentWeek.startDate,
          currentWeek.endDate
        ),
      ]);

      // Create complete week structure
      const weekDays = generateWeekDays(currentWeek.startDate);

      const completeWeekPlans = weekDays.map((day) => {
        const existingPlan = mealPlans.find((plan) => {
          const planDate = plan.date.split("T")[0];
          return planDate === day.date;
        });
        return (
          existingPlan || {
            _id: `temp-${day.date}`,
            date: day.date,
            dayName: day.dayName,
            meals: {},
            notes: "",
            userId: currentUser?.uid || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        );
      });

      setWeekPlans(completeWeekPlans);
      setWeekStats(stats);
    } catch (error) {
      console.error("Failed to load week data:", error);
      Alert.alert(
        "Error",
        "Failed to load meal plans. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateWeekDays = (startDate: string) => {
    const days = [];
    const start = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      days.push({
        date: ApiService.formatDate(date),
        dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
        displayDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }

    return days;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWeekData();
    await loadMealSuggestions();
    setRefreshing(false);
  }, [currentWeek]);

  const navigateWeek = (direction: "prev" | "next") => {
    const currentStart = new Date(currentWeek.startDate);
    const newStart = new Date(currentStart);
    newStart.setDate(
      currentStart.getDate() + (direction === "next" ? 7 : -7)
    );

    const newEnd = new Date(newStart);
    newEnd.setDate(newStart.getDate() + 6);

    const weekLabel = `Week of ${newStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;

    setCurrentWeek({
      startDate: ApiService.formatDate(newStart),
      endDate: ApiService.formatDate(newEnd),
      weekLabel: weekLabel,
    });
  };

  const openMealSelector = async (
    dayDate: string,
    mealType: "breakfast" | "lunch" | "dinner" | "snack"
  ) => {
    setSelectedDay(dayDate);
    setSelectedMealType(mealType);
    setModalVisible(true);
    console.log("meal type: ", mealType);
  };

  const addMealToPlan = async (meal: Meal) => {
    try {
      const dayPlan = weekPlans.find(
        (plan) => plan.date === selectedDay
      );
      if (!dayPlan) return;

      const mealPlanData = {
        date: selectedDay,
        dayName: dayPlan.dayName,
        meals: {
          ...dayPlan.meals,
          [selectedMealType]: meal,
        },
        notes: dayPlan.notes || "",
      };

      let updatedPlan;
      if (dayPlan._id?.startsWith("temp-")) {
        // Create new meal plan
        updatedPlan = await ApiService.createMealPlan(mealPlanData);
      } else {
        // Update existing meal plan
        if (!dayPlan._id) return;
        updatedPlan = await ApiService.updateMealPlan(
          dayPlan._id,
          mealPlanData
        );
      }

      // Update local state
      setWeekPlans((prev) =>
        prev.map((plan) =>
          plan.date === selectedDay ? updatedPlan : plan
        )
      );

      setModalVisible(false);
      Alert.alert(
        "Success",
        `${meal.name} added to ${selectedMealType}!`
      );
      await loadWeekData();
    } catch (error) {
      console.error("Failed to add meal to plan:", error);
      Alert.alert(
        "Error",
        "Failed to add meal to plan. Please try again."
      );
    }
  };

  const removeMealFromPlan = async (
    dayDate: string,
    mealType: string
  ) => {
    try {
      const dayPlan = weekPlans.find((plan) => plan.date === dayDate);
      if (!dayPlan || dayPlan._id?.startsWith("temp-")) return;

      if (!dayPlan._id) return;
      await ApiService.removeMealFromPlan(
        dayPlan._id,
        mealType as "breakfast" | "lunch" | "dinner" | "snack"
      );

      // Update local state
      setWeekPlans((prev) =>
        prev.map((plan) => {
          if (plan.date === dayDate) {
            const newMeals = { ...plan.meals };
            delete newMeals[mealType as keyof typeof plan.meals];
            return { ...plan, meals: newMeals };
          }
          return plan;
        })
      );

      Alert.alert("Success", "Meal removed from plan!");
    } catch (error) {
      console.error("Failed to remove meal from plan:", error);
      Alert.alert("Error", "Failed to remove meal. Please try again.");
    }
  };

  const generateWeekPlan = async () => {
    try {
      Alert.alert(
        "Generate Week Plan",
        "This will create a complete meal plan for the week. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Generate",
            onPress: async () => {
              setLoading(true);
              try {
                const generatedPlans =
                  await ApiService.generateWeekMealPlan({
                    startDate: currentWeek.startDate,
                    preferences: {
                      difficulty: "Easy",
                      maxPrepTime: "30 min",
                    },
                  });

                await loadWeekData();
                Alert.alert("Success", "Week meal plan generated!");
              } catch (error) {
                console.error("Failed to generate week plan:", error);
                Alert.alert("Error", "Failed to generate meal plan.");
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in generateWeekPlan:", error);
    }
  };

  const copyLastWeek = async () => {
    try {
      const lastWeekStart = new Date(currentWeek.startDate);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

      const lastWeekPlans = await ApiService.getMealPlans(
        ApiService.formatDate(lastWeekStart),
        ApiService.formatDate(lastWeekEnd)
      );

      if (lastWeekPlans.length === 0) {
        Alert.alert(
          "No Data",
          "No meal plans found for last week to copy."
        );
        return;
      }

      Alert.alert(
        "Copy Last Week",
        `Copy ${lastWeekPlans.length} meal plans from last week?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Copy",
            onPress: async () => {
              setLoading(true);
              try {
                const newPlans = await Promise.all(
                  lastWeekPlans.map(async (plan, index) => {
                    const newDate = new Date(currentWeek.startDate);
                    newDate.setDate(newDate.getDate() + index);
                    return ApiService.copyMealPlan(
                      plan.date,
                      ApiService.formatDate(newDate)
                    );
                  })
                );

                await loadWeekData();
                Alert.alert(
                  "Success",
                  "Last week's meal plans copied!"
                );
              } catch (error) {
                console.error("Failed to copy last week:", error);
                Alert.alert("Error", "Failed to copy meal plans.");
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in copyLastWeek:", error);
    }
  };

  const getMealTypeColor = (type: string) => {
    const mealType = mealTypes.find((mt) => mt.key === type);
    return mealType?.color || themedColors.primary;
  };

  const renderMealSlot = (
    day: MealPlan,
    mealType: "breakfast" | "lunch" | "dinner" | "snack"
  ) => {
    const meal = day.meals[mealType];
    const mealTypeInfo = mealTypes.find((mt) => mt.key === mealType)!;

    return (
      <ThemedView key={mealType} style={mealPrepStyles.mealSlot}>
        <ThemedView style={mealPrepStyles.mealTypeHeader}>
          <Ionicons
            name={mealTypeInfo.icon as IoniconsName}
            size={16}
            color={mealTypeInfo.color}
          />
          <ThemedText
            type="default"
            style={[
              mealPrepStyles.mealTypeLabel,
              { color: mealTypeInfo.color },
            ]}
          >
            {mealTypeInfo.label}
          </ThemedText>
        </ThemedView>
        {meal ? (
          <TouchableOpacity
            style={[
              mealPrepStyles.mealCard,
              {
                borderColor: mealTypeInfo.color,
                backgroundColor: themedColors.backgroundSecondary,
              },
            ]}
            onLongPress={() => {
              Alert.alert(
                "Remove Meal",
                `Remove ${meal.name} from ${mealTypeInfo.label}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Remove",
                    style: "destructive",
                    onPress: () =>
                      removeMealFromPlan(day.date, mealType),
                  },
                ]
              );
            }}
          >
            <ThemedText style={mealPrepStyles.mealEmoji}>
              {meal.emoji || "🍽️"}
            </ThemedText>
            <ThemedView style={mealPrepStyles.mealInfo}>
              <ThemedText
                type="defaultSemiBold"
                style={mealPrepStyles.mealName}
              >
                {meal.name}
              </ThemedText>
              <ThemedText
                type="default"
                style={mealPrepStyles.mealTime}
              >
                {meal.prepTime || "N/A"}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              mealPrepStyles.emptyMealSlot,
              {
                borderColor: mealTypeInfo.color,
                backgroundColor: themedColors.backgroundTertiary,
              },
            ]}
            onPress={() => openMealSelector(day.date, mealType)}
          >
            <Ionicons name="add" size={20} color={mealTypeInfo.color} />
            <ThemedText
              type="default"
              style={[
                mealPrepStyles.addMealText,
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
      style={[
        mealPrepStyles.suggestionCard,
        {
          backgroundColor: themedColors.backgroundSecondary,
          borderColor: themedColors.border,
        },
      ]}
      onPress={() => addMealToPlan(item)}
    >
      <ThemedText style={mealPrepStyles.suggestionEmoji}>
        {item.emoji || "🍽️"}
      </ThemedText>
      <ThemedView style={mealPrepStyles.suggestionInfo}>
        <ThemedText
          type="defaultSemiBold"
          style={mealPrepStyles.suggestionName}
        >
          {item.name}
        </ThemedText>
        <ThemedView style={mealPrepStyles.suggestionDetails}>
          <ThemedText
            type="default"
            style={mealPrepStyles.suggestionTime}
          >
            {item.prepTime || "N/A"}
          </ThemedText>
          <ThemedView
            style={[
              mealPrepStyles.difficultyBadge,
              { backgroundColor: getDifficultyColor(item.difficulty) },
            ]}
          >
            <ThemedText style={mealPrepStyles.difficultyText}>
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
        return themedColors.success;
      case "Medium":
        return themedColors.warning;
      case "Hard":
        return themedColors.error;
      default:
        return themedColors.primary;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading meal plans..." />;
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
        title="Meal Planner"
        subtitle="Plan your week ahead"
        rightActions={
          <HeaderAction icon="calendar" onPress={() => null} />
        }
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themedColors.primary]}
          />
        }
      >
        {/* Week Navigation */}
        <ThemedView style={mealPrepStyles.weekNavigation}>
          <TouchableOpacity
            style={mealPrepStyles.weekNavButton}
            onPress={() => navigateWeek("prev")}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={themedColors.text}
            />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={mealPrepStyles.weekTitle}>
            {currentWeek.weekLabel}
          </ThemedText>
          <TouchableOpacity
            style={mealPrepStyles.weekNavButton}
            onPress={() => navigateWeek("next")}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={themedColors.text}
            />
          </TouchableOpacity>
        </ThemedView>

        {/* Week Overview Stats */}
        <ThemedView style={mealPrepStyles.statsContainer}>
          <ThemedView
            style={[
              mealPrepStyles.statCard,
              { borderColor: themedColors.border },
            ]}
          >
            <ThemedText
              type="default"
              style={[
                mealPrepStyles.statNumber,
                { color: themedColors.primary },
              ]}
            >
              {weekStats.totalMeals}
            </ThemedText>
            <ThemedText type="default" style={mealPrepStyles.statLabel}>
              Meals Planned
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[
              mealPrepStyles.statCard,
              { borderColor: themedColors.border },
            ]}
          >
            <ThemedText
              type="default"
              style={[
                mealPrepStyles.statNumber,
                { color: themedColors.primary },
              ]}
            >
              {weekStats.completeDays}
            </ThemedText>
            <ThemedText type="default" style={mealPrepStyles.statLabel}>
              Days Complete
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView
          style={[
            mealPrepStyles.quickActions,
            { paddingHorizontal: theme.spacing.lg },
          ]}
        >
          <ThemedText
            type="subtitle"
            style={mealPrepStyles.quickActionsTitle}
          >
            Quick Actions
          </ThemedText>
          <ThemedView style={mealPrepStyles.actionButtons}>
            <ActionButton
              title="Generate Week"
              icon="restaurant"
              variant="outline"
              onPress={generateWeekPlan}
              style={{ flex: 1, marginRight: theme.spacing.sm }}
            />
            <ActionButton
              title="Copy Last Week"
              icon="copy"
              variant="outline"
              onPress={copyLastWeek}
              style={{ flex: 1, marginLeft: theme.spacing.sm }}
            />
          </ThemedView>
          <ActionButton
            title="Add New Meal"
            icon="add"
            variant="primary"
            onPress={() => router.push("/create-meal")}
            style={{ marginTop: theme.spacing.md }}
          />
        </ThemedView>

        {/* Daily Meal Plans */}
        <ThemedView
          style={[
            mealPrepStyles.daysContainer,
            { paddingHorizontal: theme.spacing.lg },
          ]}
        >
          {weekPlans.map((day) => {
            const mealsCount = Object.keys(day.meals).length;
            const weekDay = generateWeekDays(
              currentWeek.startDate
            ).find((d) => d.date === day.date);

            return (
              <ThemedView
                key={day.date}
                style={[
                  mealPrepStyles.dayCard,
                  {
                    backgroundColor: themedColors.backgroundSecondary,
                    borderColor: themedColors.border,
                  },
                ]}
              >
                <ThemedView style={mealPrepStyles.dayHeader}>
                  <ThemedView style={mealPrepStyles.dayInfo}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={mealPrepStyles.dayName}
                    >
                      {day.dayName}
                    </ThemedText>
                    <ThemedText
                      type="default"
                      style={mealPrepStyles.dayDate}
                    >
                      {weekDay?.displayDate || day.date}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={mealPrepStyles.dayProgress}>
                    <ThemedText
                      type="default"
                      style={mealPrepStyles.progressText}
                    >
                      {mealsCount}/4 meals
                    </ThemedText>
                    <ThemedView
                      style={[
                        mealPrepStyles.progressBar,
                        {
                          backgroundColor:
                            themedColors.backgroundTertiary,
                        },
                      ]}
                    >
                      <ThemedView
                        style={[
                          mealPrepStyles.progressFill,
                          {
                            width: `${(mealsCount / 4) * 100}%`,
                            backgroundColor: themedColors.primary,
                          },
                        ]}
                      />
                    </ThemedView>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={mealPrepStyles.mealsGrid}>
                  {mealTypes.map((mealType) =>
                    renderMealSlot(day, mealType.key)
                  )}
                </ThemedView>
              </ThemedView>
            );
          })}
        </ThemedView>

        {/* Bottom Spacing */}
        <ThemedView style={{ height: 100 }} />
      </ScrollView>

      {/* Meal Selection Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Choose ${selectedMealType}`}
        size="large"
      >
        {suggestedMeals.length > 0 ? (
          <FlatList
            data={suggestedMeals}
            renderItem={renderMealSuggestion}
            keyExtractor={(item) => item._id || `meal-${Math.random()}`}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 400 }}
          />
        ) : (
          <ThemedView style={{ alignItems: "center", padding: 20 }}>
            <Ionicons
              name="restaurant-outline"
              size={48}
              color={themedColors.textSecondary}
            />
            <ThemedText style={{ marginTop: 16, textAlign: "center" }}>
              No {selectedMealType} meals found
            </ThemedText>
            <ThemedText
              style={{
                marginTop: 8,
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              Create your first {selectedMealType} meal to add it to
              your planner
            </ThemedText>
            <ActionButton
              title="Create New Meal"
              icon="add"
              onPress={() => {
                setModalVisible(false);
                router.push("/create-meal");
              }}
              style={{ marginTop: 16 }}
            />
          </ThemedView>
        )}
      </Modal>
    </SafeAreaView>
  );
}
