import { useState } from 'react';

const MEAL_ICONS = {
  Breakfast: '🌅',
  Lunch: '☀️',
  Dinner: '🌙',
  Snacks: '🍎',
};

export default function MealSection({ meal, entries, onAddFood, onDelete }) {
  const [open, setOpen] = useState(true);

  const totalCal = entries.reduce((s, e) => s + e.calories, 0);

  return (
    <div className="meal-card">
      <div className="meal-header" onClick={() => setOpen((o) => !o)}>
        <div className="meal-header-left">
          <span className="meal-icon">{MEAL_ICONS[meal] || '🍴'}</span>
          <span className="meal-name">{meal}</span>
          <span className="meal-cal-badge">{totalCal} kcal</span>
        </div>
        <div className="meal-header-right">
          <span className={`meal-chevron ${open ? 'open' : ''}`}>▼</span>
        </div>
      </div>

      {open && (
        <div className="meal-body">
          {entries.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🫙</div>
              <p>No food logged yet</p>
            </div>
          ) : (
            <ul className="food-list">
              {entries.map((entry) => (
                <li key={entry.id} className="food-item">
                  <span className="food-name">{entry.name}</span>
                  <div className="food-macros">
                    <span style={{ color: 'var(--protein)' }}>P {entry.protein}g</span>
                    <span style={{ color: 'var(--carbs)' }}>C {entry.carbs}g</span>
                    <span style={{ color: 'var(--fat)' }}>F {entry.fat}g</span>
                  </div>
                  <span className="food-cal">{entry.calories} kcal</span>
                  <button
                    className="food-delete"
                    title="Remove"
                    onClick={() => onDelete(entry.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button className="add-food-btn" onClick={() => onAddFood(meal)}>
            <span>＋</span> Add food to {meal}
          </button>
        </div>
      )}
    </div>
  );
}
