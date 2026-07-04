import { useState } from 'react';

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

  function addOrUpdate(entry) {
    const updated = [...records];
    const idx = updated.findIndex((r) => r.date === entry.date);
    if (idx >= 0) updated[idx] = entry;
    else updated.push(entry);
    updated.sort((a, b) => a.date.localeCompare(b.date));
    setRecords(updated);
    saveRecords(year, month, updated);
  }

  function remove(date) {
    const updated = records.filter((r) => r.date !== date);
    setRecords(updated);
    saveRecords(year, month, updated);
  }

  return { records, addOrUpdate, remove };
}
