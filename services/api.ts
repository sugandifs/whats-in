import { auth } from "../config/firebase";
import {
  CreateProfileData,
  CreateRecipeData,
  Recipe,
  User,
} from "./types";

const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api"
  : "https://your-production-api.com/api";

class ApiService {
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    throw new Error("No authenticated user");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const token = await this.getAuthToken();

      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      };

      // Fix: Properly handle body serialization
      if (options.body && typeof options.body === "object") {
        config.body = JSON.stringify(options.body);
      } else if (options.body) {
        config.body = options.body;
      }

      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        config
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  // User profile methods
  async createProfile(profileData: CreateProfileData): Promise<User> {
    return this.request<User>("/auth/profile", {
      method: "POST",
      body: JSON.stringify(profileData), // Fix: Stringify here
    });
  }

  async getProfile(): Promise<User> {
    return this.request<User>("/auth/profile");
  }

  async updateProfile(
    profileData: Partial<CreateProfileData>
  ): Promise<User> {
    return this.request<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData), // Fix: Stringify here
    });
  }

  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    return this.request<Recipe[]>("/recipes");
  }

  async getRecipe(recipeId: string): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${recipeId}`);
  }

  async createRecipe(recipeData: CreateRecipeData): Promise<Recipe> {
    return this.request<Recipe>("/recipes", {
      method: "POST",
      body: JSON.stringify(recipeData), // Fix: Stringify here
    });
  }

  async updateRecipe(
    recipeId: string,
    recipeData: Partial<CreateRecipeData>
  ): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${recipeId}`, {
      method: "PUT",
      body: JSON.stringify(recipeData), // Fix: Stringify here
    });
  }

  async deleteRecipe(recipeId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/recipes/${recipeId}`, {
      method: "DELETE",
    });
  }

  async toggleFavorite(recipeId: string): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${recipeId}/favorite`, {
      method: "PATCH",
    });
  }

  // Pantry methods (for future use)
  async getPantryItems(): Promise<any[]> {
    return this.request<any[]>("/pantry");
  }

  async createPantryItem(itemData: any): Promise<any> {
    return this.request<any>("/pantry", {
      method: "POST",
      body: JSON.stringify(itemData), // Fix: Stringify here
    });
  }

  // Meal plans methods (for future use)
  async getMealPlans(): Promise<any[]> {
    return this.request<any[]>("/meal-plans");
  }

  async createMealPlan(planData: any): Promise<any> {
    return this.request<any>("/meal-plans", {
      method: "POST",
      body: JSON.stringify(planData), // Fix: Stringify here
    });
  }
}

export default new ApiService();
