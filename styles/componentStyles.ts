import { StyleSheet } from "react-native";
import { baseTheme } from "./theme";

export const componentStyles = StyleSheet.create({
  // Recipe cards
  recipeCard: {
    borderRadius: baseTheme.borderRadius.md,
    borderWidth: 1,
    overflow: "hidden",
  },

  recipeImageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: baseTheme.spacing.xl,
  },

  recipeEmoji: {
    fontSize: 48,
  },

  recipeInfo: {
    padding: baseTheme.spacing.md,
    backgroundColor: "transparent",
  },

  recipeName: {
    fontSize: baseTheme.typography.sizes.md,
    fontWeight: baseTheme.typography.weights.semibold,
    marginBottom: 2,
  },

  recipeStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: baseTheme.spacing.sm,
    backgroundColor: "transparent",
  },

  recipeStat: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  recipeStatText: {
    fontSize: baseTheme.typography.sizes.xs,
    marginLeft: baseTheme.spacing.xs,
    opacity: 0.7,
  },

  // Pantry items
  itemCard: {
    borderRadius: baseTheme.borderRadius.md,
    borderWidth: 1,
    padding: baseTheme.spacing.md,
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: baseTheme.spacing.sm,
    backgroundColor: "transparent",
  },

  itemEmoji: {
    fontSize: baseTheme.spacing.xxxl,
  },

  itemName: {
    fontSize: baseTheme.typography.sizes.md,
    fontWeight: baseTheme.typography.weights.semibold,
    marginBottom: 2,
  },

  itemQuantity: {
    fontSize: baseTheme.typography.sizes.sm,
    opacity: 0.7,
    marginBottom: baseTheme.spacing.sm,
  },

  // Badges and tags
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: baseTheme.spacing.md,
    paddingVertical: baseTheme.spacing.xs,
    borderRadius: baseTheme.borderRadius.full,
    gap: baseTheme.spacing.xs,
  },

  badgeText: {
    color: "white",
    fontSize: baseTheme.typography.sizes.xs,
    fontWeight: baseTheme.typography.weights.semibold,
  },

  tag: {
    paddingHorizontal: baseTheme.spacing.sm,
    paddingVertical: baseTheme.spacing.xs,
    borderRadius: baseTheme.borderRadius.md,
    borderWidth: 1,
  },

  tagText: {
    fontSize: baseTheme.typography.sizes.sm,
    fontWeight: baseTheme.typography.weights.medium,
  },

  // Expiration badges
  expirationBadge: {
    paddingHorizontal: baseTheme.spacing.sm,
    paddingVertical: 2,
    borderRadius: baseTheme.spacing.sm,
  },

  expirationText: {
    fontSize: baseTheme.typography.sizes.xs,
    color: "white",
    fontWeight: baseTheme.typography.weights.semibold,
  },

  // Category options
  categoryCard: {
    alignItems: "center",
    paddingVertical: baseTheme.spacing.md,
    paddingHorizontal: baseTheme.spacing.lg,
    marginRight: baseTheme.spacing.md,
    borderRadius: baseTheme.borderRadius.md,
    borderWidth: 1,
    minWidth: 80,
  },

  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: baseTheme.spacing.sm,
  },

  categoryName: {
    fontSize: baseTheme.typography.sizes.sm,
    fontWeight: baseTheme.typography.weights.semibold,
    textAlign: "center",
    marginBottom: baseTheme.spacing.xs,
  },

  categoryCount: {
    fontSize: baseTheme.typography.sizes.xs,
    opacity: 0.7,
  },

  // Quick actions
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
