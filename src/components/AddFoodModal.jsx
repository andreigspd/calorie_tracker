import { useState } from 'react';

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const empty = { name: '', calories: '', protein: '', carbs: '', fat: '', meal: 'Breakfast' };

export default function AddFoodModal({ onAdd, onClose, defaultMeal }) {
  const [form, setForm] = useState({ ...empty, meal: defaultMeal || 'Breakfast' });
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Food name is required.');
    if (!form.calories || isNaN(Number(form.calories)) || Number(form.calories) < 0)
      return setError('Enter a valid calorie amount.');
    setError('');
    onAdd({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      calories: Math.round(Number(form.calories)),
      protein: Math.round(Number(form.protein) || 0),
      carbs: Math.round(Number(form.carbs) || 0),
      fat: Math.round(Number(form.fat) || 0),
      meal: form.meal,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>🍽️ Add Food</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Food Name</label>
            <input
              autoFocus
              placeholder="e.g. Grilled Chicken"
              value={form.name}
              onChange={set('name')}
            />
          </div>

          <div className="form-group">
            <label>Meal</label>
            <select value={form.meal} onChange={set('meal')}>
              {MEALS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Calories (kcal)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={form.calories}
              onChange={set('calories')}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Protein (g)</label>
              <input type="number" min="0" placeholder="0" value={form.protein} onChange={set('protein')} />
            </div>
            <div className="form-group">
              <label>Carbs (g)</label>
              <input type="number" min="0" placeholder="0" value={form.carbs} onChange={set('carbs')} />
            </div>
          </div>

          <div className="form-group">
            <label>Fat (g)</label>
            <input type="number" min="0" placeholder="0" value={form.fat} onChange={set('fat')} />
          </div>

          {error && <p style={{ color: 'var(--accent2)', fontSize: '0.82rem', marginBottom: 8 }}>{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Food</button>
          </div>
        </form>
      </div>
    </div>
  );
}
