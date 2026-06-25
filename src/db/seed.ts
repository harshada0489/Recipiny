import { getDb } from './index';
import { countRecipes, saveRecipe } from './recipes';
import type { Recipe } from '@/types/recipe';

const SAMPLES: Omit<Recipe, 'id' | 'createdAt'>[] = [
  {
    title: 'Creamy Tuscan Pasta',
    image: 'cover-tuscan',
    sourceUrl: 'https://instagram.com/reel/9x2k7',
    sourceApp: 'Instagram',
    cookTime: 25,
    servings: 4,
    calories: 620,
    tone: '#C2522C',
    notes: null,
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
  },
  {
    title: 'Crispy Honey Chicken',
    image: 'cover-honey',
    sourceUrl: 'https://youtu.be/honey-chicken',
    sourceApp: 'YouTube',
    cookTime: 35,
    servings: 4,
    calories: 540,
    tone: '#C4892C',
    notes: null,
    ingredients: [
      { amount: 1.5, unit: 'lb', name: 'chicken thighs, cubed' },
      { amount: 0.5, unit: 'cup', name: 'cornstarch' },
      { amount: 3, unit: 'tbsp', name: 'honey' },
      { amount: 2, unit: 'tbsp', name: 'soy sauce' },
      { amount: 2, unit: 'cloves', name: 'garlic, minced' },
      { amount: 1, unit: 'tbsp', name: 'rice vinegar' },
    ],
    steps: [
      'Toss the chicken in cornstarch until every piece is fully coated.',
      'Fry in hot oil until deeply golden and crisp, then set aside to drain.',
      'Simmer the honey, soy sauce, garlic, and vinegar until glossy and thick.',
      'Toss the crispy chicken through the glaze until it shines.',
      'Serve over rice with a scatter of sesame seeds.',
    ],
  },
  {
    title: 'Green Goddess Bowl',
    image: 'cover-goddess',
    sourceUrl: 'https://tiktok.com/@chef/video/green-goddess',
    sourceApp: 'TikTok',
    cookTime: 15,
    servings: 2,
    calories: 430,
    tone: '#5D7A39',
    notes: null,
    ingredients: [
      { amount: 2, unit: 'cups', name: 'cooked quinoa' },
      { amount: 1, unit: '', name: 'avocado, sliced' },
      { amount: 1, unit: 'cup', name: 'chickpeas' },
      { amount: 2, unit: 'cups', name: 'kale, torn' },
      { amount: 0.5, unit: 'cup', name: 'green goddess dressing' },
      { amount: 1, unit: 'tbsp', name: 'pumpkin seeds' },
    ],
    steps: [
      'Massage the kale with a little olive oil until it softens and darkens.',
      'Gently warm the quinoa and chickpeas.',
      'Build the bowl with quinoa, kale, and chickpeas side by side.',
      'Top with the sliced avocado and pumpkin seeds.',
      'Drizzle generously with the green goddess dressing.',
    ],
  },
  {
    title: 'Miso Glazed Salmon',
    image: 'cover-miso',
    sourceUrl: 'https://instagram.com/reel/miso-salmon',
    sourceApp: 'Instagram',
    cookTime: 20,
    servings: 2,
    calories: 480,
    tone: '#AF5E3C',
    notes: null,
    ingredients: [
      { amount: 2, unit: '', name: 'salmon fillets' },
      { amount: 2, unit: 'tbsp', name: 'white miso' },
      { amount: 1, unit: 'tbsp', name: 'honey' },
      { amount: 1, unit: 'tbsp', name: 'soy sauce' },
      { amount: 1, unit: 'tsp', name: 'ginger, grated' },
    ],
    steps: [
      'Whisk the miso, honey, soy sauce, and ginger into a smooth glaze.',
      'Brush the glaze generously over the salmon fillets.',
      'Roast at 400F for 10 to 12 minutes until just flaky.',
      'Broil for 1 minute to caramelize the top.',
      'Serve with steamed greens and rice.',
    ],
  },
];

export async function seedIfEmpty(): Promise<void> {
  const existing = await countRecipes();
  if (existing > 0) {
    await backfillSampleCalories();
    return;
  }

  let stagger = Date.now();
  for (const sample of SAMPLES) {
    await saveRecipe({ ...sample, createdAt: stagger });
    stagger -= 60_000;
  }
}

/**
 * Older app installs may have seeded recipes before the `calories` column
 * existed. Fill in calorie values for known samples that are currently NULL.
 * Safe to run on every startup — only updates rows that match by title and
 * are missing a value.
 */
async function backfillSampleCalories(): Promise<void> {
  const db = getDb();
  for (const sample of SAMPLES) {
    await db.runAsync(
      `UPDATE recipes SET calories = ? WHERE title = ? AND calories IS NULL`,
      [sample.calories, sample.title],
    );
  }
}
