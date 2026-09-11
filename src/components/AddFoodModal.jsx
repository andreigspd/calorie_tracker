import { useState, useMemo } from 'react';
import { FOOD_DB, PORTIONS, scaleFood } from '../foodData';

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function AddFoodModal({ onAdd, onClose, defaultMeal }) {
  const [tab, setTab] = useState('pick'); // 'pick' | 'manual'
  const [meal, setMeal] = useState(defaultMeal || 'Breakfast');

  // --- Food picker state ---
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [grams, setGrams] = useState(100);

  // --- Manual entry state ---
  const [manual, setManual] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [error, setError] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? FOOD_DB.filter((f) => f.name.toLowerCase().includes(q)) : FOOD_DB;
    // Group by category, preserving order
    const groups = {};
    for (const f of list) {
      (groups[f.category] ||= []).push(f);
    }
    return groups;
  }, [query]);

  const scaled = selected ? scaleFood(selected, grams) : null;

  function addFromPicker() {
    if (!selected) return setError('Please select a food first.');
    setError('');
    onAdd({
      id: crypto.randomUUID(),
      name: `${selected.name} (${grams} g)`,
      ...scaleFood(selected, grams),
      meal,
    });
    onClose();
  }

  function addFromManual(e) {
    e.preventDefault();
    if (!manual.name.trim()) return setError('Food name is required.');
    if (!manual.calories || isNaN(Number(manual.calories)) || Number(manual.calories) < 0)
      return setError('Enter a valid calorie amount.');
    setError('');
    onAdd({
      id: crypto.randomUUID(),
      name: manual.name.trim(),
      calories: Math.round(Number(manual.calories)),
      protein: Math.round(Number(manual.protein) || 0),
      carbs: Math.round(Number(manual.carbs) || 0),
      fat: Math.round(Number(manual.fat) || 0),
      meal,
    });
    onClose();
  }

  const setM = (field) => (e) => setManual((m) => ({ ...m, [field]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Add Food</h2>
        <p className="modal-sub">Choose from the list or enter values manually.</p>

        <div className="tabs">
          <button className={`tab ${tab === 'pick' ? 'active' : ''}`} onClick={() => { setTab('pick'); setError(''); }}>
            Choose food
          </button>
          <button className={`tab ${tab === 'manual' ? 'active' : ''}`} onClick={() => { setTab('manual'); setError(''); }}>
            Manual entry
          </button>
        </div>

        <div className="form-group">
          <label>Meal</label>
          <select value={meal} onChange={(e) => setMeal(e.target.value)}>
            {MEALS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        {tab === 'pick' ? (
          <>
            <input
              className="search-input"
              placeholder="Search foods (e.g. chicken, rice)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />

            <ul className="food-db-list">
              {Object.keys(filtered).length === 0 && (
                <li className="empty-state">No foods match your search.</li>
              )}
              {Object.entries(filtered).map(([category, foods]) => (
                <li key={category}>
                  <div className="category-label">{category}</div>
                  <ul style={{ listStyle: 'none' }}>
                    {foods.map((f) => (
                      <li
                        key={f.name}
                        className={`food-db-item ${selected?.name === f.name ? 'selected' : ''}`}
                        onClick={() => setSelected(f)}
                      >
                        <span className="food-db-name">{f.name}</span>
                        <span className="food-db-cal">{f.calories} kcal / 100 g</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {selected && (
              <div className="portion-box">
                <div className="selected-food">{selected.name}</div>

                <div className="portion-options">
                  {PORTIONS.map((p) => (
                    <button
                      key={p.label}
                      className={`portion-chip ${grams === p.grams ? 'active' : ''}`}
                      onClick={() => setGrams(p.grams)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label>Custom amount (grams)</label>
                  <input
                    type="number"
                    min="1"
                    value={grams}
                    onChange={(e) => setGrams(Math.max(1, Number(e.target.value) || 0))}
                  />
                </div>

                <div className="portion-preview">
                  <div className="pv"><div className="pv-value">{scaled.calories}</div><div className="pv-label">kcal</div></div>
                  <div className="pv"><div className="pv-value">{scaled.protein}g</div><div className="pv-label">Protein</div></div>
                  <div className="pv"><div className="pv-value">{scaled.carbs}g</div><div className="pv-label">Carbs</div></div>
                  <div className="pv"><div className="pv-value">{scaled.fat}g</div><div className="pv-label">Fat</div></div>
                </div>
              </div>
            )}

            {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={addFromPicker}>Add Food</button>
            </div>
          </>
        ) : (
          <form onSubmit={addFromManual}>
            <div className="form-group">
              <label>Food Name</label>
              <input placeholder="e.g. Homemade Stew" value={manual.name} onChange={setM('name')} autoFocus />
            </div>
            <div className="form-group">
              <label>Calories (kcal)</label>
              <input type="number" min="0" placeholder="0" value={manual.calories} onChange={setM('calories')} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Protein (g)</label>
                <input type="number" min="0" placeholder="0" value={manual.protein} onChange={setM('protein')} />
              </div>
              <div className="form-group">
                <label>Carbs (g)</label>
                <input type="number" min="0" placeholder="0" value={manual.carbs} onChange={setM('carbs')} />
              </div>
            </div>
            <div className="form-group">
              <label>Fat (g)</label>
              <input type="number" min="0" placeholder="0" value={manual.fat} onChange={setM('fat')} />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Food</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
