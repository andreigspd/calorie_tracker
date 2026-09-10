import { useState } from 'react';

export default function GoalSettings({ goals, onSave, onClose }) {
  const [form, setForm] = useState({ ...goals });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: Number(e.target.value) || 0 }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const macros = [
    { key: 'protein', label: 'Protein', color: 'var(--protein)' },
    { key: 'carbs',   label: 'Carbs',   color: 'var(--carbs)'   },
    { key: 'fat',     label: 'Fat',     color: 'var(--fat)'     },
  ];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>🎯 Daily Goals</h2>
        <form onSubmit={handleSubmit}>
          <p className="goals-section-title">Calories</p>
          <div className="form-group">
            <label>Daily Calorie Goal (kcal)</label>
            <input
              type="number"
              min="0"
              value={form.calories}
              onChange={set('calories')}
            />
          </div>

          <p className="goals-section-title">Macros</p>
          {macros.map(({ key, label, color }) => (
            <div className="form-group" key={key}>
              <label style={{ color }}>{label} (g)</label>
              <input
                type="number"
                min="0"
                value={form[key]}
                onChange={set(key)}
              />
            </div>
          ))}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Goals</button>
          </div>
        </form>
      </div>
    </div>
  );
}
