# CalTrack — Calorie & Macro Tracker

A simple, minimalist web app to track your daily calories and macros (protein, carbs, fat). Pick foods from a built-in database with portion sizes, or enter values manually. All data is stored locally in your browser — no account, no backend.

**Live demo:** https://andreigspd.github.io/calorie_tracker/

## Features

- **Daily summary** — total calories eaten, remaining calories against your goal, and a progress bar.
- **Macro tracking** — protein, carbs, and fat totals, each with its own progress bar toward a goal.
- **Food database** — pick from ~40 common foods (chicken breast, rice, eggs, etc.) grouped by category, with search.
- **Portion sizes** — choose a preset portion (50 g, 100 g, 150 g, 200 g, 250 g, 1 serving) or type a custom gram amount. Macros scale automatically with a live preview before you add.
- **Manual entry** — a fallback tab to log any food by typing its name, calories, and macros.
- **Meals** — entries are grouped into Breakfast, Lunch, Dinner, and Snacks (collapsible sections).
- **Daily goals** — set your own calorie and macro targets.
- **Date navigation** — browse and log for previous days; each day is stored separately.
- **Local persistence** — everything is saved in `localStorage` and survives reloads.

## Tech Stack

- React 19 + Vite
- Plain CSS (no UI framework)
- Data persisted in the browser via `localStorage`

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
├── components/
│   ├── DailySummary.jsx       # calorie + macro totals with progress bars
│   ├── AddFoodModal.jsx       # food picker (search + portions) and manual entry tabs
│   ├── MealSection.jsx        # per-meal collapsible list of entries
│   └── GoalSettings.jsx       # calorie & macro goal editor
├── index.css                  # theme variables + base styles
└── App.css                    # component styles
```

## Nutrition Data

Values in the food database are approximate per-100 g (or per-100 ml for liquids) figures
based on common nutrition databases. Treat them as estimates, not precise measurements.

## Changelog

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
