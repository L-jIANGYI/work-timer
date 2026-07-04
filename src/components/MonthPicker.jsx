import { useState, useRef, useEffect } from 'react';
import { MONTHS_NL } from '../utils/timeCalc';

export default function MonthPicker({ year, month, onChange }) {
  const [open, setOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(year);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (open) setPickerYear(year);
  }, [open, year]);

  function handleSelect(m) {
    onChange(pickerYear, m);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-medium text-gray-700 min-w-32 text-center hover:text-blue-500 transition-colors"
      >
        {MONTHS_NL[month]} {year}
      </button>

      {open && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 z-30 w-56">
          {/* Year nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setPickerYear((y) => y - 1)}
              className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ‹
            </button>
            <span className="text-sm font-medium text-gray-700">{pickerYear}</span>
            <button
              onClick={() => setPickerYear((y) => y + 1)}
              className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ›
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-1">
            {MONTHS_NL.map((name, i) => {
              const isActive = i === month && pickerYear === year;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`text-xs py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {name.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
