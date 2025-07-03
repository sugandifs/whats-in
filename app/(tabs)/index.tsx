import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

const THEME_COLOR = "#FFB902";

export default function MealPrepHome() {
  const [activeTab, setActiveTab] = useState("home");
  const colorScheme = useColorScheme();

  const recentRecipes = [
    {
      id: 1,
      name: "Mediterranean Bowl",
      time: "25 min",
      rating: 4.8,
      image: "🥗",
    },
    {
      id: 2,
      name: "Chicken Stir Fry",
      time: "20 min",
      rating: 4.6,
      image: "🍗",
    },
    {
      id: 3,
      name: "Veggie Pasta",
      time: "30 min",
      rating: 4.7,
      image: "🍝",
    },
  ];

  const expiringItems = [
    { name: "Spinach", days: 2 },
    { name: "Bell Peppers", days: 3 },
    { name: "Greek Yogurt", days: 4 },
  ];

  const quickActions = [
    { icon: "add" as IoniconsName, label: "Add Inventory" },
    { icon: "cart" as IoniconsName, label: "Grocery List" },
    { icon: "calendar" as IoniconsName, label: "Meal Planner" },
    { icon: "book" as IoniconsName, label: "My Recipes" },
  ];

  const navigationTabs = [
    { id: "home", icon: "home" as IoniconsName, label: "Home" },
    { id: "recipes", icon: "book" as IoniconsName, label: "Recipes" },
    { id: "plan", icon: "calendar" as IoniconsName, label: "Plan" },
    {
      id: "inventory",
      icon: "add-circle" as IoniconsName,
      label: "Inventory",
    },
  ];

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
          <ThemedView style={styles.logoContainer}>
            <Ionicons
              name={"restaurant" as IoniconsName}
              size={24}
              color="white"
            />
          </ThemedView>
          <ThemedView style={styles.headerText}>
            <ThemedText type="title" style={styles.headerTitle}>
              what's in
            </ThemedText>
            <ThemedText type="default" style={styles.headerSubtitle}>
              your pantry, your chef
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name={"search" as IoniconsName}
              size={20}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name={"notifications" as IoniconsName}
              size={20}
              color={colorScheme === "dark" ? "#fff" : "#666"}
            />
            <ThemedView style={styles.notificationDot} />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <ThemedView style={styles.welcomeContainer}>
          <ThemedText type="title" style={styles.welcomeTitle}>
            Good morning, [name]!
          </ThemedText>
          <ThemedText type="default" style={styles.welcomeSubtitle}>
            Ready to create something delicious with what you have?
          </ThemedText>
          <TouchableOpacity style={styles.generateButton}>
            <Ionicons
              name={"add" as IoniconsName}
              size={20}
              color="#333"
              style={styles.generateButtonIcon}
            />
            <ThemedText
              type="defaultSemiBold"
              style={styles.generateButtonText}
            >
              Generate Recipe
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionCard}
            >
              <ThemedView style={styles.quickActionIcon}>
                <Ionicons
                  name={action.icon as IoniconsName}
                  size={24}
                  color={THEME_COLOR}
                />
              </ThemedView>
              <ThemedText
                type="defaultSemiBold"
                style={styles.quickActionText}
              >
                {action.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.mainContent}>
          {/* Recent Recipes */}
          <ThemedView style={styles.recentRecipesContainer}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedText type="subtitle">Recent Recipes</ThemedText>
              <TouchableOpacity>
                <ThemedText type="link" style={styles.viewAllButton}>
                  View All
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {recentRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
              >
                <ThemedText style={styles.recipeEmoji}>
                  {recipe.image}
                </ThemedText>
                <ThemedView style={styles.recipeInfo}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.recipeName}
                  >
                    {recipe.name}
                  </ThemedText>
                  <ThemedView style={styles.recipeDetails}>
                    <ThemedView style={styles.recipeDetailItem}>
                      <Ionicons
                        name={"time" as IoniconsName}
                        size={16}
                        color={colorScheme === "dark" ? "#fff" : "#666"}
                      />
                      <ThemedText
                        type="default"
                        style={styles.recipeDetailText}
                      >
                        {recipe.time}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.recipeDetailItem}>
                      <Ionicons
                        name={"star" as IoniconsName}
                        size={16}
                        color={THEME_COLOR}
                      />
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.recipeRating}
                      >
                        {recipe.rating}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                <TouchableOpacity style={styles.recipeAction}>
                  <Ionicons
                    name={"add" as IoniconsName}
                    size={20}
                    color={colorScheme === "dark" ? "#fff" : "#999"}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ThemedView>

          {/* Sidebar Content */}
          <ThemedView style={styles.sidebar}>
            {/* Expiring Soon */}
            <ThemedView style={styles.sidebarCard}>
              <ThemedView style={styles.expiringSoonHeader}>
                <ThemedView style={styles.expiringDot} />
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.sidebarCardTitle}
                >
                  Expiring Soon
                </ThemedText>
              </ThemedView>
              {expiringItems.map((item, index) => (
                <ThemedView key={index} style={styles.expiringItem}>
                  <ThemedText
                    type="default"
                    style={styles.expiringItemName}
                  >
                    {item.name}
                  </ThemedText>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.expiringItemDays}
                  >
                    {item.days}d
                  </ThemedText>
                </ThemedView>
              ))}
              <TouchableOpacity style={styles.sidebarButton}>
                <ThemedText
                  type="link"
                  style={styles.sidebarButtonText}
                >
                  Use These First
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* This Week's Plan */}
            <ThemedView style={styles.sidebarCard}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.sidebarCardTitle}
              >
                This Week's Plan
              </ThemedText>
              <ThemedView style={styles.weekPlanItem}>
                <ThemedText type="default" style={styles.weekDay}>
                  Mon
                </ThemedText>
                <ThemedText type="default" style={styles.weekMeal}>
                  Chicken Teriyaki
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.weekPlanItem}>
                <ThemedText type="default" style={styles.weekDay}>
                  Tue
                </ThemedText>
                <ThemedText type="default" style={styles.weekMealEmpty}>
                  Not planned
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.weekPlanItem}>
                <ThemedText type="default" style={styles.weekDay}>
                  Wed
                </ThemedText>
                <ThemedText type="default" style={styles.weekMeal}>
                  Veggie Stir Fry
                </ThemedText>
              </ThemedView>
              <TouchableOpacity style={styles.sidebarButton}>
                <ThemedText
                  type="link"
                  style={styles.sidebarButtonText}
                >
                  Complete Week
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* Quick Stats */}
            <ThemedView style={styles.sidebarCard}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.sidebarCardTitle}
              >
                Quick Stats
              </ThemedText>
              <ThemedView style={styles.statItem}>
                <ThemedText type="default" style={styles.statLabel}>
                  Recipes Saved
                </ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.statValue}
                >
                  24
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem}>
                <ThemedText type="default" style={styles.statLabel}>
                  This Month
                </ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.statValue}
                >
                  8 meals
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.statItem}>
                <ThemedText type="default" style={styles.statLabel}>
                  Avg Rating
                </ThemedText>
                <ThemedView style={styles.ratingContainer}>
                  <Ionicons
                    name={"star" as IoniconsName}
                    size={16}
                    color={THEME_COLOR}
                  />
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.statValue}
                  >
                    4.7
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Bottom Navigation */}
      <ThemedView style={styles.bottomNavigation}>
        {navigationTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              styles.navTab,
              activeTab === tab.id && styles.activeNavTab,
            ]}
          >
            <Ionicons
              name={tab.icon as IoniconsName}
              size={20}
              color={
                activeTab === tab.id
                  ? "white"
                  : colorScheme === "dark"
                  ? "#fff"
                  : "#666"
              }
            />
            <ThemedText
              style={[
                styles.navTabLabel,
                activeTab === tab.id && styles.activeNavTabLabel,
              ]}
            >
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f1e9",
  },
  header: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME_COLOR,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeContainer: {
    backgroundColor: THEME_COLOR,
    borderRadius: 16,
    padding: 24,
    marginVertical: 24,
    position: "relative",
    overflow: "hidden",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A21",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#1A1A21",
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  generateButtonIcon: {
    marginRight: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  welcomeEmoji: {
    position: "absolute",
    right: 16,
    top: 16,
    fontSize: 64,
    opacity: 0.2,
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickActionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  mainContent: {
    flexDirection: "column",
    marginBottom: 100,
  },
  recentRecipesContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLOR,
  },
  recipeCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  recipeEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  recipeDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  recipeDetailText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  recipeRating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 4,
  },
  recipeAction: {
    padding: 8,
  },
  sidebar: {
    marginTop: 8,
  },
  sidebarCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sidebarCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  expiringSoonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  expiringDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    marginRight: 8,
  },
  expiringItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  expiringItemName: {
    fontSize: 14,
    color: "#374151",
  },
  expiringItemDays: {
    fontSize: 14,
    fontWeight: "500",
    color: "#dc2626",
  },
  sidebarButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  sidebarButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_COLOR,
  },
  weekPlanItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  weekDay: {
    fontSize: 14,
    color: "#6b7280",
  },
  weekMeal: {
    fontSize: 14,
    color: "#111827",
  },
  weekMealEmpty: {
    fontSize: 14,
    color: "#9ca3af",
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeNavTab: {
    backgroundColor: THEME_COLOR,
  },
  navTabLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 4,
  },
  activeNavTabLabel: {
    color: "white",
  },
});
