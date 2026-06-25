import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getDb } from './index';

type BackupShape = {
  app: 'recipiny';
  version: 1;
  exportedAt: number;
  recipes: any[];
  groceryItems: any[];
  mealPlanEntries: any[];
};

async function readAllTables(): Promise<BackupShape> {
  const db = getDb();
  const recipes = await db.getAllAsync(`SELECT * FROM recipes`);
  const groceryItems = await db.getAllAsync(`SELECT * FROM grocery_items`);
  const mealPlanEntries = await db.getAllAsync(`SELECT * FROM meal_plan_entries`);
  return {
    app: 'recipiny',
    version: 1,
    exportedAt: Date.now(),
    recipes,
    groceryItems,
    mealPlanEntries,
  };
}

export async function exportBackup(): Promise<{ uri: string; shared: boolean }> {
  const data = await readAllTables();
  const json = JSON.stringify(data, null, 2);

  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `recipiny-backup-${stamp}.json`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/json',
      dialogTitle: 'Save your Recipiny backup',
      UTI: 'public.json',
    });
    return { uri, shared: true };
  }
  return { uri, shared: false };
}

export async function importBackup(uri: string): Promise<{
  recipes: number;
  grocery: number;
  mealPlan: number;
}> {
  const raw = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  const data = JSON.parse(raw) as Partial<BackupShape>;
  if (data.app !== 'recipiny') {
    throw new Error('Not a Recipiny backup file.');
  }

  const db = getDb();

  await db.withTransactionAsync(async () => {
    for (const r of data.recipes ?? []) {
      await db.runAsync(
        `INSERT OR REPLACE INTO recipes
         (id, title, image, source_url, source_app, cook_time, servings, ingredients, steps, tone, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id,
          r.title,
          r.image ?? null,
          r.source_url ?? null,
          r.source_app ?? null,
          r.cook_time ?? null,
          r.servings ?? null,
          r.ingredients,
          r.steps,
          r.tone ?? null,
          r.created_at ?? Date.now(),
        ],
      );
    }
    for (const g of data.groceryItems ?? []) {
      await db.runAsync(
        `INSERT OR REPLACE INTO grocery_items (id, text, done, created_at) VALUES (?, ?, ?, ?)`,
        [g.id, g.text, g.done ?? 0, g.created_at ?? Date.now()],
      );
    }
    for (const m of data.mealPlanEntries ?? []) {
      await db.runAsync(
        `INSERT OR REPLACE INTO meal_plan_entries (id, recipe_id, date, slot) VALUES (?, ?, ?, ?)`,
        [m.id, m.recipe_id, m.date, m.slot],
      );
    }
  });

  return {
    recipes: data.recipes?.length ?? 0,
    grocery: data.groceryItems?.length ?? 0,
    mealPlan: data.mealPlanEntries?.length ?? 0,
  };
}
