export default function DailySummary({ totals, goals }) {
  const calPct = Math.min((totals.calories / (goals.calories || 1)) * 100, 100);
  const remaining = Math.max(goals.calories - totals.calories, 0);

  const macros = [
    { key: 'protein', label: 'Protein' },
    { key: 'carbs',   label: 'Carbs'   },
    { key: 'fat',     label: 'Fat'     },
  ];

  return (
    <div className="summary-card">
      <div className="summary-cal">
        <span className="cal-number">{totals.calories}</span>
        <span className="cal-label">kcal eaten</span>
      </div>
      <p className="cal-goal">
        Goal: <span>{goals.calories} kcal</span> &nbsp;·&nbsp; Remaining: <span>{remaining} kcal</span>
      </p>

      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${calPct}%` }} />
      </div>

      <div className="macros-row">
        {macros.map(({ key, label }) => {
          const pct = Math.min((totals[key] / (goals[key] || 1)) * 100, 100);
          return (
            <div className="macro-item" key={key}>
              <div className="macro-label">{label}</div>
              <div className="macro-value">
                {totals[key]}<span style={{ fontSize: '0.7em', fontWeight: 400 }}>g</span>
              </div>
              <div className="macro-goal-text">/ {goals[key]}g</div>
              <div className="macro-bar">
                <div className="macro-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
