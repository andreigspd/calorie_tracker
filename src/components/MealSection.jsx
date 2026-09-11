import { useState } from 'react';

export default function MealSection({ meal, entries, onAddFood, onDelete }) {
  const [open, setOpen] = useState(true);

  const totalCal = entries.reduce((s, e) => s + e.calories, 0);

  return (
    <div className="meal-card">
      <div className="meal-header" onClick={() => setOpen((o) => !o)}>
        <div className="meal-header-left">
          <span className="meal-name">{meal}</span>
          <span className="meal-cal-badge">{totalCal} kcal</span>
        </div>
        <span className={`meal-chevron ${open ? 'open' : ''}`}>▾</span>
      </div>

      {open && (
        <div className="meal-body">
          {entries.length === 0 ? (
            <div className="empty-state">No food logged yet</div>
          ) : (
            <ul className="food-list">
              {entries.map((entry) => (
                <li key={entry.id} className="food-item">
                  <span className="food-name">{entry.name}</span>
                  <div className="food-macros">
                    <span>P {entry.protein}g</span>
                    <span>C {entry.carbs}g</span>
                    <span>F {entry.fat}g</span>
                  </div>
                  <span className="food-cal">{entry.calories} kcal</span>
                  <button
                    className="food-delete"
                    title="Remove"
                    aria-label={`Remove ${entry.name}`}
                    onClick={() => onDelete(entry.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button className="add-food-btn" onClick={() => onAddFood(meal)}>
            + Add food to {meal}
          </button>
        </div>
      )}
    </div>
  );
}
