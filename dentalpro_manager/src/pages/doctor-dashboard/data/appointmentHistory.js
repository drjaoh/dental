// Historial de citas de ejemplo para el resumen de asistencia.
// Se genera de forma determinista (misma semilla => mismos datos) para los últimos
// meses respecto a la fecha actual, así el panel siempre tiene datos que mostrar.
//
// Cuando exista un backend, reemplazar `getAppointmentHistory` por la consulta real
// que devuelva citas con { date: 'YYYY-MM-DD', time: 'HH:MM', status, patientName, treatment }.

const TREATMENTS = [
  'Limpieza dental', 'Revisión general', 'Resina', 'Endodoncia', 'Extracción',
  'Ajuste de brackets', 'Blanqueamiento', 'Corona dental', 'Control post-operatorio'
];

const PATIENTS = [
  'María González', 'Carlos Rodríguez', 'Ana Martínez', 'José Luis Fernández', 'Laura Jiménez',
  'Roberto Méndez', 'Carmen Ruiz', 'Miguel Ángel Torres', 'Elena Vásquez', 'Fernando Castro',
  'Patricia Morales', 'Sofía Herrera', 'Diego Ramírez', 'Valeria Ortiz', 'Andrés Navarro'
];

// Horario de la clínica por día (Date#getDay()): [hora inicio, hora fin) y peso relativo del día.
const SCHEDULE = {
  1: { from: 9, to: 19, weight: 1.0 },
  2: { from: 9, to: 19, weight: 1.15 },
  3: { from: 9, to: 19, weight: 0.85 },
  4: { from: 9, to: 19, weight: 1.05 },
  5: { from: 9, to: 19, weight: 1.25 },
  6: { from: 9, to: 14, weight: 0.9 }
  // Domingo cerrado
};

// Preferencia por hora: picos a media mañana y al salir del trabajo.
const HOUR_WEIGHTS = {
  9: 0.8, 10: 1.3, 11: 1.4, 12: 1.0, 13: 0.6, 14: 0.5,
  15: 0.7, 16: 1.0, 17: 1.4, 18: 1.2
};

// PRNG determinista (mulberry32)
const createRandom = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const pad = (n) => String(n).padStart(2, '0');

/**
 * @param {object} [options]
 * @param {number} [options.months=6]  Meses hacia atrás (incluye el mes actual).
 * @param {Date}   [options.today]     Fecha de referencia.
 */
export const getAppointmentHistory = ({ months = 6, today = new Date() } = {}) => {
  const appointments = [];
  let id = 1;
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  for (let offset = months - 1; offset >= 0; offset--) {
    const first = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const year = first.getFullYear();
    const monthIndex = first.getMonth();
    const random = createRandom(year * 100 + monthIndex + 7);

    // Variación mensual para que cada mes tenga su propio patrón.
    const dayJitter = {};
    Object.keys(SCHEDULE).forEach((d) => { dayJitter[d] = 0.75 + random() * 0.5; });
    const eveningShift = random() * 0.6 - 0.3; // mueve demanda entre mañana y tarde

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const sched = SCHEDULE[date.getDay()];
      if (!sched) continue;

      const isPast = date < todayStart;
      const isToday = date.getTime() === todayStart.getTime();

      for (let hour = sched.from; hour < sched.to; hour++) {
        const base = HOUR_WEIGHTS[hour] ?? 0.5;
        const shifted = base * (hour >= 15 ? 1 + eveningShift : 1 - eveningShift / 2);
        const probability = Math.min(0.95, 0.42 * sched.weight * dayJitter[date.getDay()] * shifted);
        if (random() > probability) continue;

        let status;
        if (isPast) {
          const r = random();
          status = r < 0.83 ? 'completed' : r < 0.92 ? 'no-show' : 'cancelled';
        } else if (isToday && hour < today.getHours()) {
          status = 'completed';
        } else {
          status = random() < 0.7 ? 'confirmed' : 'pending';
        }

        appointments.push({
          id: id++,
          date: `${year}-${pad(monthIndex + 1)}-${pad(day)}`,
          time: `${pad(hour)}:${random() < 0.5 ? '00' : '30'}`,
          status,
          patientName: PATIENTS[Math.floor(random() * PATIENTS.length)],
          treatment: TREATMENTS[Math.floor(random() * TREATMENTS.length)]
        });
      }
    }
  }

  return appointments;
};
