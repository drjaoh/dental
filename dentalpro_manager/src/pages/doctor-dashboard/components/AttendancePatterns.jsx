import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import {
  WEEKDAYS_SHORT,
  summarizeMonth,
  buildNarrative,
  buildMonthlyHistory,
  formatHour,
  formatHourRange,
  pctChange
} from '../../../utils/attendanceAnalytics';

const PRIMARY = '#2563EB';
const PRIMARY_SOFT = '#BFDBFE';
const ACCENT = '#059669';
const ACCENT_SOFT = '#A7F3D0';

const ChartTooltip = ({ active, payload, label, unit = 'visitas' }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-popover border border-border rounded-md px-3 py-2 text-sm clinical-shadow">
      <p className="font-medium text-foreground">{row.name || label}</p>
      <p className="text-muted-foreground">
        {row.visitas} {unit} · {row.porcentaje}%
      </p>
      {row.promedio !== undefined && (
        <p className="text-muted-foreground">Promedio: {row.promedio} por día</p>
      )}
    </div>
  );
};

const StatTile = ({ icon, label, value, detail, tone = 'primary' }) => {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    accent: 'bg-accent/10 text-accent'
  };
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon name={icon} size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-lg font-semibold text-foreground truncate">{value}</p>
        {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
      </div>
    </div>
  );
};

const Heatmap = ({ summary }) => {
  const { heatmap, heatmapMax, hours } = summary;
  // Ocultar domingo si no hubo actividad.
  const rows = heatmap
    .map((row, i) => ({ row, label: WEEKDAYS_SHORT[i] }))
    .filter(({ row }, i) => i < 6 || row.some((c) => c > 0));

  const cellStyle = (count) => {
    if (!count) return { backgroundColor: 'var(--color-muted)' };
    const intensity = 0.15 + 0.85 * (count / heatmapMax);
    return { backgroundColor: `rgba(37, 99, 235, ${intensity.toFixed(2)})` };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate" style={{ borderSpacing: 3 }}>
        <thead>
          <tr>
            <th className="w-10" />
            {hours.map((h) => (
              <th key={h} className="text-[10px] font-normal text-muted-foreground text-center">
                {String(h).padStart(2, '0')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ row, label }) => (
            <tr key={label}>
              <td className="text-xs text-muted-foreground pr-1">{label}</td>
              {row.map((count, hi) => (
                <td
                  key={hi}
                  className="h-7 min-w-[22px] rounded text-[10px] text-center font-medium"
                  style={{ ...cellStyle(count), color: count / heatmapMax > 0.55 ? '#fff' : 'var(--color-foreground)' }}
                  title={`${label} ${formatHour(hours[hi])}: ${count} visitas`}
                >
                  {count || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end gap-2 mt-2 text-xs text-muted-foreground">
        <span>Menos</span>
        {[0.15, 0.4, 0.65, 0.9].map((a) => (
          <span key={a} className="w-4 h-3 rounded-sm" style={{ backgroundColor: `rgba(37, 99, 235, ${a})` }} />
        ))}
        <span>Más</span>
      </div>
    </div>
  );
};

const AttendancePatterns = ({ visits, referenceDate = new Date() }) => {
  const [selected, setSelected] = useState({
    year: referenceDate.getFullYear(),
    month: referenceDate.getMonth()
  });
  const [view, setView] = useState('dias');

  const isCurrentMonth =
    selected.year === referenceDate.getFullYear() && selected.month === referenceDate.getMonth();

  // Mes más antiguo con datos, para limitar la navegación.
  const earliest = useMemo(() => {
    const min = visits.reduce((acc, v) => (v.date < acc ? v.date : acc), '9999-12-31');
    const [y, m] = min.split('-').map(Number);
    return { year: y, month: m - 1 };
  }, [visits]);
  const isEarliest = selected.year === earliest.year && selected.month === earliest.month;

  // En el mes en curso se compara contra el mismo rango de días del mes anterior.
  const untilDay = isCurrentMonth ? referenceDate.getDate() : undefined;
  const summary = useMemo(
    () => summarizeMonth(visits, selected.year, selected.month, { untilDay }),
    [visits, selected, untilDay]
  );
  const previous = useMemo(() => {
    const d = new Date(selected.year, selected.month - 1, 1);
    return summarizeMonth(visits, d.getFullYear(), d.getMonth(), { untilDay });
  }, [visits, selected, untilDay]);
  const history = useMemo(
    () => buildMonthlyHistory(visits, selected.year, selected.month, 6),
    [visits, selected]
  );
  const narrative = useMemo(() => buildNarrative(summary, previous), [summary, previous]);

  const shiftMonth = (delta) => {
    const d = new Date(selected.year, selected.month + delta, 1);
    setSelected({ year: d.getFullYear(), month: d.getMonth() });
  };

  const totalChange = pctChange(summary.total, previous.total);
  const topDay = summary.topDays[0];
  const topHour = summary.topHours[0];
  const topDayName = topDay?.name;
  const topHourValue = topHour?.h;

  return (
    <div className="bg-card border border-border rounded-lg clinical-shadow">
      {/* Encabezado */}
      <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="CalendarClock" size={20} className="text-primary" />
            Patrones de Asistencia
          </h3>
          <p className="text-sm text-muted-foreground">
            Días y horarios en que más asisten tus pacientes, mes con mes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconName="ChevronLeft" iconSize={16} onClick={() => shiftMonth(-1)} disabled={isEarliest} aria-label="Mes anterior" />
          <span className="min-w-[150px] text-center font-medium text-foreground">
            {summary.label}
            {isCurrentMonth && <span className="block text-xs font-normal text-muted-foreground">mes en curso</span>}
          </span>
          <Button variant="outline" size="sm" iconName="ChevronRight" iconSize={16} onClick={() => shiftMonth(1)} disabled={isCurrentMonth} aria-label="Mes siguiente" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatTile
            icon="Users"
            label="Asistencias"
            value={summary.total}
            detail={
              totalChange === null
                ? `${summary.attendanceRate}% de las citas agendadas`
                : `${totalChange >= 0 ? '+' : ''}${totalChange}% vs ${untilDay ? 'mismo periodo de ' : ''}${previous.label} · ${summary.attendanceRate}% asistencia`
            }
          />
          <StatTile
            icon="CalendarCheck"
            label="Día más frecuente"
            value={topDayName || '—'}
            detail={topDay ? `${topDay.visitas} visitas · ${topDay.promedio} por día en promedio` : 'Sin datos'}
            tone="success"
          />
          <StatTile
            icon="Clock"
            label="Horario pico"
            value={topHour ? formatHourRange(topHourValue) : '—'}
            detail={topHour ? `${topHour.visitas} visitas (${topHour.porcentaje}%)` : 'Sin datos'}
            tone="accent"
          />
          <StatTile
            icon="Sun"
            label="Bloque preferido"
            value={summary.topBlock?.name || '—'}
            detail={summary.topBlock ? `${summary.topBlock.porcentaje}% de las visitas · ${summary.noShows} inasistencias` : 'Sin datos'}
            tone="warning"
          />
        </div>

        {/* Resumen automático */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
          <p className="text-sm font-medium text-primary flex items-center gap-2 mb-2">
            <Icon name="Sparkles" size={16} />
            Resumen de {summary.label}
          </p>
          <ul className="space-y-1 text-sm text-foreground list-disc pl-5">
            {narrative.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>

        {/* Gráficas */}
        <div>
          <div className="flex gap-2 mb-4" role="tablist">
            {[
              { id: 'dias', label: 'Por día', icon: 'CalendarDays' },
              { id: 'horas', label: 'Por horario', icon: 'Clock' },
              { id: 'mapa', label: 'Mapa día × hora', icon: 'Grid3x3' }
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={view === tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-clinical ${
                  view === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {summary.total === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">Sin asistencias registradas en este mes.</p>
          ) : view === 'dias' ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.weekdayData.filter((d, i) => i < 6 || d.visitas > 0)} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(37,99,235,0.06)' }} />
                  <Bar dataKey="visitas" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {summary.weekdayData.map((d) => (
                      <Cell key={d.day} fill={summary.topDays.some((t) => t.name === d.name) ? PRIMARY : PRIMARY_SOFT} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : view === 'horas' ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.hourData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(5,150,105,0.06)' }} />
                  <Bar dataKey="visitas" radius={[4, 4, 0, 0]} maxBarSize={36}>
                    {summary.hourData.map((d) => (
                      <Cell key={d.hour} fill={summary.topHours.some((t) => t.h === d.h) ? ACCENT : ACCENT_SOFT} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Heatmap summary={summary} />
          )}
        </div>

        {/* Comparativo mensual */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Comparativo de los últimos 6 meses</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-4 font-medium">Mes</th>
                  <th className="py-2 pr-4 font-medium text-right">Asistencias</th>
                  <th className="py-2 pr-4 font-medium">Días más frecuentes</th>
                  <th className="py-2 pr-4 font-medium">Horario pico</th>
                  <th className="py-2 font-medium">Bloque</th>
                </tr>
              </thead>
              <tbody>
                {history.map((m) => {
                  const isSelected = m.year === selected.year && m.month === selected.month;
                  return (
                    <tr
                      key={m.label}
                      onClick={() => setSelected({ year: m.year, month: m.month })}
                      className={`border-b border-border last:border-0 cursor-pointer transition-clinical ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                    >
                      <td className={`py-2 pr-4 ${isSelected ? 'font-semibold text-primary' : 'text-foreground'}`}>{m.label}</td>
                      <td className="py-2 pr-4 text-right tabular-nums text-foreground">{m.total || '—'}</td>
                      <td className="py-2 pr-4 text-foreground">
                        {m.topDays.length ? m.topDays.map((d) => d.name).join(', ') : '—'}
                      </td>
                      <td className="py-2 pr-4 text-foreground">{m.topHours[0] ? formatHourRange(m.topHours[0].h) : '—'}</td>
                      <td className="py-2 text-muted-foreground">{m.topBlock?.name || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePatterns;
