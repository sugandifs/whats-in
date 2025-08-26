import { StyleSheet } from "react-native";
import { baseTheme } from "./theme";

const THEME_COLOR = "#FFB902";

export const pantryPageStyles = StyleSheet.create({
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${THEME_COLOR}20`,
    alignItems: "center",
    justifyContent: "center",
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
    borderWidth: 1,
    borderColor: baseTheme.colors.primary,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },

  tabText: {
    fontSize: baseTheme.typography.sizes.sm,
    marginLeft: 6,
    fontWeight: baseTheme.typography.weights.medium,
  },

  activeTabText: {
    color: "white",
    opacity: 1,
    fontWeight: baseTheme.typography.weights.bold,
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
