import { StyleSheet } from "react-native";
import { baseTheme } from "./theme";

export const pantryPageStyles = StyleSheet.create({
  addButtonContainer: {
    paddingHorizontal: baseTheme.spacing.lg,
    paddingBottom: baseTheme.spacing.lg,
    backgroundColor: "transparent",
  },

  controlsContainer: {
    flexDirection: "row",
    paddingHorizontal: baseTheme.spacing.lg,
    paddingBottom: baseTheme.spacing.lg,
    gap: baseTheme.spacing.md,
    backgroundColor: "transparent",
  },

  sortButton: {
    padding: baseTheme.spacing.md,
    borderRadius: baseTheme.borderRadius.md,
    borderWidth: 1,
  },

  categoriesSection: {
    paddingVertical: baseTheme.spacing.lg,
    backgroundColor: "transparent",
  },

  itemsSection: {
    paddingHorizontal: baseTheme.spacing.lg,
    paddingBottom: 100,
    backgroundColor: "transparent",
  },

  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },

  itemContainer: {
    width: "48%",
    marginBottom: baseTheme.spacing.lg,
    backgroundColor: "transparent",
  },

  itemContainerList: {
    width: "100%",
  },
});

export const recipePageStyles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: baseTheme.spacing.lg,
    paddingVertical: baseTheme.spacing.lg,
    gap: baseTheme.spacing.md,
    backgroundColor: "transparent",
  },

  tabNavigation: {
    flexDirection: "row",
    paddingHorizontal: baseTheme.spacing.lg,
    marginBottom: baseTheme.spacing.lg,
    backgroundColor: "transparent",
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: baseTheme.spacing.md,
    marginHorizontal: 4,
    borderRadius: baseTheme.borderRadius.sm,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },

  tabText: {
    fontSize: baseTheme.typography.sizes.sm,
    marginLeft: 6,
    opacity: 0.7,
  },

  activeTabText: {
    color: "white",
    opacity: 1,
  },

  recipesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },

  recipeCardContainer: {
    width: "48%",
    marginBottom: baseTheme.spacing.lg,
    backgroundColor: "transparent",
  },
});

export const homePageStyles = StyleSheet.create({
  welcomeContainer: {
    borderRadius: baseTheme.borderRadius.lg,
    padding: baseTheme.spacing.xxl,
    marginVertical: baseTheme.spacing.xxl,
    position: "relative",
    overflow: "hidden",
  },

  welcomeTitle: {
    fontSize: baseTheme.typography.sizes.xxl,
    fontWeight: baseTheme.typography.weights.bold,
    color: "#1A1A21",
    marginBottom: baseTheme.spacing.sm,
  },

  welcomeSubtitle: {
    fontSize: baseTheme.typography.sizes.lg,
    color: "#1A1A21",
    marginBottom: baseTheme.spacing.lg,
  },

  generateButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: baseTheme.spacing.md,
    paddingHorizontal: baseTheme.spacing.xxl,
    borderRadius: baseTheme.borderRadius.md,
    alignSelf: "flex-start",
  },

  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: baseTheme.spacing.xxl,
  },

  mainContent: {
    flexDirection: "column",
    marginBottom: 100,
  },

  sidebar: {
    marginTop: baseTheme.spacing.sm,
  },

  sidebarCard: {
    borderRadius: baseTheme.borderRadius.md,
    padding: baseTheme.spacing.lg,
    marginBottom: baseTheme.spacing.xxl,
    ...baseTheme.shadows.sm,
    borderWidth: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: baseTheme.spacing.lg,
    backgroundColor: "transparent",
  },

  viewAllButton: {
    fontSize: baseTheme.typography.sizes.md,
    fontWeight: baseTheme.typography.weights.semibold,
  },
  quickActionCard: {
    borderRadius: baseTheme.borderRadius.md,
    padding: baseTheme.spacing.lg,
    width: "48%",
    marginBottom: baseTheme.spacing.lg,
    alignItems: "center",
    ...baseTheme.shadows.sm,
    borderWidth: 1,
  },

  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: baseTheme.spacing.md,
  },

  quickActionText: {
    fontSize: baseTheme.typography.sizes.md,
    fontWeight: baseTheme.typography.weights.semibold,
    textAlign: "center",
  },
});

export const recipeDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
  },
  recipeHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: "transparent",
  },
  recipeEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 34,
  },
  recipeDescription: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    backgroundColor: "transparent",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 20,
  },
  ingredientsList: {
    backgroundColor: "transparent",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: baseTheme.colors.primary,
    marginTop: 6,
    marginRight: 16,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
  },
  instructionsList: {
    backgroundColor: "transparent",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${baseTheme.colors.primary}30`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    marginTop: 2,
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: baseTheme.colors.primary,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "transparent",
  },
  tag: {
    backgroundColor: `${baseTheme.colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${baseTheme.colors.primary}30`,
  },
  tagText: {
    fontSize: 14,
    color: baseTheme.colors.primary,
    fontWeight: "500",
  },
  infoList: {
    backgroundColor: "transparent",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: "transparent",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  editButton: {
    borderColor: baseTheme.colors.primary,
    backgroundColor: `${baseTheme.colors.primary}10`,
  },
  deleteButton: {
    borderColor: "#ef4444",
    backgroundColor: "#ef444410",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export const mealPrepStyles = StyleSheet.create({
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
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
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
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
    backgroundColor: "transparent",
  },
  daysContainer: {
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  dayCard: {
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
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
  },
  addMealText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
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
