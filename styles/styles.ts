import { StyleSheet } from "react-native";
import { baseTheme } from "./theme";

export const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: baseTheme.spacing.lg,
  },
  contentContainer: {
    paddingHorizontal: baseTheme.spacing.lg,
  },

  contentWithBottomPadding: {
    paddingHorizontal: baseTheme.spacing.lg,
    paddingBottom: 100,
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Headers
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: baseTheme.spacing.lg,
    paddingVertical: baseTheme.spacing.lg,
    borderBottomWidth: 1,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
  },

  headerText: {
    backgroundColor: "transparent",
  },

  headerTitle: {
    fontSize: baseTheme.typography.sizes.xl,
    fontWeight: baseTheme.typography.weights.bold,
  },

  headerSubtitle: {
    fontSize: baseTheme.typography.sizes.md,
    opacity: 0.7,
  },

  backButton: {
    marginRight: baseTheme.spacing.md,
  },

  headerAction: {
    padding: baseTheme.spacing.sm,
  },

  // Cards
  card: {
    borderRadius: baseTheme.borderRadius.md,
    borderWidth: 1,
    ...baseTheme.shadows.sm,
  },

  cardPadding: {
    padding: baseTheme.spacing.lg,
  },

  // Buttons
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: baseTheme.spacing.md,
    paddingHorizontal: baseTheme.spacing.xl,
    borderRadius: baseTheme.borderRadius.md,
  },

  buttonText: {
    fontSize: baseTheme.typography.sizes.lg,
    fontWeight: baseTheme.typography.weights.semibold,
    color: "white",
  },

  // Forms
  formGroup: {
    marginBottom: baseTheme.spacing.lg,
    backgroundColor: "transparent",
  },

  formLabel: {
    fontSize: baseTheme.typography.sizes.md,
    fontWeight: baseTheme.typography.weights.semibold,
    marginBottom: baseTheme.spacing.sm,
  },

  formInput: {
    borderWidth: 1,
    borderRadius: baseTheme.borderRadius.sm,
    padding: baseTheme.spacing.md,
    fontSize: baseTheme.typography.sizes.lg,
    minHeight: 44,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalContent: {
    borderTopLeftRadius: baseTheme.borderRadius.xl,
    borderTopRightRadius: baseTheme.borderRadius.xl,
    maxHeight: "85%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: baseTheme.spacing.xl,
    borderBottomWidth: 1,
    backgroundColor: "transparent",
  },

  modalTitle: {
    fontSize: baseTheme.typography.sizes.xl,
    fontWeight: baseTheme.typography.weights.semibold,
  },

  modalBody: {
    padding: baseTheme.spacing.xl,
  },

  // Empty states
  emptyState: {
    alignItems: "center",
    paddingVertical: baseTheme.spacing.xxxl * 1.5,
    borderRadius: baseTheme.borderRadius.md,
    borderWidth: 1,
    marginHorizontal: baseTheme.spacing.lg,
  },

  emptyText: {
    marginTop: baseTheme.spacing.md,
    marginBottom: baseTheme.spacing.sm,
    opacity: 0.7,
    textAlign: "center",
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: baseTheme.spacing.lg,
    paddingVertical: baseTheme.spacing.lg,
    gap: baseTheme.spacing.md,
    backgroundColor: "transparent",
  },

  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: baseTheme.spacing.md,
    borderRadius: baseTheme.borderRadius.md,
    borderWidth: 1,
  },

  statNumber: {
    fontSize: baseTheme.typography.sizes.xl,
    fontWeight: baseTheme.typography.weights.bold,
  },

  statLabel: {
    fontSize: baseTheme.typography.sizes.xs,
    opacity: 0.7,
    marginTop: baseTheme.spacing.xs,
  },
});
