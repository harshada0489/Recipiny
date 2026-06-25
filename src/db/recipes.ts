import { getDb, newId, nowMs } from './index';
import type { Recipe, SourceApp } from '@/types/recipe';

type RecipeRow = {
  id: string;
  title: string;
  image: string | null;
  source_url: string | null;
  source_app: string | null;
  cook_time: number | null;
  servings: number | null;
  calories: number | null;
  notes: string | null;
  ingredients: string;
  steps: string;
  tone: string | null;
  created_at: number;
};

function rowToRecipe(r: RecipeRow): Recipe {
  return {
    id: r.id,
    title: r.title,
    image: r.image,
    sourceUrl: r.source_url,
    sourceApp: (r.source_app ?? 'Other') as SourceApp,
    cookTime: r.cook_time ?? 0,
    servings: r.servings ?? 1,
    calories: r.calories,
    notes: r.notes,
    ingredients: JSON.parse(r.ingredients),
    steps: JSON.parse(r.steps),
    tone: r.tone ?? '#3a3f37',
    createdAt: r.created_at,
  };
}

export async function listRecipes(): Promise<Recipe[]> {
  const db = getDb();
  const rows = await db.getAllAsync<RecipeRow>(
    `SELECT * FROM recipes ORDER BY created_at DESC`,
  );
  return rows.map(rowToRecipe);
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const db = getDb();
  const row = await db.getFirstAsync<RecipeRow>(
    `SELECT * FROM recipes WHERE id = ?`,
    [id],
  );
  return row ? rowToRecipe(row) : null;
}

export type RecipeInput = Omit<Recipe, 'id' | 'createdAt'> & {
  id?: string;
  createdAt?: number;
};

export async function saveRecipe(input: RecipeInput): Promise<Recipe> {
  const db = getDb();
  const id = input.id ?? newId('rec');
  const createdAt = input.createdAt ?? nowMs();
  await db.runAsync(
    `INSERT OR REPLACE INTO recipes
     (id, title, image, source_url, source_app, cook_time, servings, calories, notes, ingredients, steps, tone, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.title,
      input.image,
      input.sourceUrl,
      input.sourceApp,
      input.cookTime,
      input.servings,
      input.calories,
      input.notes,
      JSON.stringify(input.ingredients),
      JSON.stringify(input.steps),
      input.tone,
      createdAt,
    ],
  );
  return { ...input, id, createdAt };
}

export async function deleteRecipe(id: string): Promise<void> {
  const db = getDb();
  await db.runAsync(`DELETE FROM recipes WHERE id = ?`, [id]);
}

export async function updateRecipeImage(id: string, image: string | null): Promise<void> {
  const db = getDb();
  await db.runAsync(`UPDATE recipes SET image = ? WHERE id = ?`, [image, id]);
}

export async function updateRecipeTitle(id: string, title: string): Promise<void> {
  const db = getDb();
  await db.runAsync(`UPDATE recipes SET title = ? WHERE id = ?`, [title, id]);
}

export async function updateRecipeNotes(id: string, notes: string | null): Promise<void> {
  const db = getDb();
  await db.runAsync(`UPDATE recipes SET notes = ? WHERE id = ?`, [notes, id]);
}

export async function countRecipes(): Promise<number> {
  const db = getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    `SELECT COUNT(*) AS c FROM recipes`,
  );
  return row?.c ?? 0;
}
