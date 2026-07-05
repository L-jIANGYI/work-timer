import { calcHours, formatDateNL, getDayOfWeek } from '../utils/timeCalc';

export default function MonthTable({ records, onDelete }) {
  if (records.length === 0) {
    return <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400 text-sm">Geen registraties deze maand</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto mb-6">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-xs text-gray-400 font-normal">
            <th className="text-left px-4 py-3">Datum</th>
            <th className="text-left px-4 py-3">Dag</th>
            <th className="text-left px-4 py-3">Begin</th>
            <th className="text-left px-4 py-3">Einde</th>
            <th className="text-left px-4 py-3">Uren</th>
            <th className="text-left px-4 py-3">Opmerking</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => {
            const hours = calcHours(r.start, r.end);
            return (
              <tr key={r.date} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm">{formatDateNL(r.date)}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{getDayOfWeek(r.date)}</td>
                <td className="px-4 py-3 text-sm">{r.start || '—'}</td>
                <td className="px-4 py-3 text-sm">{r.end || '—'}</td>
                <td className="px-4 py-3 text-sm font-medium">{hours !== null ? `${hours}u` : '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{r.note || ''}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onDelete(r.date)} className="text-gray-300 hover:text-red-400 text-xs transition-colors">
                    verwijderen
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
