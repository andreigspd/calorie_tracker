// Nutrition values are per 100 grams (or per 100 ml for liquids).
// Sources: approximate averages from common nutrition databases (USDA).

export const FOOD_DB = [
  // Proteins
  { name: 'Chicken Breast (cooked)', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Chicken Thigh (cooked)', category: 'Protein', calories: 209, protein: 26, carbs: 0, fat: 11 },
  { name: 'Ground Beef (85% lean, cooked)', category: 'Protein', calories: 250, protein: 26, carbs: 0, fat: 15 },
  { name: 'Salmon (cooked)', category: 'Protein', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Tuna (canned in water)', category: 'Protein', calories: 116, protein: 26, carbs: 0, fat: 1 },
  { name: 'Shrimp (cooked)', category: 'Protein', calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { name: 'Pork Chop (cooked)', category: 'Protein', calories: 231, protein: 26, carbs: 0, fat: 14 },
  { name: 'Egg (whole)', category: 'Protein', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: 'Egg White', category: 'Protein', calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
  { name: 'Tofu (firm)', category: 'Protein', calories: 144, protein: 17, carbs: 3, fat: 9 },

  // Dairy
  { name: 'Greek Yogurt (plain, nonfat)', category: 'Dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: 'Whole Milk', category: 'Dairy', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: 'Skim Milk', category: 'Dairy', calories: 34, protein: 3.4, carbs: 5, fat: 0.1 },
  { name: 'Cheddar Cheese', category: 'Dairy', calories: 403, protein: 25, carbs: 1.3, fat: 33 },
  { name: 'Cottage Cheese (low-fat)', category: 'Dairy', calories: 72, protein: 12, carbs: 2.7, fat: 1 },

  // Grains & Carbs
  { name: 'White Rice (cooked)', category: 'Grains & Carbs', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Brown Rice (cooked)', category: 'Grains & Carbs', calories: 123, protein: 2.7, carbs: 26, fat: 1 },
  { name: 'Pasta (cooked)', category: 'Grains & Carbs', calories: 158, protein: 6, carbs: 31, fat: 0.9 },
  { name: 'Oats (dry)', category: 'Grains & Carbs', calories: 389, protein: 17, carbs: 66, fat: 7 },
  { name: 'Whole Wheat Bread', category: 'Grains & Carbs', calories: 247, protein: 13, carbs: 41, fat: 3.4 },
  { name: 'White Bread', category: 'Grains & Carbs', calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  { name: 'Potato (baked)', category: 'Grains & Carbs', calories: 93, protein: 2.5, carbs: 21, fat: 0.1 },
  { name: 'Sweet Potato (baked)', category: 'Grains & Carbs', calories: 90, protein: 2, carbs: 21, fat: 0.1 },
  { name: 'Quinoa (cooked)', category: 'Grains & Carbs', calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },

  // Fruits
  { name: 'Banana', category: 'Fruits', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'Apple', category: 'Fruits', calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: 'Blueberries', category: 'Fruits', calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },
  { name: 'Strawberries', category: 'Fruits', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
  { name: 'Orange', category: 'Fruits', calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
  { name: 'Avocado', category: 'Fruits', calories: 160, protein: 2, carbs: 9, fat: 15 },

  // Vegetables
  { name: 'Broccoli', category: 'Vegetables', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Spinach', category: 'Vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: 'Carrots', category: 'Vegetables', calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  { name: 'Tomato', category: 'Vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { name: 'Bell Pepper', category: 'Vegetables', calories: 31, protein: 1, carbs: 6, fat: 0.3 },

  // Nuts, Fats & Legumes
  { name: 'Almonds', category: 'Nuts, Fats & Legumes', calories: 579, protein: 21, carbs: 22, fat: 50 },
  { name: 'Peanut Butter', category: 'Nuts, Fats & Legumes', calories: 588, protein: 25, carbs: 20, fat: 50 },
  { name: 'Olive Oil', category: 'Nuts, Fats & Legumes', calories: 884, protein: 0, carbs: 0, fat: 100 },
  { name: 'Black Beans (cooked)', category: 'Nuts, Fats & Legumes', calories: 132, protein: 8.9, carbs: 24, fat: 0.5 },
  { name: 'Chickpeas (cooked)', category: 'Nuts, Fats & Legumes', calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
  { name: 'Lentils (cooked)', category: 'Nuts, Fats & Legumes', calories: 116, protein: 9, carbs: 20, fat: 0.4 },
];

// Portion presets. `grams` multiplies the per-100g values.
export const PORTIONS = [
  { label: '100 g', grams: 100 },
  { label: '150 g', grams: 150 },
  { label: '200 g', grams: 200 },
  { label: '250 g', grams: 250 },
  { label: '50 g', grams: 50 },
  { label: '1 serving (85 g)', grams: 85 },
];

// Scale a food's per-100g macros to a given gram amount, rounded to whole numbers.
export function scaleFood(food, grams) {
  const factor = grams / 100;
  return {
    calories: Math.round(food.calories * factor),
    protein: Math.round(food.protein * factor),
    carbs: Math.round(food.carbs * factor),
    fat: Math.round(food.fat * factor),
  };
}
