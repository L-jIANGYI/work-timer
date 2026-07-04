import { totalHours } from '../utils/timeCalc';

export default function SummaryBar({ records }) {
  const total = totalHours(records);
  const avg = records.length ? (total / records.length).toFixed(1) : '—';

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="text-xs text-gray-400 mb-1">Dagen gewerkt</div>
        <div className="text-2xl font-medium text-gray-800">{records.length}</div>
      </div>
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="text-xs text-blue-400 mb-1">Totaal uren</div>
        <div className="text-2xl font-medium text-blue-600">{total.toFixed(1)}u</div>
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="text-xs text-gray-400 mb-1">Gemiddeld per dag</div>
        <div className="text-2xl font-medium text-gray-800">{avg !== '—' ? `${avg}u` : '—'}</div>
      </div>
    </div>
  );
}
