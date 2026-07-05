import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  templates: [],
};

export function useSettings(userId) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('settings')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.data) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.data });
        }
      });
  }, [userId]);

  async function persist(updated) {
    setSettings(updated);
    await supabase.from('settings').upsert({ user_id: userId, data: updated, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  }

  function updateWeekDay(day, value) {
    persist({ ...settings, weekSchema: { ...settings.weekSchema, [day]: value } });
  }

  function addTemplate(template) {
    if (settings.templates.length >= 4) return;
    persist({ ...settings, templates: [...settings.templates, template] });
  }

  function removeTemplate(idx) {
    persist({ ...settings, templates: settings.templates.filter((_, i) => i !== idx) });
  }

  function getTimesForDate(dateStr) {
    const dow = new Date(dateStr).getDay();
    return settings.weekSchema[dow] || null;
  }

  return { settings, updateWeekDay, addTemplate, removeTemplate, getTimesForDate };
}
