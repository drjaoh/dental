// Análisis de asistencia de pacientes: días y horarios más frecuentes por mes.
// Una "visita" es un objeto { date: 'YYYY-MM-DD', time: 'HH:mm', status }.
// Sólo se cuentan como asistencias las visitas con estado "completada".

export const WEEKDAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const WEEKDAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const ATTENDED_STATUS = 'completada';

// Convierte 'YYYY-MM-DD' en fecha local (evita desfases por zona horaria).
const parseLocalDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Índice de día con lunes = 0 ... domingo = 6.
export const weekdayIndex = (iso) => (parseLocalDate(iso).getDay() + 6) % 7;

export const monthKey = (year, month) => `${year}-${String(month + 1).padStart(2, '0')}`;

export const formatHour = (h) => `${String(h).padStart(2, '0')}:00`;
export const formatHourRange = (h) => `${formatHour(h)} – ${formatHour(h + 1)}`;

export const getTimeBlock = (hour) => {
  if (hour < 12) return 'Mañana';
  if (hour < 16) return 'Mediodía';
  return 'Tarde';
};

const argmax = (arr) => arr.reduce((best, v, i) => (v > arr[best] ? i : best), 0);

// Cuántas veces aparece cada día de la semana en el mes (para promedios por día).
const weekdayOccurrences = (year, month) => {
  const counts = Array(7).fill(0);
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    counts[(new Date(year, month, d).getDay() + 6) % 7] += 1;
  }
  return counts;
};

/**
 * Resume la asistencia de un mes concreto.
 * @param {Array} visits  lista de visitas
 * @param {number} year
 * @param {number} month  0-11
 * @param {{ openHour?: number, closeHour?: number, untilDay?: number }} options
 *        horario de la clínica y, opcionalmente, último día del mes a considerar
 *        (para comparar periodos equivalentes cuando el mes está en curso)
 */
export const summarizeMonth = (visits, year, month, { openHour = 8, closeHour = 20, untilDay } = {}) => {
  const key = monthKey(year, month);
  const inMonth = visits.filter(
    (v) => v?.date?.startsWith(key) && (!untilDay || Number(v.date.slice(8, 10)) <= untilDay)
  );
  const attended = inMonth.filter((v) => v.status === ATTENDED_STATUS);
  const noShows = inMonth.filter((v) => v.status === 'no_asistio').length;

  const hours = [];
  for (let h = openHour; h < closeHour; h++) hours.push(h);

  const byWeekday = Array(7).fill(0);
  const byHour = Array(hours.length).fill(0);
  const heatmap = Array.from({ length: 7 }, () => Array(hours.length).fill(0));
  const byBlock = { Mañana: 0, Mediodía: 0, Tarde: 0 };

  attended.forEach((v) => {
    const wd = weekdayIndex(v.date);
    const h = parseInt(v.time.split(':')[0], 10);
    byWeekday[wd] += 1;
    byBlock[getTimeBlock(h)] += 1;
    const hi = h - openHour;
    if (hi >= 0 && hi < hours.length) {
      byHour[hi] += 1;
      heatmap[wd][hi] += 1;
    }
  });

  const total = attended.length;
  const occurrences = weekdayOccurrences(year, month);

  const weekdayData = WEEKDAYS.map((name, i) => ({
    day: WEEKDAYS_SHORT[i],
    name,
    visitas: byWeekday[i],
    promedio: occurrences[i] ? +(byWeekday[i] / occurrences[i]).toFixed(1) : 0,
    porcentaje: total ? Math.round((byWeekday[i] / total) * 100) : 0
  }));

  const hourData = hours.map((h, i) => ({
    hour: formatHour(h),
    h,
    visitas: byHour[i],
    porcentaje: total ? Math.round((byHour[i] / total) * 100) : 0
  }));

  // Ranking de días (descendente), excluyendo días sin visitas.
  const dayRanking = [...weekdayData]
    .filter((d) => d.visitas > 0)
    .sort((a, b) => b.visitas - a.visitas);

  const quietDays = [...weekdayData]
    .filter((d) => d.visitas > 0)
    .sort((a, b) => a.visitas - b.visitas);

  const hourRanking = [...hourData]
    .filter((d) => d.visitas > 0)
    .sort((a, b) => b.visitas - a.visitas);

  // Celda pico día × hora.
  let peakCell = null;
  heatmap.forEach((row, wd) => row.forEach((count, hi) => {
    if (count > 0 && (!peakCell || count > peakCell.count)) {
      peakCell = { weekday: WEEKDAYS[wd], hour: hours[hi], count };
    }
  }));

  const blockEntries = Object.entries(byBlock);
  const topBlock = total ? blockEntries[argmax(blockEntries.map(([, c]) => c))] : null;

  return {
    year,
    month,
    label: `${MONTHS[month]} ${year}`,
    untilDay: untilDay || null,
    total,
    scheduled: inMonth.length,
    noShows,
    attendanceRate: inMonth.length ? Math.round((total / inMonth.length) * 100) : 0,
    weekdayData,
    hourData,
    hours,
    heatmap,
    heatmapMax: Math.max(0, ...heatmap.flat()),
    byBlock,
    topBlock: topBlock ? { name: topBlock[0], count: topBlock[1], porcentaje: Math.round((topBlock[1] / total) * 100) } : null,
    topDays: dayRanking.slice(0, 2),
    quietestDay: quietDays[0] || null,
    topHours: hourRanking.slice(0, 3),
    peakCell
  };
};

const pctChange = (curr, prev) => {
  if (!prev) return null;
  return Math.round(((curr - prev) / prev) * 100);
};

/** Texto en lenguaje natural con el resumen del mes. */
export const buildNarrative = (summary, previous) => {
  if (!summary.total) {
    return [`No hay asistencias registradas en ${summary.label}.`];
  }
  const lines = [];
  const [d1, d2] = summary.topDays;
  const daysText = d2 ? `los ${d1.name.toLowerCase()} (${d1.porcentaje}%) y ${d2.name.toLowerCase()} (${d2.porcentaje}%)` : `los ${d1.name.toLowerCase()} (${d1.porcentaje}%)`;
  const soFar = summary.untilDay ? ' (en lo que va del mes)' : '';
  lines.push(`En ${summary.label}${soFar} asistieron ${summary.total} pacientes; los días con más afluencia fueron ${daysText}.`);

  const [h1] = summary.topHours;
  if (h1) {
    lines.push(`El horario más concurrido fue de ${formatHourRange(h1.h)} y el bloque de la ${summary.topBlock.name.toLowerCase()} concentró el ${summary.topBlock.porcentaje}% de las visitas.`);
  }
  if (summary.peakCell) {
    lines.push(`Momento pico: ${summary.peakCell.weekday.toLowerCase()} a las ${formatHour(summary.peakCell.hour)} (${summary.peakCell.count} visitas en el mes).`);
  }
  if (summary.quietestDay && summary.quietestDay.name !== d1.name) {
    lines.push(`El día más tranquilo fue el ${summary.quietestDay.name.toLowerCase()}: buena oportunidad para agendar tratamientos largos o promociones.`);
  }
  if (previous?.total) {
    const change = pctChange(summary.total, previous.total);
    const prevTop = previous.topDays[0];
    const trend = change > 0 ? `${change}% más` : change < 0 ? `${Math.abs(change)}% menos` : 'la misma cantidad de';
    const period = previous.untilDay ? `el mismo periodo de ${previous.label} (del 1 al ${previous.untilDay})` : previous.label;
    let text = `Frente a ${period} hubo ${trend} asistencias`;
    if (prevTop && prevTop.name !== d1.name) {
      text += `, y el día preferido cambió de ${prevTop.name.toLowerCase()} a ${d1.name.toLowerCase()}`;
    }
    lines.push(`${text}.`);
  }
  return lines;
};

/** Resumen compacto de los últimos N meses (el más reciente al final). */
export const buildMonthlyHistory = (visits, year, month, count = 6, options) => {
  const result = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(year, month - i, 1);
    result.push(summarizeMonth(visits, d.getFullYear(), d.getMonth(), options));
  }
  return result;
};

export { pctChange };
