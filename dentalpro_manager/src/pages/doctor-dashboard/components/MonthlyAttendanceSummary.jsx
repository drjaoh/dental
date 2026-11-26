import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import {
  getAvailableMonths,
  summarizeMonth,
  formatMonthLabel,
  formatHourRange
} from '../utils/attendanceAnalytics';

// Un solo tono (primario) para magnitud; el valor máximo se resalta con el tono pleno.
const BAR_COLOR = '#93C5FD'; // blue-300
const BAR_PEAK_COLOR = '#2563EB'; // blue-600 (--color-primary)

// Escala secuencial azul para el mapa de calor (claro -> oscuro).
const HEAT_STEPS = ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'];

const heatColor = (count, max) => {
  if (!count || !max) return null;
  const idx = Math.min(HEAT_STEPS.length - 1, Math.max(1, Math.ceil((count / max) * (HEAT_STEPS.length - 1))));
  return HEAT_STEPS[idx];
};

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const ChartTooltip = ({ active, payload, labelFormatter }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  return (
    <div className="bg-popover border border-border rounded-md px-3 py-2 clinical-shadow-lg text-sm">
      <p className="font-medium text-popover-foreground">{labelFormatter(item)}</p>
      <p className="text-muted-foreground">
        {item.count} {item.count === 1 ? 'asistencia' : 'asistencias'}
        {item.pct ? ` · ${item.pct}%` : ''}
        {item.avgPerDay !== undefined && item.count > 0 ? ` · ${item.avgPerDay} por día` : ''}
      </p>
    </div>
  );
};

const StatTile = ({ icon, label, value, detail, detailClassName = 'text-muted-foreground' }) => (
  <div className="border border-border rounded-lg p-4 bg-background">
    <div className="flex items-center gap-2 text-muted-foreground mb-1">
      <Icon name={icon} size={16} />
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <p className="text-xl font-semibold text-foreground truncate">{value}</p>
    {detail && <p className={`text-sm mt-0.5 ${detailClassName}`}>{detail}</p>}
  </div>
);

const MonthlyAttendanceSummary = ({ appointments = [] }) => {
  const months = useMemo(() => getAvailableMonths(appointments), [appointments]);
  const [selectedMonth, setSelectedMonth] = useState(() => months[months.length - 1]);
  const [hoverCell, setHoverCell] = useState(null);

  const monthKey = months.includes(selectedMonth) ? selectedMonth : months[months.length - 1];
  const summary = useMemo(
    () => (monthKey ? summarizeMonth(appointments, monthKey) : null),
    [appointments, monthKey]
  );

  if (!summary) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 clinical-shadow text-center text-muted-foreground">
        Aún no hay citas registradas para analizar.
      </div>
    );
  }

  const monthPos = months.indexOf(monthKey);
  const goTo = (delta) => {
    const next = months[monthPos + delta];
    if (next) setSelectedMonth(next);
  };

  const { totals, comparison, topDays, tiedTopDays, topHours, byWeekday, byHour, byDayPart, heatmap, heatmapMax, insights } = summary;
  const hasData = totals.attended > 0;
  const topDay = topDays[0];
  const topHour = topHours[0];
  const peakDayCount = topDay?.count || 0;
  const peakHourCount = topHour?.count || 0;
  // Gráfica de días: se omite el domingo si no hubo asistencias (clínica cerrada).
  const weekdayChartData = byWeekday.filter((d) => d.jsDay !== 0 || d.count > 0);
  const heatmapRows = heatmap.filter((r) => r.jsDay !== 0 || r.cells.some((c) => c.count > 0));

  const changeDetail = (() => {
    if (comparison.change === null) return 'Sin datos del mes anterior';
    const vs = comparison.samePeriod ? 'vs mismo periodo' : 'vs mes anterior';
    if (comparison.change === 0) return `Igual ${vs}`;
    return `${comparison.change > 0 ? '+' : ''}${comparison.change}% ${vs}`;
  })();
  const changeClass =
    comparison.change > 0 ? 'text-success' : comparison.change < 0 ? 'text-error' : 'text-muted-foreground';

  return (
    <section className="bg-card border border-border rounded-lg clinical-shadow" aria-labelledby="attendance-title">
      {/* Encabezado + selector de mes */}
      <div className="p-6 border-b border-border flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 id="attendance-title" className="text-lg font-semibold text-foreground">
            Patrones de Asistencia
          </h3>
          <p className="text-sm text-muted-foreground">
            Días y horarios en que más asisten tus pacientes, mes con mes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(-1)}
            disabled={monthPos <= 0}
            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Mes anterior"
          >
            <Icon name="ChevronLeft" size={18} />
          </button>
          <select
            value={monthKey}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Seleccionar mes"
          >
            {[...months].reverse().map((m) => (
              <option key={m} value={m}>
                {capitalize(formatMonthLabel(m))}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => goTo(1)}
            disabled={monthPos >= months.length - 1}
            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Mes siguiente"
          >
            <Icon name="ChevronRight" size={18} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {summary.isCurrentMonth && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Icon name="Info" size={14} />
            Mes en curso: los datos incluyen las asistencias registradas hasta hoy.
          </p>
        )}

        {/* Indicadores principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            icon="UserCheck"
            label="Asistencias"
            value={totals.attended}
            detail={changeDetail}
            detailClassName={changeClass}
          />
          <StatTile
            icon="CalendarDays"
            label="Día más frecuente"
            value={topDay ? topDay.label : '—'}
            detail={
              !topDay
                ? 'Sin asistencias'
                : tiedTopDays.length > 1
                  ? `Empate con ${tiedTopDays.filter((d) => d.jsDay !== topDay.jsDay).map((d) => d.short).join(', ')} · ${topDay.count} c/u`
                  : `${topDay.count} pacientes · ${topDay.avgPerDay} por día`
            }
          />
          <StatTile
            icon="Clock"
            label="Horario pico"
            value={topHour ? formatHourRange(topHour.hour) : '—'}
            detail={topHour ? `${topHour.count} pacientes (${topHour.pct}%)` : 'Sin asistencias'}
          />
          <StatTile
            icon="UserX"
            label="Inasistencias"
            value={`${totals.noShowRate}%`}
            detail={`${totals.noShows} no se presentaron · ${totals.cancelled} canceladas`}
          />
        </div>

        {!hasData ? (
          <div className="text-center py-10 text-muted-foreground">
            <Icon name="CalendarX" size={32} className="mx-auto mb-2" />
            No hay asistencias registradas en {formatMonthLabel(monthKey)}.
          </div>
        ) : (
          <>
            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Asistencias por día de la semana</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekdayChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="short" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: 'var(--color-muted)' }} content={<ChartTooltip labelFormatter={(d) => d.label} />} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {weekdayChartData.map((d) => (
                          <Cell key={d.jsDay} fill={d.count === peakDayCount ? BAR_PEAK_COLOR : BAR_COLOR} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Asistencias por horario</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byHour} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis
                        dataKey="label"
                        stroke="var(--color-muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => v.slice(0, 2)}
                      />
                      <YAxis allowDecimals={false} stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: 'var(--color-muted)' }} content={<ChartTooltip labelFormatter={(h) => formatHourRange(h.hour)} />} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={28}>
                        {byHour.map((h) => (
                          <Cell key={h.hour} fill={h.count === peakHourCount ? BAR_PEAK_COLOR : BAR_COLOR} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Mapa de calor día × hora */}
            <div>
              <div className="flex items-center justify-between mb-3 gap-4">
                <h4 className="text-sm font-medium text-foreground">Mapa de calor: día × hora</h4>
                <p className="text-xs text-muted-foreground h-4" aria-live="polite">
                  {hoverCell
                    ? `${hoverCell.day} ${formatHourRange(hoverCell.hour)}: ${hoverCell.count} ${hoverCell.count === 1 ? 'paciente' : 'pacientes'}`
                    : 'Pasa el cursor sobre una celda'}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-separate" style={{ borderSpacing: 2 }}>
                  <thead>
                    <tr>
                      <th className="w-12" />
                      {heatmap[0].cells.map((c) => (
                        <th key={c.hour} scope="col" className="text-xs font-normal text-muted-foreground pb-1">
                          {String(c.hour).padStart(2, '0')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapRows.map((row) => (
                      <tr key={row.jsDay}>
                        <th scope="row" className="text-xs font-normal text-muted-foreground text-left pr-2">
                          {row.short}
                        </th>
                        {row.cells.map((c) => {
                          const bg = heatColor(c.count, heatmapMax);
                          const dark = bg && HEAT_STEPS.indexOf(bg) >= 5;
                          return (
                            <td
                              key={c.hour}
                              title={`${row.label} ${formatHourRange(c.hour)}: ${c.count}`}
                              onMouseEnter={() => setHoverCell({ day: row.label, hour: c.hour, count: c.count })}
                              onMouseLeave={() => setHoverCell(null)}
                              className={`h-8 rounded text-center text-xs tabular-nums transition-micro ${
                                bg ? '' : 'bg-muted'
                              } ${dark ? 'text-white' : 'text-foreground'} hover:ring-2 hover:ring-ring`}
                              style={bg ? { backgroundColor: bg } : undefined}
                            >
                              {c.count || ''}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>Menos</span>
                {HEAT_STEPS.slice(1).map((c) => (
                  <span key={c} className="w-4 h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
                <span>Más</span>
              </div>
            </div>

            {/* Franjas del día + resumen en texto */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Distribución por franja</h4>
                <div className="space-y-3">
                  {byDayPart.map((p) => (
                    <div key={p.key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">
                          {p.label} <span className="text-muted-foreground text-xs">({p.range})</span>
                        </span>
                        <span className="text-muted-foreground tabular-nums">{p.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 rounded-lg bg-primary/5 border border-primary/20 p-4">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Icon name="Sparkles" size={16} className="text-primary" />
                  Resumen de {formatMonthLabel(monthKey)}
                </h4>
                <ul className="space-y-1.5 text-sm text-foreground list-disc pl-5">
                  {insights.map((text, i) => (
                    <li key={i}>{text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MonthlyAttendanceSummary;
