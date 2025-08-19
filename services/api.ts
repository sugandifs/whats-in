import { auth } from "../config/firebase";
import {
  CreatePantryItemData,
  CreateProfileData,
  CreateRecipeData,
  PantryItem,
  PantryStats,
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

  async getFavoriteRecipes(): Promise<Recipe[]> {
    return this.request<Recipe[]>("/recipes/favorites");
  }

  async createRecipe(recipeData: CreateRecipeData): Promise<Recipe> {
    return this.request<Recipe>("/recipes", {
      method: "POST",
      body: JSON.stringify(recipeData),
    });
  }

  async updateRecipe(
    recipeId: string,
    recipeData: Partial<CreateRecipeData>
  ): Promise<Recipe> {
    return this.request<Recipe>(`/recipes/${recipeId}`, {
      method: "PUT",
      body: JSON.stringify(recipeData),
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

  async addToFavorites(recipeId: string): Promise<Recipe> {
    const result = this.request<Recipe>(
      `/recipes/${recipeId}/favorite`,
      {
        method: "POST",
      }
    );
    console.log("addToFavorites API result:", result);
    return result;
  }

  async removeFromFavorites(recipeId: string): Promise<Recipe> {
    const result = this.request<Recipe>(
      `/recipes/${recipeId}/favorite`,
      {
        method: "DELETE",
      }
    );
    console.log("removeFromFavorites API result:", result);
    return result;
  }

  async generateRecipe(generationData: {
    selectedIngredients?: string[];
    cuisine?: string;
    style?: string;
    prepTime?: string;
    dietaryRestrictions?: string[];
    additionalPrompt?: string;
  }): Promise<Recipe> {
    return this.request<Recipe>("/recipes/generate", {
      method: "POST",
      body: JSON.stringify(generationData),
    });
  }

  // Pantry methods
  async getPantryItems(filters?: {
    category?: string;
    location?: string;
    sortBy?: string;
  }): Promise<PantryItem[]> {
    const queryParams = new URLSearchParams();
    if (filters?.category)
      queryParams.append("category", filters.category);
    if (filters?.location)
      queryParams.append("location", filters.location);
    if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);

    const query = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";
    return this.request<PantryItem[]>(`/pantry${query}`);
  }

  async getPantryStats(): Promise<PantryStats> {
    return this.request<PantryStats>("/pantry/stats");
  }

  async getExpiringItems(days: number = 7): Promise<PantryItem[]> {
    return this.request<PantryItem[]>(`/pantry/expiring?days=${days}`);
  }

  async searchPantryItems(query: string): Promise<PantryItem[]> {
    return this.request<PantryItem[]>(
      `/pantry/search?query=${encodeURIComponent(query)}`
    );
  }

  async getPantryItem(itemId: string): Promise<PantryItem> {
    return this.request<PantryItem>(`/pantry/${itemId}`);
  }

  async createPantryItem(
    itemData: CreatePantryItemData
  ): Promise<PantryItem> {
    return this.request<PantryItem>("/pantry", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  }

  async createPantryItemsBulk(
    items: CreatePantryItemData[]
  ): Promise<PantryItem[]> {
    return this.request<PantryItem[]>("/pantry/bulk", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  }

  async updatePantryItem(
    itemId: string,
    itemData: Partial<CreatePantryItemData>
  ): Promise<PantryItem> {
    return this.request<PantryItem>(`/pantry/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
  }

  async updatePantryItemQuantity(
    itemId: string,
    quantity: number
  ): Promise<PantryItem> {
    return this.request<PantryItem>(`/pantry/${itemId}/quantity`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  }

  async deletePantryItem(itemId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/pantry/${itemId}`, {
      method: "DELETE",
    });
  }

  async deletePantryItemsBulk(
    itemIds: string[]
  ): Promise<{ message: string; deletedCount: number }> {
    return this.request<{ message: string; deletedCount: number }>(
      "/pantry/bulk/delete",
      {
        method: "DELETE",
        body: JSON.stringify({ itemIds }),
      }
    );
  }

  async scanBarcode(barcode: string): Promise<{
    success: boolean;
    item: Partial<PantryItem>;
    message: string;
  }> {
    return this.request("/pantry/barcode", {
      method: "POST",
      body: JSON.stringify({ barcode }),
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
