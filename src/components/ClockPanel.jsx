import { useState, useEffect } from 'react';
import { calcHours, getTodayStr } from '../utils/timeCalc';
import MiniCalendar from './MiniCalender';

export default function ClockPanel({ onSave, getTimesForDate, templates }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayStr());

  useEffect(() => {
    const times = getTimesForDate(date);
    if (times) {
      setStart(times.start);
      setEnd(times.end);
    } else {
      setStart('');
      setEnd('');
    }
  }, [date, getTimesForDate]);

  function handleDateChange(newDate) {
    setDate(newDate);
  }

  function applyTemplate(t) {
    setStart(t.start);
    setEnd(t.end);
  }

  function handleSave() {
    if (!start) return;
    onSave({ date, start, end, note });
    setNote('');
  }

  const hours = calcHours(start, end);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
      {/* Tijden */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Begintijd</label>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Eindtijd</label>
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-1 block">Uren</label>
        <div className="text-2xl font-medium text-gray-800">{hours !== null ? `${hours}u` : '—'}</div>
      </div>

      {/* Datum */}
      <div className="mb-4">
        <MiniCalendar value={date} onChange={handleDateChange} />
      </div>

      {/* Snelle sjablonen */}
      {templates.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {templates.map((t, i) => (
            <button
              key={i}
              onClick={() => applyTemplate(t)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors"
            >
              {t.label} · {t.start}–{t.end}
            </button>
          ))}
        </div>
      )}

      {/* Opmerking */}
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Opmerking (optioneel)"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4"
      />

      <button
        onClick={handleSave}
        disabled={!start}
        className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm disabled:opacity-40 hover:bg-blue-700 transition-colors"
      >
        Opslaan
      </button>
    </div>
  );
}
