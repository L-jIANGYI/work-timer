import * as XLSX from 'xlsx';
import { calcHours, formatDateNL, getDayOfWeek, totalHours, MONTHS_NL } from './timeCalc';

export function exportToExcel(records, year, month) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  const rows = sorted.map((r) => ({
    Datum: formatDateNL(r.date),
    Dag: getDayOfWeek(r.date),
    Begintijd: r.start || '',
    Eindtijd: r.end || '',
    Uren: calcHours(r.start, r.end) ?? '',
    Opmerking: r.note || '',
  }));

  rows.push({});
  rows.push({ Datum: 'Totaal', Uren: parseFloat(totalHours(records).toFixed(1)) });

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 14 }, { wch: 6 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 20 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${MONTHS_NL[month]} ${year}`);
  XLSX.writeFile(wb, `uren_${year}_${String(month + 1).padStart(2, '0')}.xlsx`);
}
