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
