import { useState } from 'react';

const DAYS_NL = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function Settings({ settings, onUpdateWeekDay, onAddTemplate, onRemoveTemplate }) {
  const [open, setOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('17:30');

  function handleDayToggle(day) {
    const current = settings.weekSchema[day];
    if (current) {
      onUpdateWeekDay(day, null);
    } else {
      onUpdateWeekDay(day, { start: '09:00', end: '17:30' });
    }
  }

  function handleDayTime(day, field, value) {
    const current = settings.weekSchema[day];
    if (!current) return;
    onUpdateWeekDay(day, { ...current, [field]: value });
  }

  function handleAddTemplate() {
    if (!newLabel.trim() || !newStart || !newEnd) return;
    onAddTemplate({ label: newLabel.trim(), start: newStart, end: newEnd });
    setNewLabel('');
    setNewStart('09:00');
    setNewEnd('17:30');
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
        aria-label="Instellingen"
      >
        ⚙
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 flex justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-xl z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-medium text-gray-800">Instellingen</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                ✕
              </button>
            </div>

            <div className="px-5 py-4">
              {/* Week schema */}
              <div className="mb-6">
                <div className="text-xs text-gray-400 mb-3">Weekschema</div>
                <div className="flex flex-col gap-2">
                  {DAY_ORDER.map((day) => {
                    const times = settings.weekSchema[day];
                    return (
                      <div key={day} className="flex items-center gap-2">
                        <button
                          onClick={() => handleDayToggle(day)}
                          className={`text-xs w-8 rounded-md py-1 border transition-colors shrink-0 ${
                            times ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-300'
                          }`}
                        >
                          {DAYS_NL[day]}
                        </button>
                        {times ? (
                          <>
                            <input
                              type="time"
                              value={times.start}
                              onChange={(e) => handleDayTime(day, 'start', e.target.value)}
                              className="border border-gray-200 rounded-lg px-2 py-1 text-sm flex-1"
                            />
                            <span className="text-gray-300 text-xs">–</span>
                            <input
                              type="time"
                              value={times.end}
                              onChange={(e) => handleDayTime(day, 'end', e.target.value)}
                              className="border border-gray-200 rounded-lg px-2 py-1 text-sm flex-1"
                            />
                          </>
                        ) : (
                          <span className="text-xs text-gray-300 ml-1">Vrij</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Templates */}
              <div>
                <div className="text-xs text-gray-400 mb-3">
                  Snelle sjablonen
                  <span className="ml-1 text-gray-300">({settings.templates.length}/4)</span>
                </div>

                <div className="flex flex-col gap-2 mb-3">
                  {settings.templates.map((t, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-700">{t.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {t.start}–{t.end}
                        </span>
                        <button onClick={() => onRemoveTemplate(i)} className="text-gray-300 hover:text-red-400 transition-colors text-sm">
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {settings.templates.length < 4 && (
                  <div className="border border-dashed border-gray-200 rounded-lg p-3 flex flex-col gap-2">
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Naam sjabloon"
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={newStart}
                        onChange={(e) => setNewStart(e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm flex-1"
                      />
                      <span className="text-gray-300 text-xs">–</span>
                      <input
                        type="time"
                        value={newEnd}
                        onChange={(e) => setNewEnd(e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm flex-1"
                      />
                    </div>
                    <button
                      onClick={handleAddTemplate}
                      disabled={!newLabel.trim()}
                      className="text-sm text-blue-500 hover:text-blue-700 disabled:opacity-30 text-left transition-colors"
                    >
                      + Toevoegen
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
