import { useState, useMemo, useRef, lazy, Suspense } from 'react';
import { FOOD_DB, PORTIONS, scaleFood } from '../foodData';
import { lookupBarcode } from '../openFoodFacts';
import { fileToThumbnail } from '../imageUtils';

// Lazy-load the scanner (and its heavy ZXing dependency) only when needed.
const BarcodeScanner = lazy(() => import('./BarcodeScanner'));

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function AddFoodModal({ onAdd, onClose, defaultMeal }) {
  const [tab, setTab] = useState('pick'); // 'pick' | 'scan' | 'photo' | 'manual'
  const [meal, setMeal] = useState(defaultMeal || 'Breakfast');
  const [error, setError] = useState('');

  // Shared photo thumbnail (attached to any entry type)
  const [photo, setPhoto] = useState(null);

  // --- Food picker state (also reused for scanned products) ---
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null); // { name, calories, protein, carbs, fat, ... } per 100g
  const [grams, setGrams] = useState(100);

  // --- Barcode state ---
  const [scanning, setScanning] = useState(true);
  const [lookupState, setLookupState] = useState('idle'); // idle | loading | error
  const [lookupMsg, setLookupMsg] = useState('');

  // --- Manual entry state ---
  const [manual, setManual] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? FOOD_DB.filter((f) => f.name.toLowerCase().includes(q)) : FOOD_DB;
    const groups = {};
    for (const f of list) (groups[f.category] ||= []).push(f);
    return groups;
  }, [query]);

  const scaled = selected ? scaleFood(selected, grams) : null;

  function switchTab(next) {
    setTab(next);
    setError('');
    if (next === 'scan') { setScanning(true); setLookupState('idle'); setLookupMsg(''); }
  }

  async function handleFile(file) {
    if (!file) return;
    try {
      const thumb = await fileToThumbnail(file);
      setPhoto(thumb);
    } catch {
      setError('Could not process that image.');
    }
  }

  async function onBarcodeDetected(code) {
    setScanning(false);
    setLookupState('loading');
    setLookupMsg('');
    try {
      const product = await lookupBarcode(code);
      if (!product) {
        setLookupState('error');
        setLookupMsg(`No product found for barcode ${code}. Try again or use manual entry.`);
        return;
      }
      if (product.noNutrition) {
        setLookupState('error');
        setLookupMsg(`Found "${product.name}" but it has no nutrition data. Use manual entry.`);
        return;
      }
      // Treat the scanned product like a food-DB item (per 100g) so the portion picker works.
      setSelected({
        name: product.brands ? `${product.name} — ${product.brands}` : product.name,
        calories: product.calories,
        protein: product.protein,
        carbs: product.carbs,
        fat: product.fat,
      });
      setGrams(100);
      if (product.image && !photo) setPhoto(product.image);
      setLookupState('idle');
    } catch {
      setLookupState('error');
      setLookupMsg('Lookup failed. Check your connection or use manual entry.');
    }
  }

  function rescan() {
    setSelected(null);
    setScanning(true);
    setLookupState('idle');
    setLookupMsg('');
  }

  function addFromSelected() {
    if (!selected) return setError('Please select a food first.');
    setError('');
    onAdd({
      id: crypto.randomUUID(),
      name: `${selected.name} (${grams} g)`,
      ...scaleFood(selected, grams),
      meal,
      photo,
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
      photo,
    });
    onClose();
  }

  const setM = (field) => (e) => setManual((m) => ({ ...m, [field]: e.target.value }));

  // Reusable portion + preview block for picked/scanned foods
  const portionBlock = selected && (
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
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Add Food</h2>
        <p className="modal-sub">Choose a food, scan a barcode, snap a photo, or enter values manually.</p>

        <div className="tabs">
          <button className={`tab ${tab === 'pick' ? 'active' : ''}`} onClick={() => switchTab('pick')}>Choose</button>
          <button className={`tab ${tab === 'scan' ? 'active' : ''}`} onClick={() => switchTab('scan')}>Scan</button>
          <button className={`tab ${tab === 'photo' ? 'active' : ''}`} onClick={() => switchTab('photo')}>Photo</button>
          <button className={`tab ${tab === 'manual' ? 'active' : ''}`} onClick={() => switchTab('manual')}>Manual</button>
        </div>

        <div className="form-group">
          <label>Meal</label>
          <select value={meal} onChange={(e) => setMeal(e.target.value)}>
            {MEALS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        {/* Hidden file inputs used by the Photo tab */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {/* ---- CHOOSE FOOD ---- */}
        {tab === 'pick' && (
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
                        onClick={() => { setSelected(f); setGrams(100); }}
                      >
                        <span className="food-db-name">{f.name}</span>
                        <span className="food-db-cal">{f.calories} kcal / 100 g</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            {portionBlock}
          </>
        )}

        {/* ---- SCAN BARCODE ---- */}
        {tab === 'scan' && (
          <>
            {scanning && lookupState !== 'loading' && (
              <Suspense fallback={<p className="scanner-hint" style={{ padding: '20px 0' }}>Loading scanner…</p>}>
                <BarcodeScanner onDetected={onBarcodeDetected} />
              </Suspense>
            )}
            {lookupState === 'loading' && (
              <p className="scanner-hint" style={{ padding: '20px 0' }}>Looking up product…</p>
            )}
            {lookupState === 'error' && (
              <>
                <p className="error-text">{lookupMsg}</p>
                <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={rescan}>
                  Scan again
                </button>
              </>
            )}
            {selected && lookupState === 'idle' && !scanning && (
              <>
                {portionBlock}
                <button type="button" className="add-food-btn" onClick={rescan}>Scan a different product</button>
              </>
            )}
          </>
        )}

        {/* ---- PHOTO ---- */}
        {tab === 'photo' && (
          <div>
            {photo ? (
              <div className="photo-preview-wrap">
                <img src={photo} alt="Meal" className="photo-preview" />
                <button type="button" className="btn btn-ghost" onClick={() => setPhoto(null)}>Remove photo</button>
              </div>
            ) : (
              <div className="photo-actions">
                <button type="button" className="btn btn-primary" onClick={() => cameraInputRef.current?.click()}>
                  Take photo
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => galleryInputRef.current?.click()}>
                  Choose from gallery
                </button>
              </div>
            )}
            <p className="scanner-hint" style={{ marginTop: 12 }}>
              Attach a photo, then confirm what you ate below. Pick a food from the list to set macros.
            </p>
            <input
              className="search-input"
              placeholder="Search foods to confirm what you ate"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <ul className="food-db-list">
              {Object.entries(filtered).map(([category, foods]) => (
                <li key={category}>
                  <div className="category-label">{category}</div>
                  <ul style={{ listStyle: 'none' }}>
                    {foods.map((f) => (
                      <li
                        key={f.name}
                        className={`food-db-item ${selected?.name === f.name ? 'selected' : ''}`}
                        onClick={() => { setSelected(f); setGrams(100); }}
                      >
                        <span className="food-db-name">{f.name}</span>
                        <span className="food-db-cal">{f.calories} kcal / 100 g</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            {portionBlock}
          </div>
        )}

        {/* ---- MANUAL ---- */}
        {tab === 'manual' && (
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

        {/* Shared footer actions for non-manual tabs */}
        {tab !== 'manual' && (
          <>
            {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={addFromSelected} disabled={!selected}>
                Add Food
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
