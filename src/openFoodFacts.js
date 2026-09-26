// Open Food Facts product lookup by barcode.
// Free, keyless API. Docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
// Nutrition values are returned per 100 g/ml, matching our foodData model.

const BASE = 'https://world.openfoodfacts.org/api/v2/product';
const FIELDS = 'product_name,brands,quantity,nutriments,image_front_small_url';

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Look up a product by barcode.
 * @returns {Promise<null | {
 *   name: string, brands: string, quantity: string,
 *   calories: number, protein: number, carbs: number, fat: number,
 *   image: string|null, barcode: string
 * }>} per-100g macros, or null if not found / no nutrition data.
 */
export async function lookupBarcode(barcode) {
  const clean = String(barcode).trim();
  if (!clean) return null;

  const res = await fetch(`${BASE}/${encodeURIComponent(clean)}.json?fields=${FIELDS}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Lookup failed (HTTP ${res.status})`);

  const data = await res.json();
  if (data.status !== 1 || !data.product) return null;

  const p = data.product;
  const n = p.nutriments || {};

  // energy-kcal_100g is preferred; fall back to converting kJ if needed.
  let calories = num(n['energy-kcal_100g']);
  if (!calories && n['energy-kj_100g']) {
    calories = Math.round(num(n['energy-kj_100g']) / 4.184);
  }

  const result = {
    barcode: clean,
    name: (p.product_name || '').trim() || `Product ${clean}`,
    brands: (p.brands || '').split(',')[0].trim(),
    quantity: (p.quantity || '').trim(),
    calories: Math.round(calories),
    protein: Math.round(num(n['proteins_100g'])),
    carbs: Math.round(num(n['carbohydrates_100g'])),
    fat: Math.round(num(n['fat_100g'])),
    image: p.image_front_small_url || null,
  };

  // If there's no usable nutrition data at all, treat as not found.
  if (!result.calories && !result.protein && !result.carbs && !result.fat) {
    return { ...result, noNutrition: true };
  }

  return result;
}
