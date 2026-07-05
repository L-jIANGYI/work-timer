import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MONTHS_NL, calcHours } from '../utils/timeCalc';

export default function HistoryMonths({ userId, currentYear, currentMonth, onSelect }) {
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    if (!userId || !open) return;
    supabase
      .from('records')
      .select('date, start_time, end_time')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!data) return;
        const map = {};
        data.forEach((r) => {
          const key = r.date.slice(0, 7);
          if (!map[key]) map[key] = [];
          map[key].push({ start: r.start_time, end: r.end_time });
        });
        const result = Object.entries(map)
          .map(([key, recs]) => {
            const [y, m] = key.split('-').map(Number);
            const total = recs.reduce((s, r) => s + (calcHours(r.start, r.end) || 0), 0);
            return { year: y, month: m - 1, count: recs.length, total };
          })
          .filter((m) => !(m.year === currentYear && m.month === currentMonth))
          .sort((a, b) => b.year - a.year || b.month - a.month);
        setMonths(result);
      });
  }, [userId, open, currentYear, currentMonth]);

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
        <span>{open ? '▾' : '▸'}</span>
        Eerdere maanden
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {months.length === 0 && <div className="text-sm text-gray-300">Geen eerdere maanden</div>}
          {months.map((m) => (
            <button
              key={`${m.year}_${m.month}`}
              onClick={() => onSelect(m.year, m.month)}
              className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 text-sm transition-colors text-left"
            >
              <span className="text-gray-700">
                {MONTHS_NL[m.month]} {m.year}
              </span>
              <span className="text-gray-400">
                {m.count} dagen · {m.total.toFixed(1)}u
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
