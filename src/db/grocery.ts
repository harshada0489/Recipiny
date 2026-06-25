import { getDb, newId, nowMs } from './index';
import type { GroceryItem } from '@/types/recipe';

export async function listGrocery(): Promise<GroceryItem[]> {
  const db = getDb();
  return db.getAllAsync<GroceryItem>(
    `SELECT id, text, done, created_at AS createdAt FROM grocery_items ORDER BY done ASC, created_at DESC`,
  );
}

export async function addGroceryItem(text: string): Promise<GroceryItem> {
  const db = getDb();
  const item: GroceryItem = {
    id: newId('g'),
    text,
    done: 0,
    createdAt: nowMs(),
  };
  await db.runAsync(
    `INSERT INTO grocery_items (id, text, done, created_at) VALUES (?, ?, ?, ?)`,
    [item.id, item.text, item.done, item.createdAt],
  );
  return item;
}

export async function toggleGrocery(id: string, done: 0 | 1): Promise<void> {
  const db = getDb();
  await db.runAsync(`UPDATE grocery_items SET done = ? WHERE id = ?`, [done, id]);
}

export async function clearGrocery(): Promise<void> {
  const db = getDb();
  await db.runAsync(`DELETE FROM grocery_items`);
}
