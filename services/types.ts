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
