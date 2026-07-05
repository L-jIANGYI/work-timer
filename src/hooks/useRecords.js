import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRecords(year, month, userId) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

    supabase
      .from('records')
      .select('*')
      .eq('user_id', userId)
      .like('date', `${monthStr}-%`)
      .order('date')
      .then(({ data }) => {
        setRecords(
          data?.map((r) => ({
            date: r.date,
            start: r.start_time,
            end: r.end_time,
            note: r.note,
            id: r.id,
          })) || []
        );
        setLoading(false);
      });
  }, [year, month, userId]);

  async function addOrUpdate(entry) {
    const [y, m] = entry.date.split('-').map(Number);
    const entryYear = y;
    const entryMonth = m - 1;

    const { data: existing } = await supabase.from('records').select('id').eq('user_id', userId).eq('date', entry.date).single();

    if (existing) {
      await supabase
        .from('records')
        .update({
          start_time: entry.start,
          end_time: entry.end,
          note: entry.note,
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('records').insert({
        user_id: userId,
        date: entry.date,
        start_time: entry.start,
        end_time: entry.end,
        note: entry.note,
      });
    }

    if (entryYear === year && entryMonth === month) {
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
      const { data } = await supabase.from('records').select('*').eq('user_id', userId).like('date', `${monthStr}-%`).order('date');
      setRecords(
        data?.map((r) => ({
          date: r.date,
          start: r.start_time,
          end: r.end_time,
          note: r.note,
          id: r.id,
        })) || []
      );
    }
  }

  async function remove(date) {
    await supabase.from('records').delete().eq('user_id', userId).eq('date', date);
    setRecords((prev) => prev.filter((r) => r.date !== date));
  }

  return { records, loading, addOrUpdate, remove };
}
