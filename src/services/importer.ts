import type { Ingredient, Recipe, SourceApp } from '@/types/recipe';

/**
 * Result of an import attempt. The shape is intentionally stable so the mock
 * and the real (AI-backed) implementation are interchangeable.
 */
export type ImportResult = Omit<Recipe, 'id' | 'createdAt'>;

/* ────────────────────────────────────────────────────────────────────────── *
 *  Backend config — sourced from environment variables, never committed.
 *
 *  Local dev: define these in `.env` (gitignored). Expo loads `.env`
 *  automatically when you run `npx expo start`.
 *
 *  Production builds: define them as EAS Secrets, e.g.
 *    npx eas secret:create --scope project \
 *      --name EXPO_PUBLIC_RECIPINY_API_KEY --value <secret> --type string
 *
 *  When both vars are set, the real backend is called. When either is
 *  missing (e.g. you cloned the repo without an .env), the importer
 *  falls back to the mock recipe so the app still runs end-to-end.
 *
 *  The `EXPO_PUBLIC_` prefix is required for Expo to inline the value
 *  into the JS bundle at build time.
 * ────────────────────────────────────────────────────────────────────────── */
const API_ENDPOINT = process.env.EXPO_PUBLIC_RECIPINY_API_ENDPOINT ?? '';
const API_KEY = process.env.EXPO_PUBLIC_RECIPINY_API_KEY ?? '';
const USE_REAL_API = API_ENDPOINT.length > 0 && API_KEY.length > 0;

const SOURCE_TONES: Record<SourceApp, string> = {
  Instagram: '#C2522C',
  TikTok: '#5D7A39',
  YouTube: '#C4892C',
  Other: '#3a3f37',
};

function detectSourceApp(url: string): SourceApp {
  const u = url.toLowerCase();
  if (u.includes('instagram.com') || u.includes('instagr.am')) return 'Instagram';
  if (u.includes('tiktok.com')) return 'TikTok';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'YouTube';
  return 'Other';
}

/** Turn a pasted URL into a structured recipe. */
export async function importRecipeFromUrl(url: string): Promise<ImportResult> {
  if (USE_REAL_API) {
    return importFromBackend(url);
  }
  return importMock(url);
}

/* ───────── real backend call ────────── */

type BackendRecipe = {
  title: string;
  image: string | null;
  source_url: string;
  source_app: 'instagram' | 'tiktok' | 'youtube' | 'other';
  cook_time: string | null;
  servings: number | null;
  calories: number | null;
  ingredients: string[];
  steps: string[];
};

async function importFromBackend(url: string): Promise<ImportResult> {
  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ url }),
  });

  const data = (await res.json().catch(() => ({}))) as Partial<BackendRecipe> & { error?: string };
  if (!res.ok) {
    throw new Error(data?.error ?? 'Could not import that link.');
  }

  const sourceApp = titleCaseSourceApp(data.source_app ?? 'other');

  return {
    title: data.title ?? 'Untitled recipe',
    image: data.image ?? null,
    sourceUrl: data.source_url ?? url,
    sourceApp,
    cookTime: parseMinutes(data.cook_time),
    servings: data.servings ?? 1,
    calories: data.calories ?? null,
    notes: null,
    tone: SOURCE_TONES[sourceApp],
    ingredients: (data.ingredients ?? []).map(parseIngredientLine),
    steps: data.steps ?? [],
  };
}

function titleCaseSourceApp(s: string): SourceApp {
  switch (s) {
    case 'instagram': return 'Instagram';
    case 'tiktok':    return 'TikTok';
    case 'youtube':   return 'YouTube';
    default:          return 'Other';
  }
}

function parseMinutes(value: string | null | undefined): number {
  if (!value) return 0;
  const m = value.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

const FRACTION_MAP: Record<string, number> = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 0.33, '⅔': 0.67 };

function parseIngredientLine(line: string): Ingredient {
  const trimmed = line.trim();
  const m = trimmed.match(/^([\d./¼½¾⅓⅔\-\s]+)\s*([a-zA-Z]+)?\s+(.*)$/);
  if (!m) return { amount: 1, unit: '', name: trimmed };

  const amountStr = m[1].trim();
  let amount = parseFloat(amountStr);
  if (!Number.isFinite(amount)) {
    const glyph = amountStr.match(/[¼½¾⅓⅔]/)?.[0];
    amount = glyph ? FRACTION_MAP[glyph] : 1;
  }

  return { amount, unit: m[2] ?? '', name: m[3].trim() };
}

/* ───────── mock (initial dev experience) ────────── */

async function importMock(url: string): Promise<ImportResult> {
  const sourceApp = detectSourceApp(url);
  await new Promise((r) => setTimeout(r, 1500));

  return {
    title: 'Creamy Tuscan Pasta',
    image: 'cover-tuscan',
    sourceUrl: url,
    sourceApp,
    cookTime: 25,
    servings: 4,
    calories: 620,
    notes: null,
    tone: SOURCE_TONES[sourceApp],
    ingredients: [
      { amount: 12, unit: 'oz', name: 'penne pasta' },
      { amount: 2, unit: 'tbsp', name: 'olive oil' },
      { amount: 3, unit: 'cloves', name: 'garlic, minced' },
      { amount: 1, unit: 'cup', name: 'sun-dried tomatoes' },
      { amount: 2, unit: 'cups', name: 'baby spinach' },
      { amount: 1, unit: 'cup', name: 'heavy cream' },
      { amount: 0.5, unit: 'cup', name: 'parmesan, grated' },
    ],
    steps: [
      'Boil the penne in salted water until al dente, about 11 minutes. Reserve half a cup of pasta water, then drain.',
      'Warm the olive oil in a large pan over medium heat. Add the garlic and cook until fragrant, about 1 minute.',
      'Stir in the sun-dried tomatoes and cook for 2 minutes to wake up their flavor.',
      'Pour in the heavy cream and bring to a gentle simmer until it thickens slightly.',
      'Add the parmesan and spinach, stirring until the cheese melts and the spinach wilts.',
      'Toss in the pasta, loosen with the reserved water, and season with salt and pepper.',
    ],
  };
}
