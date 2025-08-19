export const CONSTANTS = {
  THEME_COLOR: "#FFB902",

  SCREEN_NAMES: {
    HOME: "index",
    RECIPES: "recipes",
    PANTRY: "pantry",
    GROCERY: "grocery",
    PLANNER: "mealprep",
    GENERATE_RECIPE: "generate-recipe",
  } as const,

  STORAGE_KEYS: {
    USER_PREFERENCES: "user_preferences",
    THEME_MODE: "theme_mode",
    ONBOARDING_COMPLETED: "onboarding_completed",
  } as const,

  DIFFICULTY_LEVELS: ["Easy", "Medium", "Hard"] as const,

  MEAL_TYPES: ["breakfast", "lunch", "dinner", "snack"] as const,

  CATEGORIES: [
    {
      id: "fresh",
      name: "Fresh Produce",
      icon: "leaf",
      color: "#22c55e",
    },
    { id: "dairy", name: "Dairy", icon: "water", color: "#3b82f6" },
    { id: "meat", name: "Meat & Fish", icon: "fish", color: "#ef4444" },
    { id: "pantry", name: "Pantry", icon: "archive", color: "#8b5cf6" },
    { id: "frozen", name: "Frozen", icon: "snow", color: "#06b6d4" },
    {
      id: "bakery",
      name: "Bakery",
      icon: "restaurant",
      color: "#f59e0b",
    },
  ] as const,

  UNITS: [
    "piece",
    "lb",
    "kg",
    "oz",
    "g",
    "cup",
    "tbsp",
    "tsp",
    "bottle",
    "package",
    "box",
    "bag",
    "bunch",
    "dozen",
    "gallon",
    "loaf",
  ] as const,

  LOCATIONS: [
    { id: "fridge", name: "Refrigerator", icon: "snow" },
    { id: "freezer", name: "Freezer", icon: "cube" },
    { id: "pantry", name: "Pantry", icon: "archive" },
    { id: "counter", name: "Counter", icon: "home" },
  ] as const,
};
