import { useState, useRef, useEffect } from 'react';
import { MONTHS_NL } from '../utils/timeCalc';

const DAYS_HEADER = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  const dow = new Date(year, month, 1).getDay();
  return dow === 0 ? 6 : dow - 1; // maandag = 0
}

export default function MiniCalendar({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const [y, m, d] = value.split('-').map(Number);
  const [calYear, setCalYear] = useState(y);
  const [calMonth, setCalMonth] = useState(m - 1);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      const [oy, om] = value.split('-').map(Number);
      setCalYear(oy);
      setCalMonth(om - 1);
    }
  }, [open, value]);

  function handleSelect(day) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setOpen(false);
  }

  function prevMonth() {
    if (calMonth === 0) {
      setCalYear((cy) => cy - 1);
      setCalMonth(11);
    } else setCalMonth((cm) => cm - 1);
  }

  function nextMonth() {
    if (calMonth === 11) {
      setCalYear((cy) => cy + 1);
      setCalMonth(0);
    } else setCalMonth((cm) => cm + 1);
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfWeek(calYear, calMonth);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const displayDate = `${d} ${MONTHS_NL[m - 1]} ${y}`;

  return (
    <div className="relative" ref={ref}>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Datum</label>
        <button
          onClick={() => setOpen((o) => !o)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-left text-gray-700 hover:border-gray-300 transition-colors w-full"
        >
          {displayDate}
        </button>
      </div>

      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-30 w-56">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={prevMonth}
              className="text-gray-400 hover:text-gray-600 px-1.5 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              ‹
            </button>
            <span className="text-xs font-medium text-gray-700">
              {MONTHS_NL[calMonth]} {calYear}
            </span>
            <button
              onClick={nextMonth}
              className="text-gray-400 hover:text-gray-600 px-1.5 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              ›
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_HEADER.map((dh) => (
              <div key={dh} className="text-center text-xs text-gray-300 py-1">
                {dh}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = dateStr === value;
              const isToday = dateStr === todayStr;
              return (
                <button
                  key={day}
                  onClick={() => handleSelect(day)}
                  className={`text-xs py-1.5 rounded-lg transition-colors text-center ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : isToday
                        ? 'text-blue-500 font-medium hover:bg-gray-100'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
