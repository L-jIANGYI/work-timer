import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useRecords } from './hooks/useRecords';
import { useSettings } from './hooks/useSettings';
import { MONTHS_NL } from './utils/timeCalc';
import { exportToExcel } from './utils/exportExcel';
import { supabase } from './lib/supabase';
import ClockPanel from './components/ClockPanel';
import SummaryBar from './components/SummaryBar';
import MonthTable from './components/MonthTable';
import HistoryMonths from './components/HistoryMonths';
import Settings from './components/Settings';
import MonthPicker from './components/MonthPicker';
import Auth from './components/Auth';

function getToday() {
  const t = new Date();
  return { year: t.getFullYear(), month: t.getMonth() };
}

async function getLatestMonthWithRecords(userId) {
  const { data } = await supabase.from('records').select('date').eq('user_id', userId).order('date', { ascending: false }).limit(1);
  if (!data || data.length === 0) return null;
  const [y, m] = data[0].date.split('-').map(Number);
  return { year: y, month: m - 1 };
}

export default function App() {
  const today = getToday();
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);
  const [latest, setLatest] = useState(null);
  const { records, addOrUpdate, remove } = useRecords(year, month, user?.id);
  const { settings, updateWeekDay, addTemplate, removeTemplate, getTimesForDate } = useSettings(user?.id);

  useEffect(() => {
    if (!user) return;
    getLatestMonthWithRecords(user.id).then(setLatest);
  }, [user, records]);

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

  async function handleSave(entry) {
    await addOrUpdate(entry);
    const [y, m] = entry.date.split('-').map(Number);
    setYear(y);
    setMonth(m - 1);
  }

  function goToLatest() {
    if (latest) {
      setYear(latest.year);
      setMonth(latest.month);
    }
  }

  const isLatest = !latest || (latest.year === year && latest.month === month);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Laden...</span>
      </div>
    );
  }

  if (!user) {
    return <Auth onSignIn={signIn} onSignUp={signUp} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          {/* First Row：Title, Setting, Log out */}
          <div className="flex items-center justify-between mb-3">
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
            <div className="flex items-center gap-2">
              <Settings settings={settings} onUpdateWeekDay={updateWeekDay} onAddTemplate={addTemplate} onRemoveTemplate={removeTemplate} />
              <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Uitloggen
              </button>
            </div>
          </div>

          {/* Second row：Month nav center */}
          <div className="flex items-center justify-center gap-3">
            <button onClick={prevMonth} className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
              ‹
            </button>
            <MonthPicker year={year} month={month} onChange={handleSelect} />
            <button onClick={nextMonth} className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
              ›
            </button>
          </div>
        </div>

        {/* Two column on large screens */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column */}
          <div className="lg:w-80 shrink-0">
            <ClockPanel onSave={handleSave} getTimesForDate={getTimesForDate} templates={settings.templates} />
            <HistoryMonths userId={user.id} currentYear={year} currentMonth={month} onSelect={handleSelect} />
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
