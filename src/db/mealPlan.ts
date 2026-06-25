import { getDb, newId } from './index';
import type { MealPlanEntry } from '@/types/recipe';

export async function listMealPlan(): Promise<MealPlanEntry[]> {
  const db = getDb();
  return db.getAllAsync<MealPlanEntry>(
    `SELECT id, recipe_id AS recipeId, date, slot FROM meal_plan_entries ORDER BY date ASC`,
  );
}

export async function addMealPlanEntry(
  recipeId: string,
  date: string,
  slot: MealPlanEntry['slot'],
): Promise<MealPlanEntry> {
  const db = getDb();
  const entry: MealPlanEntry = { id: newId('m'), recipeId, date, slot };
  await db.runAsync(
    `INSERT INTO meal_plan_entries (id, recipe_id, date, slot) VALUES (?, ?, ?, ?)`,
    [entry.id, entry.recipeId, entry.date, entry.slot],
  );
  return entry;
}

export async function removeMealPlanEntry(id: string): Promise<void> {
  const db = getDb();
  await db.runAsync(`DELETE FROM meal_plan_entries WHERE id = ?`, [id]);
}
