# CalTrack — Calorie & Macro Tracker

A simple, minimalist web app to track your daily calories and macros (protein, carbs, fat). Pick foods from a built-in database with portion sizes, **scan a product barcode** to pull in real macros, **snap a photo** of your meal, or enter values manually. All data is stored locally in your browser — no account, no backend.

**Live demo:** https://andreigspd.github.io/calorie_tracker/

## Features

- **Daily summary** — total calories eaten, remaining calories against your goal, and a progress bar.
- **Macro tracking** — protein, carbs, and fat totals, each with its own progress bar toward a goal.
- **Food database** — pick from ~40 common foods (chicken breast, rice, eggs, etc.) grouped by category, with search.
- **Portion sizes** — choose a preset portion (50 g, 100 g, 150 g, 200 g, 250 g, 1 serving) or type a custom gram amount. Macros scale automatically with a live preview before you add.
- **Barcode scanner** — point your camera at a packaged product's barcode to fetch its name and per-100 g macros from the free [Open Food Facts](https://world.openfoodfacts.org) database, then pick a portion. No camera or barcode not recognized? Type the number in manually.
- **Photo capture** — take a photo of your meal (or choose one from your gallery) and attach it to the entry as a thumbnail, then confirm the food from the database. Photos can be attached to any entry, not just photo-based ones.
- **Manual entry** — a fallback tab to log any food by typing its name, calories, and macros.
- **Meals** — entries are grouped into Breakfast, Lunch, Dinner, and Snacks (collapsible sections).
- **Daily goals** — set your own calorie and macro targets.
- **Date navigation** — browse and log for previous days; each day is stored separately.
- **Local persistence** — everything is saved in `localStorage` and survives reloads.

## Tech Stack

- React 19 + Vite
- Plain CSS (no UI framework)
- [`@zxing/browser`](https://github.com/zxing-js/browser) for in-browser barcode scanning (lazy-loaded)
- [Open Food Facts API](https://openfoodfacts.github.io/openfoodfacts-server/api/) for barcode → nutrition lookups (free, keyless)
- Data persisted in the browser via `localStorage`

## Permissions & Privacy

- **Camera** access is requested only when you open the **Scan** tab or tap **Take photo**. It is used entirely on-device — no video is uploaded anywhere.
- Barcode scanning only sends the **decoded number** (not any image) to Open Food Facts to look up nutrition facts.
- Meal photos are downscaled to a small thumbnail and stored only in your browser's `localStorage`.

## Getting Started

Requires [Node.js](https://nodejs.org) 20.19+ or 22.12+.

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
npm run build   # production build into dist/
npm run preview # preview the production build locally
```

## Deployment

The app auto-deploys to **GitHub Pages** on every push to `main` via the workflow in
`.github/workflows/deploy.yml`. The Vite `base` is set to `/calorie_tracker/` so assets
resolve correctly under the GitHub Pages subpath.

To enable it once on the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Project Structure

```
src/
├── App.jsx                    # state, localStorage, layout, date navigation
├── foodData.js                # food database + portion presets + scaling helper
├── openFoodFacts.js           # barcode → per-100g nutrition lookup (Open Food Facts)
├── imageUtils.js              # downscale a photo to a small JPEG thumbnail
├── components/
│   ├── DailySummary.jsx       # calorie + macro totals with progress bars
│   ├── AddFoodModal.jsx       # Choose / Scan / Photo / Manual tabs
│   ├── BarcodeScanner.jsx     # live camera barcode scanner (lazy-loaded)
│   ├── MealSection.jsx        # per-meal collapsible list of entries (with photo thumbs)
│   └── GoalSettings.jsx       # calorie & macro goal editor
├── index.css                  # theme variables + base styles
└── App.css                    # component styles
```

## Nutrition Data

Values in the built-in food database are approximate per-100 g (or per-100 ml for liquids)
figures based on common nutrition databases. Barcode lookups return crowd-sourced data from
Open Food Facts, whose completeness and accuracy vary by product. Treat all values as
estimates, not precise measurements.

> **Note on the camera features:** browsers only allow camera access over **HTTPS** (or on
> `localhost`). The live demo and the local dev server both qualify. On very old browsers the
> live scanner may be unavailable — the manual barcode-number field is always there as a
> fallback.

## Changelog

### v3 — Barcode scanner & photo capture
- Added a **barcode scanner** (Scan tab) that reads EAN/UPC codes from the live camera and
  fetches per-100 g macros from Open Food Facts, feeding into the existing portion picker.
  Includes a manual barcode-number fallback and clear not-found / no-nutrition handling.
- Added **photo capture** (Photo tab): take a picture or choose from the gallery; the image is
  downscaled to a thumbnail, attached to the entry, and shown in the meal list.
- Reworked the "Add Food" dialog into four tabs: **Choose**, **Scan**, **Photo**, **Manual**.
- The barcode scanner (and its ZXing dependency) is **lazy-loaded**, keeping the initial bundle small.

### v2 — Redesign & food database
- Replaced the previous dark/gradient theme with a **minimalist white & blue** design: system fonts, flat colors, no gradients, no emojis.
- Added a **food database** (~40 foods across 6 categories) with search.
- Added **portion sizes** (presets + custom grams) with automatic macro scaling and a live preview.
- Reworked the "Add Food" dialog into two tabs: **Choose food** and **Manual entry**.
- Added a **GitHub Pages** deployment workflow and set the Vite base path.
- Added this README.

### v1 — Initial release
- React + Vite calorie tracker with daily summary, macro tracking, meal grouping,
  daily goals, date navigation, and `localStorage` persistence.
