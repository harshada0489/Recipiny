# Recipiny

A cross-platform (iOS + Android) recipe app built with React Native + Expo + TypeScript.
Paste an Instagram / TikTok / YouTube link → get a clean, structured recipe you can cook
from. All data lives on the device — no backend, no account required.

## Run it

```bash
# 1. Install dependencies (one-time)
npm install

# 2. Start the Expo dev server
npx expo start
```

Then:
- **On your phone:** install the *Expo Go* app, scan the QR code in the terminal.
- **iOS simulator (macOS):** press `i` in the terminal.
- **Android emulator:** press `a` in the terminal.

If anything complains about native modules, run:
```bash
npx expo install --check
```

## What's in the box

| Screen        | Status   | Notes |
|---------------|----------|-------|
| Home          | ✅ Real   | "Pin Recipe" reads the system clipboard. "Try it" button uses a demo URL. |
| Import        | ✅ Mocked | Plays the 3-stage progress animation, then saves a sample recipe. |
| Recipe detail | ✅ Real   | Hero, scaled ingredients (¼ / ½ / ¾ glyphs), checkable list, numbered steps. |
| Cook mode     | ✅ Real   | Full-screen, screen-stays-awake, tap or Next to advance. |
| Saved         | ✅ Real   | 2-column grid + client-side search. |
| Profile       | ✅ Real   | Backup → native share sheet · Restore → document picker. |

### What's still mocked
- **The import engine.** `src/services/importer.ts` returns a sample recipe after a
  ~1.5 s delay. There's a clearly-marked `// TODO` showing exactly where to swap
  in your real `fetch()` call. As long as the new implementation keeps returning
  the `ImportResult` shape, nothing else in the app needs to change.

## Folder layout

```
Recipiny/
├── app/                       expo-router screens
│   ├── _layout.tsx            loads Nunito + initialises SQLite
│   ├── (tabs)/                Home · Saved · Profile (tab bar)
│   ├── recipe/[id].tsx        Recipe detail
│   ├── cook/[id].tsx          Cook mode (full-screen modal)
│   └── import.tsx             Import overlay (full-screen modal)
├── src/
│   ├── theme/                 Design tokens
│   ├── types/                 Shared TS types
│   ├── db/                    SQLite layer (CRUD per table + backup + seed)
│   ├── services/importer.ts   importRecipeFromUrl() — MOCKED, swap for real API
│   ├── components/            Reusable UI pieces + Icon set
│   └── lib/format.ts          Fraction-aware amount formatter
├── assets/covers/             Cover photos used by sample recipes
├── Design system specifications/   Source HTML mockup (unchanged)
├── app.json
├── package.json
└── tsconfig.json
```

## Data model (SQLite)

- `recipes(id, title, image, source_url, source_app, cook_time, servings, ingredients, steps, tone, created_at)`
- `grocery_items(id, text, done, created_at)`
- `meal_plan_entries(id, recipe_id, date, slot)`

Backups are simple JSON dumps of all three tables. Restore is a strict
`INSERT OR REPLACE` per row, so re-importing the same backup is idempotent.

## Swapping the mock importer for the real API

Open `src/services/importer.ts` and find the `// TODO` block inside
`importRecipeFromUrl`. Replace the mocked return value with a real `fetch()`
call to your endpoint. Keep the returned object's shape identical to
`ImportResult` — every screen and the DB layer expects it.
