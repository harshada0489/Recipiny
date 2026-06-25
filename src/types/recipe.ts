export type SourceApp = 'Instagram' | 'TikTok' | 'YouTube' | 'Other';

export type Ingredient = {
  amount: number;
  unit: string;
  name: string;
};

export type Recipe = {
  id: string;
  title: string;
  image: string | null;
  sourceUrl: string | null;
  sourceApp: SourceApp;
  cookTime: number;
  servings: number;
  calories: number | null;
  notes: string | null;
  ingredients: Ingredient[];
  steps: string[];
  tone: string;
  createdAt: number;
};

export type GroceryItem = {
  id: string;
  text: string;
  done: 0 | 1;
  createdAt: number;
};

export type MealPlanEntry = {
  id: string;
  recipeId: string;
  date: string;
  slot: 'breakfast' | 'lunch' | 'dinner';
};
