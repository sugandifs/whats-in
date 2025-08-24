export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  firstName: string;
  lastName: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  dietaryRestrictions?: string[];
  cuisinePreferences?: string[];
  defaultServings?: number;
}

export interface Recipe {
  _id: string;
  userId: string;
  name: string;
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: string;
  cookTime: string;
  servings: number;
  rating: number;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  isOwned: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeData {
  name: string;
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: string;
  cookTime: string;
  servings: string;
  rating?: number;
  image?: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  isFavorite?: boolean;
}

export interface CreateProfileData {
  firstName: string;
  lastName: string;
  preferences: UserPreferences;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthTokenResponse {
  token: string;
  user: User;
}

// Add these to your existing types.ts file

export interface PantryItem {
  _id: string;
  name: string;
  category: "fresh" | "dairy" | "meat" | "pantry" | "frozen";
  quantity: number;
  unit:
    | "piece"
    | "lb"
    | "kg"
    | "oz"
    | "g"
    | "cup"
    | "tbsp"
    | "tsp"
    | "bottle"
    | "package";
  expirationDate: Date;
  purchaseDate: Date;
  location: "fridge" | "freezer" | "pantry" | "counter";
  emoji: string;
  notes?: string;
  barcode?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  daysUntilExpiration?: number;
  expirationStatus?: {
    status: string;
    color: string;
    text: string;
  };
}

export interface CreatePantryItemData {
  name: string;
  category: "fresh" | "dairy" | "meat" | "pantry" | "frozen";
  quantity: number;
  unit:
    | "piece"
    | "lb"
    | "kg"
    | "oz"
    | "g"
    | "cup"
    | "tbsp"
    | "tsp"
    | "bottle"
    | "package";
  expirationDate: Date;
  purchaseDate?: Date;
  location: "fridge" | "freezer" | "pantry" | "counter";
  emoji?: string;
  notes?: string;
  barcode?: string;
}

export interface PantryStats {
  totalItems: number;
  expiringSoon: number;
  expired: number;
  categories: {
    fresh: number;
    dairy: number;
    meat: number;
    pantry: number;
    frozen: number;
  };
}

// Add these types to your existing types.ts file

// ============ MEAL TYPES ============

export interface Meal {
  _id?: string;
  id: string;
  userId?: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  emoji: string;
  prepTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients?: string[];
  instructions?: string[];
  notes?: string;
  isCustom?: boolean;
  recipeId?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  tags?: string[];
  servings?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMealData {
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  emoji?: string;
  prepTime?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  ingredients?: string[];
  instructions?: string[];
  notes?: string;
  userId: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  tags?: string[];
  servings?: number;
}

// ============ MEAL PLAN TYPES ============

export interface MealPlan {
  _id?: string;
  id?: string;
  userId: string;
  date: string;
  dayName: string;
  meals: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
    snack?: Meal;
  };
  notes?: string;
  totalCalories?: number;
  isComplete?: boolean;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  formattedDate?: string;
}

export interface CreateMealPlanData {
  date: string;
  dayName: string;
  meals: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
    snack?: Meal;
  };
  notes?: string;
}

// ============ MEAL PLAN STATISTICS ============

export interface MealPlanStats {
  totalPlans: number;
  totalMeals: number;
  completeDays: number;
  avgMealsPerDay: number;
  weeklyCompletion: number;
  monthlyCompletion: number;
  favoriteBreakfast?: Meal;
  favoriteLunch?: Meal;
  favoriteDinner?: Meal;
  favoriteSnack?: Meal;
  nutritionSummary?: {
    avgCaloriesPerDay: number;
    avgProteinPerDay: number;
    avgCarbsPerDay: number;
    avgFatPerDay: number;
  };
}

// ============ MEAL GENERATION TYPES ============

export interface MealGenerationPreferences {
  dietaryRestrictions?: string[];
  excludeIngredients?: string[];
  includeIngredients?: string[];
  maxPrepTime?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  cuisine?: string;
  mealTypes?: ("breakfast" | "lunch" | "dinner" | "snack")[];
}

export interface WeeklyMealPlanGeneration {
  startDate: string;
  preferences?: MealGenerationPreferences;
  includeSnacks?: boolean;
  skipDays?: string[]; // Skip specific days of the week
}

// ============ MEAL FILTERS AND SEARCH ============

export interface MealFilters {
  type?: "breakfast" | "lunch" | "dinner" | "snack";
  difficulty?: "Easy" | "Medium" | "Hard";
  prepTimeMax?: string;
  isCustom?: boolean;
  hasNutrition?: boolean;
  tags?: string[];
  searchQuery?: string;
}

export interface MealPlanFilters {
  startDate?: string;
  endDate?: string;
  isComplete?: boolean;
  hasNotes?: boolean;
  minMeals?: number;
  maxMeals?: number;
}

// ============ NUTRITION TYPES ============

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar?: number; // grams
  sodium?: number; // milligrams
  cholesterol?: number; // milligrams
  vitamins?: {
    [key: string]: number; // vitamin name -> amount
  };
  minerals?: {
    [key: string]: number; // mineral name -> amount
  };
}

export interface DailyNutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
}

// ============ MEAL PLAN EXPORT/IMPORT TYPES ============

export interface MealPlanExport {
  version: string;
  exportDate: string;
  userId: string;
  mealPlans: MealPlan[];
  meals: Meal[];
  preferences?: MealGenerationPreferences;
}

export interface MealPlanImport {
  mealPlans: CreateMealPlanData[];
  meals: CreateMealData[];
  overwriteExisting?: boolean;
}

// ============ GROCERY LIST INTEGRATION ============

export interface GroceryListFromMealPlan {
  mealPlanIds: string[];
  consolidateIngredients?: boolean;
  includeQuantities?: boolean;
  groupByCategory?: boolean;
}

export interface GeneratedGroceryList {
  items: {
    name: string;
    quantity?: string;
    category?: string;
    fromMeals: string[]; // meal names that require this ingredient
    notes?: string;
  }[];
  totalItems: number;
  estimatedCost?: number;
  generatedAt: string;
}

// ============ MEAL PLAN SHARING ============

export interface SharedMealPlan {
  id: string;
  title: string;
  description?: string;
  shareCode: string;
  mealPlan: MealPlan;
  sharedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  isPublic: boolean;
  shareUrl: string;
  expiresAt?: string;
  createdAt: string;
}

// ============ MEAL PLAN TEMPLATES ============

export interface MealPlanTemplate {
  id: string;
  name: string;
  description?: string;
  category:
    | "weight-loss"
    | "muscle-gain"
    | "vegetarian"
    | "keto"
    | "mediterranean"
    | "custom";
  difficulty: "Easy" | "Medium" | "Hard";
  duration: "1-week" | "2-weeks" | "1-month";
  meals: {
    [day: string]: {
      breakfast?: Meal;
      lunch?: Meal;
      dinner?: Meal;
      snack?: Meal;
    };
  };
  nutritionGoals?: DailyNutritionGoals;
  tags: string[];
  rating?: number;
  usedCount?: number;
  createdBy?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============ EXTENDED EXISTING TYPES ============

// Extend the existing Recipe interface if needed
export interface RecipeWithMealInfo extends Recipe {
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  isUsedInMealPlan?: boolean;
  lastUsedInMealPlan?: string;
}

// Extend User interface for meal planning preferences
export interface UserMealPreferences {
  defaultMealTypes: ("breakfast" | "lunch" | "dinner" | "snack")[];
  dietaryRestrictions: string[];
  allergies: string[];
  dislikedIngredients: string[];
  preferredCuisines: string[];
  cookingSkillLevel: "beginner" | "intermediate" | "advanced";
  maxPrepTime: string;
  defaultServings: number;
  nutritionGoals?: DailyNutritionGoals;
  mealPlanningDays: (
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  )[];
}

// ============ API RESPONSE TYPES ============

export interface MealApiResponse {
  success: boolean;
  data: Meal;
  message?: string;
}

export interface MealPlanApiResponse {
  success: boolean;
  data: MealPlan;
  message?: string;
}

export interface MealListApiResponse {
  success: boolean;
  data: Meal[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface MealPlanListApiResponse {
  success: boolean;
  data: MealPlan[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// ============ ERROR TYPES ============

export interface MealPlanError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface ValidationError extends MealPlanError {
  code: "VALIDATION_ERROR";
  field: string;
  value?: any;
}

export interface NotFoundError extends MealPlanError {
  code: "NOT_FOUND";
  resource: "meal" | "meal-plan";
  id: string;
}

export interface PermissionError extends MealPlanError {
  code: "PERMISSION_DENIED";
  action: string;
  resource: string;
}
