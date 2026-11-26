import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FinancialAnalyticsSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const revenueData = [
    { month: 'Ene', revenue: 45000, expenses: 18000, profit: 27000, patients: 85 },
    { month: 'Feb', revenue: 52000, expenses: 19500, profit: 32500, patients: 92 },
    { month: 'Mar', revenue: 48000, expenses: 17800, profit: 30200, patients: 88 },
    { month: 'Apr', revenue: 58000, expenses: 21000, profit: 37000, patients: 105 },
    { month: 'May', revenue: 62000, expenses: 22500, profit: 39500, patients: 112 },
    { month: 'Jun', revenue: 55000, expenses: 20200, profit: 34800, patients: 98 },
    { month: 'Jul', revenue: 67000, expenses: 24000, profit: 43000, patients: 118 },
    { month: 'Ago', revenue: 71000, expenses: 25500, profit: 45500, patients: 125 },
    { month: 'Sep', revenue: 64000, expenses: 23000, profit: 41000, patients: 115 },
    { month: 'Oct', revenue: 69000, expenses: 24800, profit: 44200, patients: 122 },
    { month: 'Nov', revenue: 73000, expenses: 26000, profit: 47000, patients: 128 },
    { month: 'Dic', revenue: 78000, expenses: 27500, profit: 50500, patients: 135 }
  ];

  const treatmentData = [
    { name: 'Limpieza Dental', value: 35, revenue: 15750, count: 35 },
    { name: 'Resinas', value: 25, revenue: 16250, count: 25 },
    { name: 'Endodoncia', value: 15, revenue: 27000, count: 15 },
    { name: 'Ortodoncia', value: 12, revenue: 180000, count: 12 },
    { name: 'Implantes', value: 8, revenue: 68000, count: 8 },
    { name: 'Cirugía', value: 5, revenue: 11250, count: 5 }
  ];

  const paymentMethodData = [
    { name: 'Tarjeta Crédito', value: 45, amount: 234500 },
    { name: 'Efectivo', value: 30, amount: 156300 },
    { name: 'Transferencia', value: 18, amount: 93800 },
    { name: 'Tarjeta Débito', value: 7, amount: 36400 }
  ];

  const COLORS = ['#2563EB', '#059669', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    })?.format(value);
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100)?.toFixed(1);
  };

  const currentMonth = revenueData?.[revenueData?.length - 1];
  const previousMonth = revenueData?.[revenueData?.length - 2];

  const metrics = [
    {
      title: "Ingresos del Mes",
      value: formatCurrency(currentMonth?.revenue),
      change: `+${calculateGrowth(currentMonth?.revenue, previousMonth?.revenue)}%`,
      changeType: "positive",
      icon: "TrendingUp",
      color: "success"
    },
    {
      title: "Gastos del Mes",
      value: formatCurrency(currentMonth?.expenses),
      change: `+${calculateGrowth(currentMonth?.expenses, previousMonth?.expenses)}%`,
      changeType: "negative",
      icon: "TrendingDown",
      color: "error"
    },
    {
      title: "Ganancia Neta",
      value: formatCurrency(currentMonth?.profit),
      change: `+${calculateGrowth(currentMonth?.profit, previousMonth?.profit)}%`,
      changeType: "positive",
      icon: "DollarSign",
      color: "primary"
    },
    {
      title: "Pacientes Atendidos",
      value: currentMonth?.patients?.toString(),
      change: `+${calculateGrowth(currentMonth?.patients, previousMonth?.patients)}%`,
      changeType: "positive",
      icon: "Users",
      color: "accent"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Análisis Financiero</h2>
          <p className="text-muted-foreground">Métricas y tendencias de la práctica dental</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={selectedPeriod === 'week' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            Semana
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Mes
          </Button>
          <Button 
            variant={selectedPeriod === 'year' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => setSelectedPeriod('year')}
          >
            Año
          </Button>
          <Button variant="outline" iconName="Download" iconPosition="left">
            Exportar
          </Button>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics?.map((metric, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 clinical-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                metric?.color === 'success' ? 'bg-success/10 text-success' :
                metric?.color === 'error' ? 'bg-error/10 text-error' :
                metric?.color === 'accent'? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
              }`}>
                <Icon name={metric?.icon} size={24} />
              </div>
              <div className={`flex items-center space-x-1 ${
                metric?.changeType === 'positive' ? 'text-success' : 'text-error'
              }`}>
                <Icon 
                  name={metric?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                />
                <span className="text-sm font-medium">{metric?.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric?.title}</h3>
              <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-card border border-border rounded-lg clinical-shadow">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Tendencia de Ingresos</h3>
                <p className="text-sm text-muted-foreground">Ingresos vs Gastos mensuales</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={selectedMetric === 'revenue' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setSelectedMetric('revenue')}
                >
                  Ingresos
                </Button>
                <Button 
                  variant={selectedMetric === 'profit' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setSelectedMetric('profit')}
                >
                  Ganancia
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), selectedMetric === 'revenue' ? 'Ingresos' : 'Ganancia']}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                    contentStyle={{ 
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="var(--color-primary)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                  />
                  {selectedMetric === 'revenue' && (
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="var(--color-error)" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 3 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Treatment Distribution */}
        <div className="bg-card border border-border rounded-lg clinical-shadow">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Distribución de Tratamientos</h3>
            <p className="text-sm text-muted-foreground">Popularidad por tipo de tratamiento</p>
          </div>
          <div className="p-6">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={treatmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {treatmentData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} tratamientos`,
                      props?.payload?.name
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* Detailed Analytics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treatment Revenue Table */}
        <div className="bg-card border border-border rounded-lg clinical-shadow">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Ingresos por Tratamiento</h3>
            <p className="text-sm text-muted-foreground">Análisis de rentabilidad</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Tratamiento</th>
                  <th className="text-right p-4 font-medium text-foreground">Cantidad</th>
                  <th className="text-right p-4 font-medium text-foreground">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {treatmentData?.map((treatment, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                        ></div>
                        <span className="font-medium text-foreground">{treatment?.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-foreground">{treatment?.count}</td>
                    <td className="p-4 text-right font-semibold text-foreground">
                      {formatCurrency(treatment?.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods Analysis */}
        <div className="bg-card border border-border rounded-lg clinical-shadow">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Métodos de Pago</h3>
            <p className="text-sm text-muted-foreground">Preferencias de pago</p>
          </div>
          <div className="p-6 space-y-4">
            {paymentMethodData?.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                  ></div>
                  <span className="font-medium text-foreground">{method?.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{formatCurrency(method?.amount)}</div>
                  <div className="text-sm text-muted-foreground">{method?.value}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalyticsSection;