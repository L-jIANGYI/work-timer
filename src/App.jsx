import { useState } from 'react';
import { useRecords } from './hooks/useRecords';
import { useSettings } from './hooks/useSettings';
import { MONTHS_NL } from './utils/timeCalc';
import { exportToExcel } from './utils/exportExcel';
import ClockPanel from './components/ClockPanel';
import SummaryBar from './components/SummaryBar';
import MonthTable from './components/MonthTable';
import HistoryMonths from './components/HistoryMonths';
import Settings from './components/Settings';
import MonthPicker from './components/MonthPicker';

function getToday() {
  const t = new Date();
  return { year: t.getFullYear(), month: t.getMonth() };
}

function getLatestMonthWithRecords() {
  const keys = Object.keys(localStorage)
    .filter((k) => /^wt_\d{4}_\d{2}$/.test(k))
    .sort()
    .reverse();
  if (keys.length === 0) return null;
  const [, year, month] = keys[0].split('_');
  return { year: Number(year), month: Number(month) - 1 };
}

export default function App() {
  const today = getToday();
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);
  const { records, addOrUpdate, remove } = useRecords(year, month);
  const { settings, updateWeekDay, addTemplate, removeTemplate, getTimesForDate } = useSettings();

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

  function handleSave(entry) {
    addOrUpdate(entry);
    const [y, m] = entry.date.split('-').map(Number);
    setYear(y);
    setMonth(m - 1);
  }

  function goToLatest() {
    const latest = getLatestMonthWithRecords();
    if (latest) {
      setYear(latest.year);
      setMonth(latest.month);
    }
  }

  const isLatest = (() => {
    const latest = getLatestMonthWithRecords();
    if (!latest) return true;
    return latest.year === year && latest.month === month;
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium text-gray-800">Urenregistratie</h1>
            {!isLatest && (
              <button
                onClick={goToLatest}
                className="text-xs text-blue-500 hover:text-blue-700 border border-blue-200 rounded-lg px-2 py-1 transition-colors"
              >
                Naar laatste ↑
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
              ‹
            </button>
            <MonthPicker year={year} month={month} onChange={handleSelect} />
            <button onClick={nextMonth} className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
              ›
            </button>
            <Settings settings={settings} onUpdateWeekDay={updateWeekDay} onAddTemplate={addTemplate} onRemoveTemplate={removeTemplate} />
          </div>
        </div>

        {/* Two column on large screens */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column */}
          <div className="lg:w-80 shrink-0">
            <ClockPanel onSave={handleSave} getTimesForDate={getTimesForDate} templates={settings.templates} />
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
