import { useState, useEffect, useMemo } from 'react';
import './App.css';
import DailySummary from './components/DailySummary';
import AddFoodModal from './components/AddFoodModal';
import MealSection from './components/MealSection';
import GoalSettings from './components/GoalSettings';

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
};

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (dateKey(date) === dateKey(today)) return 'Today';
  if (dateKey(date) === dateKey(yesterday)) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [goals, setGoals] = useState(() => loadFromStorage('ct_goals', DEFAULT_GOALS));
  // entries keyed by date string: { '2024-01-01': [...] }
  const [allEntries, setAllEntries] = useState(() => loadFromStorage('ct_entries', {}));
  const [showAdd, setShowAdd] = useState(false);
  const [addMeal, setAddMeal] = useState('Breakfast');
  const [showGoals, setShowGoals] = useState(false);

  // Persist goals
  useEffect(() => {
    localStorage.setItem('ct_goals', JSON.stringify(goals));
  }, [goals]);

  // Persist entries
  useEffect(() => {
    localStorage.setItem('ct_entries', JSON.stringify(allEntries));
  }, [allEntries]);

  const key = dateKey(currentDate);
  const entries = useMemo(() => allEntries[key] || [], [allEntries, key]);

  const totals = useMemo(() => entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein:  acc.protein  + e.protein,
      carbs:    acc.carbs    + e.carbs,
      fat:      acc.fat      + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ), [entries]);

  function addEntry(entry) {
    setAllEntries((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), entry],
    }));
  }

  function deleteEntry(id) {
    setAllEntries((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((e) => e.id !== id),
    }));
  }

  function openAdd(meal) {
    setAddMeal(meal);
    setShowAdd(true);
  }

  function shiftDate(days) {
    setCurrentDate((d) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() + days);
      return nd;
    });
  }

  const isToday = dateKey(currentDate) === dateKey(new Date());

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>CalTrack</h1>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => setShowGoals(true)}>Goals</button>
          <button className="btn btn-primary" onClick={() => openAdd('Breakfast')}>Add Food</button>
        </div>
      </div>

      {/* Date navigation */}
      <div className="date-nav">
        <button className="date-arrow" onClick={() => shiftDate(-1)}>‹</button>
        <span>{formatDate(currentDate)}</span>
        <button
          className="date-arrow"
          onClick={() => shiftDate(1)}
          disabled={isToday}
          style={{ opacity: isToday ? 0.3 : 1, cursor: isToday ? 'default' : 'pointer' }}
        >
          ›
        </button>
      </div>

      {/* Summary */}
      <DailySummary totals={totals} goals={goals} />

      {/* Meals */}
      <div className="meals-section">
        {MEALS.map((meal) => (
          <MealSection
            key={meal}
            meal={meal}
            entries={entries.filter((e) => e.meal === meal)}
            onAddFood={openAdd}
            onDelete={deleteEntry}
          />
        ))}
      </div>

      {/* Modals */}
      {showAdd && (
        <AddFoodModal
          defaultMeal={addMeal}
          onAdd={addEntry}
          onClose={() => setShowAdd(false)}
        />
      )}
      {showGoals && (
        <GoalSettings
          goals={goals}
          onSave={setGoals}
          onClose={() => setShowGoals(false)}
        />
      )}
    </div>
  );
}
