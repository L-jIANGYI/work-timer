import { useState } from 'react';
import { useRecords } from './hooks/useRecords';
import { MONTHS_NL } from './utils/timeCalc';
import { exportToExcel } from './utils/exportExcel';
import ClockPanel from './components/ClockPanel';
import SummaryBar from './components/SummaryBar';
import MonthTable from './components/MonthTable';
import HistoryMonths from './components/HistoryMonths';

function getToday() {
  const t = new Date();
  return { year: t.getFullYear(), month: t.getMonth() };
}

export default function App() {
  const today = getToday();
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);
  const { records, addOrUpdate, remove } = useRecords(year, month);

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  }

  function handleSelect(y, m) {
    setYear(y);
    setMonth(m);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-gray-800">Urenregistratie</h1>
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
              ‹
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-32 text-center">
              {MONTHS_NL[month]} {year}
            </span>
            <button onClick={nextMonth} className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
              ›
            </button>
          </div>
        </div>

        {/* Two column on large screens */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column */}
          <div className="lg:w-72 shrink-0">
            <ClockPanel onSave={addOrUpdate} />
            <HistoryMonths currentYear={year} currentMonth={month} onSelect={handleSelect} />
          </div>

          {/* Right column */}
          <div className="flex-1 min-w-0">
            <SummaryBar records={records} />
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                {MONTHS_NL[month]} {year}
              </span>
              <button
                onClick={() => exportToExcel(records, year, month)}
                disabled={records.length === 0}
                className="text-xs text-gray-400 hover:text-blue-500 disabled:opacity-30 transition-colors"
              >
                Exporteren naar Excel ↓
              </button>
            </div>
            <MonthTable records={records} onDelete={remove} />
          </div>
        </div>
      </div>
    </div>
  );
}
