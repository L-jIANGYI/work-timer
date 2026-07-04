import { useState } from 'react';

const DEFAULT_SETTINGS = {
  weekSchema: {
    0: null,
    1: { start: '09:00', end: '17:30' },
    2: { start: '09:00', end: '17:30' },
    3: { start: '09:00', end: '17:30' },
    4: { start: '09:00', end: '17:30' },
    5: { start: '09:00', end: '17:30' },
    6: null,
  },
  templates: [{ label: 'Overwerk', start: '09:00', end: '20:00' }],
};

function loadSettings() {
  try {
    const raw = localStorage.getItem('wt_settings');
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  localStorage.setItem('wt_settings', JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  function updateWeekDay(day, value) {
    const updated = {
      ...settings,
      weekSchema: { ...settings.weekSchema, [day]: value },
    };
    setSettings(updated);
    saveSettings(updated);
  }

  function addTemplate(template) {
    if (settings.templates.length >= 4) return;
    const updated = {
      ...settings,
      templates: [...settings.templates, template],
    };
    setSettings(updated);
    saveSettings(updated);
  }

  function removeTemplate(idx) {
    const updated = {
      ...settings,
      templates: settings.templates.filter((_, i) => i !== idx),
    };
    setSettings(updated);
    saveSettings(updated);
  }

  function getTimesForDate(dateStr) {
    const dow = new Date(dateStr).getDay();
    return settings.weekSchema[dow] || null;
  }

  return { settings, updateWeekDay, addTemplate, removeTemplate, getTimesForDate };
}
