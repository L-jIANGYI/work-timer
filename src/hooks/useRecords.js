import { useState, useEffect } from 'react';

function storageKey(year, month) {
  return `wt_${year}_${String(month + 1).padStart(2, '0')}`;
}

function loadRecords(year, month) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(year, month)) || '[]');
  } catch {
    return [];
  }
}

function saveRecords(year, month, records) {
  localStorage.setItem(storageKey(year, month), JSON.stringify(records));
}

export function useRecords(year, month) {
  const [records, setRecords] = useState(() => loadRecords(year, month));

  useEffect(() => {
    setRecords(loadRecords(year, month));
  }, [year, month]);

  function addOrUpdate(entry) {
    const [y, m] = entry.date.split('-').map(Number);
    const entryYear = y;
    const entryMonth = m - 1;

    const existing = loadRecords(entryYear, entryMonth);
    const idx = existing.findIndex((r) => r.date === entry.date);
    if (idx >= 0) existing[idx] = entry;
    else existing.push(entry);
    existing.sort((a, b) => a.date.localeCompare(b.date));
    saveRecords(entryYear, entryMonth, existing);

    if (entryYear === year && entryMonth === month) {
      setRecords([...existing]);
    }
  }

  function remove(date) {
    const updated = records.filter((r) => r.date !== date);
    setRecords(updated);
    saveRecords(year, month, updated);
  }

  return { records, addOrUpdate, remove };
}
