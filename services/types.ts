// services/types.ts

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
  servings: number;
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
