import { auth } from "../config/firebase";
import {
  CreateMealData,
  CreateMealPlanData,
  CreatePantryItemData,
  CreateProfileData,
  CreateRecipeData,
  Meal,
  MealPlan,
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

  async importRecipe(url: string): Promise<Recipe> {
    return this.request<Recipe>("/recipes/import", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
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

  // ============ MEAL METHODS ============
  async getUserMeals(): Promise<Meal[]> {
    return this.request<Meal[]>("/meals");
  }

  async getMeal(mealId: string): Promise<Meal> {
    return this.request<Meal>(`/meals/${mealId}`);
  }

  async createMeal(mealData: CreateMealData): Promise<Meal> {
    return this.request<Meal>("/meals", {
      method: "POST",
      body: JSON.stringify(mealData),
    });
  }

  async updateMeal(
    mealId: string,
    updateData: Partial<CreateMealData>
  ): Promise<Meal> {
    return this.request<Meal>(`/meals/${mealId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteMeal(mealId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/meals/${mealId}`, {
      method: "DELETE",
    });
  }

  // ============ MEAL PLAN METHODS ============

  async getMealPlans(
    startDate: string,
    endDate: string
  ): Promise<MealPlan[]> {
    return this.request<MealPlan[]>(
      `/meal-plans?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Get meal plan for a specific date
   */
  async getMealPlan(date: string): Promise<MealPlan> {
    return this.request<MealPlan>(`/meal-plans/${date}`);
  }

  async createMealPlan(
    mealPlanData: CreateMealPlanData
  ): Promise<MealPlan> {
    return this.request<MealPlan>("/meal-plans", {
      method: "POST",
      body: JSON.stringify(mealPlanData),
    });
  }

  async updateMealPlan(
    mealPlanId: string,
    updateData: Partial<CreateMealPlanData>
  ): Promise<MealPlan> {
    return this.request<MealPlan>(`/meal-plans/${mealPlanId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async deleteMealPlan(
    mealPlanId: string
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/meal-plans/${mealPlanId}`,
      {
        method: "DELETE",
      }
    );
  }

  async removeMealFromPlan(
    mealPlanId: string,
    mealType: "breakfast" | "lunch" | "dinner" | "snack"
  ): Promise<MealPlan> {
    return this.request<MealPlan>(
      `/meal-plans/${mealPlanId}/meals/${mealType}`,
      {
        method: "DELETE",
      }
    );
  }

  async getMealPlanStats(
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalPlans: number;
    totalMeals: number;
    completeDays: number;
    avgMealsPerDay: number;
  }> {
    let url = "/meal-plans/stats/overview";

    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    return this.request(url);
  }

  async copyMealPlan(
    fromDate: string,
    toDate: string
  ): Promise<MealPlan> {
    try {
      // Get the source meal plan
      const sourcePlan = await this.getMealPlan(fromDate);

      // Create new plan with copied data
      const newPlanData: CreateMealPlanData = {
        date: toDate,
        dayName: new Date(toDate).toLocaleDateString("en-US", {
          weekday: "long",
        }),
        meals: sourcePlan.meals,
        notes: sourcePlan.notes || "",
      };

      return await this.createMealPlan(newPlanData);
    } catch (error) {
      console.error("Error copying meal plan:", error);
      throw error;
    }
  }

  async createMealPlans(
    mealPlansData: CreateMealPlanData[]
  ): Promise<MealPlan[]> {
    try {
      const promises = mealPlansData.map((planData) =>
        this.createMealPlan(planData)
      );
      return await Promise.all(promises);
    } catch (error) {
      console.error("Error creating multiple meal plans:", error);
      throw error;
    }
  }

  async generateWeekMealPlan(options: {
    startDate: string;
    preferences?: {
      dietaryRestrictions?: string[];
      excludeIngredients?: string[];
      includeIngredients?: string[];
      maxPrepTime?: string;
      difficulty?: "Easy" | "Medium" | "Hard";
    };
  }): Promise<MealPlan[]> {
    return this.request<MealPlan[]>("/meal-plans/generate-week", {
      method: "POST",
      body: JSON.stringify(options),
    });
  }

  getCurrentWeekRange(): { startDate: string; endDate: string } {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 1)
    );
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      startDate: startOfWeek.toISOString().split("T")[0],
      endDate: endOfWeek.toISOString().split("T")[0],
    };
  }

  getNextWeekRange(): { startDate: string; endDate: string } {
    const today = new Date();
    const startOfNextWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 8)
    );
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    return {
      startDate: startOfNextWeek.toISOString().split("T")[0],
      endDate: endOfNextWeek.toISOString().split("T")[0],
    };
  }

  formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  parseDate(dateString: string): Date {
    return new Date(dateString + "T00:00:00.000Z");
  }

  private getMealTypeFromTags(
    tags?: string[]
  ): "breakfast" | "lunch" | "dinner" | "snack" | null {
    if (!tags) return null;
    if (tags.includes("breakfast")) return "breakfast";
    if (tags.includes("lunch")) return "lunch";
    if (tags.includes("dinner")) return "dinner";
    if (tags.includes("snack")) return "snack";
    return null;
  }
}

export default new ApiService();
