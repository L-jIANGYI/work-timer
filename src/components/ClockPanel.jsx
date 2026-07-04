import { useState } from 'react';
import { calcHours, getTodayStr } from '../utils/timeCalc';

export default function ClockPanel({ onSave }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayStr());

  const hours = calcHours(start, end);

  function handleSave() {
    if (!start) return;
    onSave({ date, start, end, note });
    setNote('');
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Begintijd</label>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Eindtijd</label>
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Uren</label>
          <div className="text-2xl font-medium text-gray-800 pt-1">{hours !== null ? `${hours}u` : '—'}</div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-400 mb-1 block">Datum</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
      </div>

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
