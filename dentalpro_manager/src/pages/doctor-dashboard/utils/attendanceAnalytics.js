// Análisis de patrones de asistencia por mes.
// Funciones puras: reciben la lista de citas y devuelven el resumen listo para pintar.
//
// Formato esperado de cada cita:
//   { date: 'YYYY-MM-DD', time: 'HH:MM', status: 'completed' | 'no-show' | 'cancelled' | ... }
// Solo las citas con estado "completed" cuentan como asistencia.

export const ATTENDED_STATUS = 'completed';
export const NO_SHOW_STATUS = 'no-show';
export const CANCELLED_STATUS = 'cancelled';

// Lunes primero (convención en México). `jsDay` es el valor de Date#getDay().
export const WEEKDAYS = [
  { jsDay: 1, label: 'Lunes', short: 'Lun' },
  { jsDay: 2, label: 'Martes', short: 'Mar' },
  { jsDay: 3, label: 'Miércoles', short: 'Mié' },
  { jsDay: 4, label: 'Jueves', short: 'Jue' },
  { jsDay: 5, label: 'Viernes', short: 'Vie' },
  { jsDay: 6, label: 'Sábado', short: 'Sáb' },
  { jsDay: 0, label: 'Domingo', short: 'Dom' }
];

// Franjas del día usadas en el resumen.
export const DAY_PARTS = [
  { key: 'morning', label: 'Mañana', range: 'antes de 12:00', from: 0, to: 12 },
  { key: 'midday', label: 'Mediodía', range: '12:00 – 15:59', from: 12, to: 16 },
  { key: 'evening', label: 'Tarde', range: '16:00 en adelante', from: 16, to: 24 }
];

const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const pad = (n) => String(n).padStart(2, '0');

export const toMonthKey = (year, monthIndex) => `${year}-${pad(monthIndex + 1)}`;

export const parseMonthKey = (key) => {
  const [y, m] = key.split('-').map(Number);
  return { year: y, monthIndex: m - 1 };
};

export const formatMonthLabel = (key) => {
  const { year, monthIndex } = parseMonthKey(key);
  return `${MONTH_NAMES[monthIndex]} ${year}`;
};

export const formatHourRange = (hour) => `${pad(hour)}:00 – ${pad(hour + 1)}:00`;

const joinList = (items) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Fecha local (evita corrimientos por zona horaria al usar new Date('YYYY-MM-DD')).
const parseLocalDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const parseHour = (timeStr) => Number(String(timeStr || '0').split(':')[0]);

/** Meses ('YYYY-MM') que tienen al menos una cita, ordenados del más antiguo al más reciente. */
export const getAvailableMonths = (appointments = []) => {
  const keys = new Set();
  appointments.forEach((a) => {
    if (a?.date) keys.add(a.date.slice(0, 7));
  });
  return Array.from(keys).sort();
};

/** Mes anterior a `key` en formato 'YYYY-MM'. */
export const previousMonthKey = (key) => {
  const { year, monthIndex } = parseMonthKey(key);
  return monthIndex === 0 ? toMonthKey(year - 1, 11) : toMonthKey(year, monthIndex - 1);
};

// Cuántas veces aparece cada día de la semana en el mes (hasta `today` si es el mes en curso).
const countWeekdayOccurrences = (year, monthIndex, today) => {
  const counts = {};
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const isCurrentMonth = today && today.getFullYear() === year && today.getMonth() === monthIndex;
  const lastDay = isCurrentMonth ? today.getDate() : daysInMonth;
  for (let d = 1; d <= lastDay; d++) {
    const jsDay = new Date(year, monthIndex, d).getDay();
    counts[jsDay] = (counts[jsDay] || 0) + 1;
  }
  return counts;
};

const percent = (part, total) => (total > 0 ? Math.round((part / total) * 100) : 0);

/**
 * Resume las asistencias de un mes.
 * @param {Array} appointments  Todas las citas (de cualquier mes).
 * @param {string} monthKey     Mes a resumir, 'YYYY-MM'.
 * @param {object} [options]
 * @param {Date}   [options.today]      Fecha de corte para el mes en curso (por defecto hoy).
 * @param {number[]} [options.hours]    Horas a mostrar en gráficas (por defecto 8–19).
 */
export const summarizeMonth = (appointments = [], monthKey, options = {}) => {
  const today = options.today || new Date();
  const hours = options.hours || Array.from({ length: 12 }, (_, i) => i + 8);
  const { year, monthIndex } = parseMonthKey(monthKey);

  const inMonth = appointments.filter((a) => a?.date?.startsWith(monthKey));
  const attended = inMonth.filter((a) => a.status === ATTENDED_STATUS);
  const noShows = inMonth.filter((a) => a.status === NO_SHOW_STATUS).length;
  const cancelled = inMonth.filter((a) => a.status === CANCELLED_STATUS).length;
  const total = attended.length;

  // Conteos día × hora
  const weekdayCounts = {};
  const hourCounts = {};
  const cellCounts = {};
  attended.forEach((a) => {
    const jsDay = parseLocalDate(a.date).getDay();
    const hour = parseHour(a.time);
    weekdayCounts[jsDay] = (weekdayCounts[jsDay] || 0) + 1;
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    const cell = `${jsDay}-${hour}`;
    cellCounts[cell] = (cellCounts[cell] || 0) + 1;
  });

  // Horas a mostrar: rango por defecto + cualquier hora con citas, recortando horas vacías en los extremos.
  let allHours = Array.from(new Set([...hours, ...Object.keys(hourCounts).map(Number)])).sort((a, b) => a - b);
  if (total > 0) {
    while (allHours.length && !hourCounts[allHours[0]]) allHours = allHours.slice(1);
    while (allHours.length && !hourCounts[allHours[allHours.length - 1]]) allHours = allHours.slice(0, -1);
  }

  const occurrences = countWeekdayOccurrences(year, monthIndex, today);

  const byWeekday = WEEKDAYS.map((w) => {
    const count = weekdayCounts[w.jsDay] || 0;
    const days = occurrences[w.jsDay] || 0;
    return {
      ...w,
      count,
      pct: percent(count, total),
      avgPerDay: days > 0 ? Math.round((count / days) * 10) / 10 : 0
    };
  });

  const byHour = allHours.map((hour) => ({
    hour,
    label: `${pad(hour)}:00`,
    count: hourCounts[hour] || 0,
    pct: percent(hourCounts[hour] || 0, total)
  }));

  const byDayPart = DAY_PARTS.map((p) => {
    const count = byHour.filter((h) => h.hour >= p.from && h.hour < p.to).reduce((s, h) => s + h.count, 0);
    return { ...p, count, pct: percent(count, total) };
  });

  const heatmap = WEEKDAYS.map((w) => ({
    ...w,
    cells: allHours.map((hour) => ({ hour, count: cellCounts[`${w.jsDay}-${hour}`] || 0 }))
  }));
  const heatmapMax = Math.max(0, ...Object.values(cellCounts));

  const maxDayCount = Math.max(0, ...byWeekday.map((d) => d.count));
  const tiedTopDays = maxDayCount > 0 ? byWeekday.filter((d) => d.count === maxDayCount) : [];
  const topDays = [...byWeekday].filter((d) => d.count > 0).sort((a, b) => b.count - a.count || b.avgPerDay - a.avgPerDay).slice(0, 3);
  const topHours = [...byHour].filter((h) => h.count > 0).sort((a, b) => b.count - a.count || a.hour - b.hour).slice(0, 3);
  const quietDays = [...byWeekday].filter((d) => (occurrences[d.jsDay] || 0) > 0 && d.count > 0).sort((a, b) => a.count - b.count).slice(0, 1);

  let busiestSlot = null;
  Object.entries(cellCounts).forEach(([key, count]) => {
    if (!busiestSlot || count > busiestSlot.count) {
      const [jsDay, hour] = key.split('-').map(Number);
      busiestSlot = { jsDay, hour, count, day: WEEKDAYS.find((w) => w.jsDay === jsDay) };
    }
  });

  const topDayPart = [...byDayPart].sort((a, b) => b.count - a.count)[0];

  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;

  // Comparación con el mes anterior. Si el mes está en curso se compara contra el
  // mismo periodo (día 1 al día de hoy) del mes anterior para no comparar un mes parcial.
  const prevKey = previousMonthKey(monthKey);
  const cutoffDay = isCurrentMonth ? today.getDate() : 31;
  const prevAttended = appointments.filter(
    (a) => a?.date?.startsWith(prevKey) && a.status === ATTENDED_STATUS && Number(a.date.slice(8, 10)) <= cutoffDay
  ).length;
  const change = prevAttended > 0 ? Math.round(((total - prevAttended) / prevAttended) * 100) : null;

  const noShowRate = percent(noShows, total + noShows);

  // Resumen en texto
  const insights = [];
  if (total > 0) {
    if (tiedTopDays.length > 1) {
      insights.push(
        `Empate en el día con más asistencia: ${joinList(tiedTopDays.map((d) => d.label.toLowerCase()))}, con ${maxDayCount} pacientes cada uno.`
      );
    } else if (topDays[0]) {
      const second = topDays[1] ? `, seguido del ${topDays[1].label.toLowerCase()} (${topDays[1].count})` : '';
      insights.push(
        `El día con más asistencia fue el ${topDays[0].label.toLowerCase()} con ${topDays[0].count} pacientes (${topDays[0].pct}% del mes)${second}.`
      );
    }
    if (topHours[0]) {
      insights.push(
        `El horario más concurrido fue de ${formatHourRange(topHours[0].hour)} con ${topHours[0].count} pacientes.`
      );
    }
    if (topDayPart && topDayPart.count > 0) {
      insights.push(`La ${topDayPart.label.toLowerCase()} (${topDayPart.range}) concentró el ${topDayPart.pct}% de las asistencias.`);
    }
    if (busiestSlot && busiestSlot.count > 1) {
      insights.push(
        `El bloque más saturado fue ${busiestSlot.day.label.toLowerCase()} a las ${pad(busiestSlot.hour)}:00 (${busiestSlot.count} pacientes en el mes).`
      );
    }
    if (quietDays[0] && topDays[0] && quietDays[0].jsDay !== topDays[0].jsDay) {
      insights.push(
        `El ${quietDays[0].label.toLowerCase()} fue el día con menos asistencia (${quietDays[0].count}); conviene usarlo para tratamientos largos o promociones.`
      );
    }
    if (noShows > 0) {
      insights.push(
        noShows === 1
          ? `1 paciente no se presentó (${noShowRate}% de inasistencia).`
          : `${noShows} pacientes no se presentaron (${noShowRate}% de inasistencia).`
      );
    }
    if (change !== null) {
      const dir = change > 0 ? 'más' : 'menos';
      insights.push(
        change === 0
          ? 'Misma cantidad de asistencias que el mes anterior.'
          : `${Math.abs(change)}% ${dir} asistencias que en ${isCurrentMonth ? `el mismo periodo de ${formatMonthLabel(prevKey)}` : formatMonthLabel(prevKey)}.`
      );
    }
  }

  return {
    monthKey,
    monthLabel: capitalize(formatMonthLabel(monthKey)),
    isCurrentMonth,
    totals: { attended: total, noShows, cancelled, scheduled: inMonth.length, noShowRate },
    comparison: { previousMonthKey: prevKey, previousAttended: prevAttended, change, samePeriod: isCurrentMonth },
    byWeekday,
    byHour,
    byDayPart,
    heatmap,
    heatmapMax,
    topDays,
    tiedTopDays,
    topHours,
    busiestSlot,
    insights
  };
};
