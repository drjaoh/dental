// Historial simulado de visitas (12 meses) para el análisis de asistencia.
// Cuando exista un backend, reemplazar generateVisitHistory() por los datos reales
// con el formato { id, date: 'YYYY-MM-DD', time: 'HH:mm', status }.

// PRNG determinista para que los datos no cambien en cada render/recarga.
const mulberry32 = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Peso relativo de citas por día (lunes..domingo). Domingo cerrado.
const BASE_DAY_WEIGHTS = [1.0, 1.25, 0.9, 1.2, 1.05, 0.7, 0];
// Peso por hora de 08:00 a 19:00.
const BASE_HOUR_WEIGHTS = {
  8: 0.6, 9: 1.1, 10: 1.4, 11: 1.3, 12: 0.9, 13: 0.5,
  14: 0.4, 15: 0.8, 16: 1.1, 17: 1.4, 18: 1.2, 19: 0.6
};
const SATURDAY_LAST_HOUR = 13; // sábados sólo medio día

const pad = (n) => String(n).padStart(2, '0');

const pickWeighted = (entries, rand) => {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [value, w] of entries) {
    r -= w;
    if (r <= 0) return value;
  }
  return entries[entries.length - 1][0];
};

export const generateVisitHistory = (referenceDate = new Date(), months = 12) => {
  const visits = [];
  let id = 1;
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  for (let m = months - 1; m >= 0; m--) {
    const first = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const year = first.getFullYear();
    const month = first.getMonth();
    const rand = mulberry32(year * 100 + month + 7);

    // Cada mes tiene un pequeño sesgo distinto para que los patrones varíen.
    const dayWeights = BASE_DAY_WEIGHTS.map((w) => (w ? w * (0.75 + rand() * 0.5) : 0));
    const hourWeights = Object.fromEntries(
      Object.entries(BASE_HOUR_WEIGHTS).map(([h, w]) => [h, w * (0.7 + rand() * 0.6)])
    );

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (date > today) break;
      const wd = (date.getDay() + 6) % 7;
      if (!dayWeights[wd]) continue;

      const appointments = Math.round(dayWeights[wd] * (5 + rand() * 4));
      const hourEntries = Object.entries(hourWeights)
        .filter(([h]) => wd !== 5 || Number(h) < SATURDAY_LAST_HOUR)
        .map(([h, w]) => [Number(h), w]);

      for (let i = 0; i < appointments; i++) {
        const hour = pickWeighted(hourEntries, rand);
        const minute = rand() < 0.5 ? 0 : 30;
        const isPast = date < today;
        const r = rand();
        let status;
        if (!isPast) status = r < 0.7 ? 'confirmada' : 'pendiente';
        else if (r < 0.86) status = 'completada';
        else if (r < 0.94) status = 'no_asistio';
        else status = 'cancelada';

        visits.push({
          id: id++,
          date: `${year}-${pad(month + 1)}-${pad(d)}`,
          time: `${pad(hour)}:${pad(minute)}`,
          status
        });
      }
    }
  }
  return visits;
};
