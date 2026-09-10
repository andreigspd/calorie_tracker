export default function DailySummary({ totals, goals }) {
  const calPct = Math.min((totals.calories / goals.calories) * 100, 100);
  const remaining = Math.max(goals.calories - totals.calories, 0);

  const macros = [
    { key: 'protein', label: 'Protein', color: 'var(--protein)', unit: 'g' },
    { key: 'carbs',   label: 'Carbs',   color: 'var(--carbs)',   unit: 'g' },
    { key: 'fat',     label: 'Fat',     color: 'var(--fat)',     unit: 'g' },
  ];

  return (
    <div className="summary-card">
      <div className="summary-cal">
        <span className="cal-number">{totals.calories}</span>
        <span className="cal-label">kcal eaten</span>
      </div>
      <p className="cal-goal">
        Goal: <span>{goals.calories} kcal</span> &nbsp;·&nbsp; Remaining: <span style={{ color: remaining === 0 ? 'var(--accent2)' : 'var(--cal)' }}>{remaining} kcal</span>
      </p>

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${calPct}%`,
            background: calPct >= 100
              ? 'var(--accent2)'
              : 'linear-gradient(90deg, var(--accent), var(--cal))',
          }}
        />
      </div>

      <div className="macros-row">
        {macros.map(({ key, label, color, unit }) => {
          const pct = Math.min((totals[key] / (goals[key] || 1)) * 100, 100);
          return (
            <div className="macro-item" key={key}>
              <div className="macro-label" style={{ color }}>{label}</div>
              <div className="macro-value" style={{ color }}>
                {totals[key]}<span style={{ fontSize: '0.7em', fontWeight: 400 }}>{unit}</span>
              </div>
              <div className="macro-goal-text">/ {goals[key]}{unit}</div>
              <div className="macro-bar">
                <div
                  className="macro-bar-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
