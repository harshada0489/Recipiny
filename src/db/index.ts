import * as SQLite from 'expo-sqlite';

const DB_NAME = 'recipiny.db';
const SCHEMA_VERSION = 1;

let dbInstance: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync(DB_NAME);
  }
  return dbInstance;
}

export async function initDb(): Promise<void> {
  const db = getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS schema_info (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      image TEXT,
      source_url TEXT,
      source_app TEXT,
      cook_time INTEGER,
      servings INTEGER,
      calories INTEGER,
      notes TEXT,
      ingredients TEXT NOT NULL,
      steps TEXT NOT NULL,
      tone TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS grocery_items (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meal_plan_entries (
      id TEXT PRIMARY KEY,
      recipe_id TEXT NOT NULL,
      date TEXT NOT NULL,
      slot TEXT NOT NULL
    );
  `);

  await db.runAsync(
    `INSERT OR REPLACE INTO schema_info (key, value) VALUES (?, ?)`,
    ['version', String(SCHEMA_VERSION)],
  );

  // Idempotent migrations for users who installed earlier schema versions.
  // SQLite throws on duplicate column; ignore that one specific error.
  await safeAlter(`ALTER TABLE recipes ADD COLUMN calories INTEGER`);
  await safeAlter(`ALTER TABLE recipes ADD COLUMN notes TEXT`);
}

async function safeAlter(sql: string): Promise<void> {
  const db = getDb();
  try {
    await db.execAsync(sql);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (!/duplicate column/i.test(msg)) throw e;
  }
}

export function nowMs(): number {
  return Date.now();
}

export function newId(prefix = 'r'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
