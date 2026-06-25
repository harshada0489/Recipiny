import type { Ingredient } from '@/types/recipe';

/**
 * The "Healthier" mode applies these text substitutions across ingredient
 * names and step text. Each entry is [pattern, replacement]. Order matters
 * — the first matching pattern wins per string.
 *
 * Lifted from the original design's swap list. Curated, not exhaustive — if
 * an ingredient isn't covered, it stays as-is.
 */
const SWAPS: Array<[RegExp, string]> = [
  [/heavy cream/gi, 'light coconut cream'],
  [/penne pasta/gi, 'chickpea penne'],
  [/cornstarch/gi, 'arrowroot starch'],
  [/burger buns/gi, 'whole-grain buns'],
  [/ground beef/gi, 'lean ground turkey'],
  [/\bcheddar\b/gi, 'reduced-fat cheddar'],
  [/\bmilk\b/gi, 'unsweetened almond milk'],
  [/\bbutter\b/gi, 'olive oil'],
  [/sun-dried tomatoes/gi, 'roasted cherry tomatoes'],
  [/Fry in hot oil/g, 'Air-fry'],
  [/fry in hot oil/g, 'air-fry'],
  [/Toast the buttered buns/g, 'Toast the buns'],
  [/Toss in the pasta/g, 'Toss in the chickpea penne'],
];

/** Apply all swaps to a single string. Returns unchanged text if nothing matched. */
export function healthifyText(text: string): string {
  let out = text;
  for (const [re, rep] of SWAPS) {
    out = out.replace(re, rep);
  }
  return out;
}

/** Apply healthify to an ingredient's name only — quantity and unit are unchanged. */
export function healthifyIngredient(ing: Ingredient): Ingredient {
  const next = healthifyText(ing.name);
  return next === ing.name ? ing : { ...ing, name: next };
}

/**
 * Healthier-mode calories — proportional to how many ingredients actually
 * got swapped. The design's 28% figure is the cap (every ingredient swapped);
 * a recipe where nothing matches a swap pattern gets no reduction.
 *
 * Pass the ratio of changed ingredients (0..1). Rounded to the nearest 10.
 */
export function healthierCalories(
  original: number | null,
  swapRatio: number,
): number | null {
  if (original == null) return null;
  if (swapRatio <= 0) return original;
  const reduction = 0.28 * swapRatio;
  return Math.round((original * (1 - reduction)) / 10) * 10;
}

/**
 * Return the array indices of ingredients whose name actually changes when
 * healthified. The recipe screen uses this to trigger the green flash on
 * exactly those rows.
 */
export function changedIngredientIndices(ingredients: Ingredient[]): number[] {
  const out: number[] = [];
  ingredients.forEach((ing, i) => {
    if (healthifyText(ing.name) !== ing.name) out.push(i);
  });
  return out;
}
