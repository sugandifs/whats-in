import { baseTheme } from "../styles/theme";

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "#10b981";
    case "medium":
      return "#f59e0b";
    case "hard":
      return "#ef4444";
    default:
      return baseTheme.colors.primary;
  }
};

export const getCategoryColor = (categoryId: string) => {
  return (
    baseTheme.colors.categories[
      categoryId as keyof typeof baseTheme.colors.categories
    ] || baseTheme.colors.primary
  );
};

export const getExpirationStatus = (expirationDate: Date | string) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0)
    return { status: "expired", color: "#ef4444", text: "Expired" };
  if (days === 0)
    return { status: "today", color: "#f59e0b", text: "Today" };
  if (days <= 2)
    return { status: "urgent", color: "#ef4444", text: `${days}d` };
  if (days <= 7)
    return { status: "soon", color: "#f59e0b", text: `${days}d` };
  return { status: "good", color: "#10b981", text: `${days}d` };
};

export const createShadow = (elevation: number) => ({
  shadowColor: "#000",
  shadowOffset: { width: 0, height: elevation / 2 },
  shadowOpacity: 0.1,
  shadowRadius: elevation,
  elevation,
});
