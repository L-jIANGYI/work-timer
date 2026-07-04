import { useState } from 'react';
import { MONTHS_NL, totalHours } from '../utils/timeCalc';

function loadAllMonths() {
  return Object.keys(localStorage)
    .filter((k) => k.startsWith('wt_'))
    .map((k) => {
      const [, year, month] = k.split('_');
      const records = JSON.parse(localStorage.getItem(k) || '[]');
      return { year: Number(year), month: Number(month) - 1, records };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

export default function HistoryMonths({ currentYear, currentMonth, onSelect }) {
  const [open, setOpen] = useState(false);
  const months = loadAllMonths().filter((m) => !(m.year === currentYear && m.month === currentMonth));

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
        <span>{open ? '▾' : '▸'}</span>
        Eerdere maanden
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {months.length === 0 && <div className="text-sm text-gray-300">Geen eerdere maanden</div>}
          {months.map((m) => {
            const total = totalHours(m.records);
            return (
              <button
                key={`${m.year}_${m.month}`}
                onClick={() => onSelect(m.year, m.month)}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 text-sm transition-colors text-left"
              >
                <span className="text-gray-700">
                  {MONTHS_NL[m.month]} {m.year}
                </span>
                <span className="text-gray-400">
                  {m.records.length} dagen · {total.toFixed(1)}u
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
