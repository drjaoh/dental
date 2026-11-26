import React from 'react';
import Icon from '../../../components/AppIcon';

const PatientStats = ({ patients }) => {
  const totalPatients = patients?.length;
  const activePatients = patients?.filter(p => p?.status === 'active')?.length;
  const pendingPayments = patients?.filter(p => p?.balance > 0)?.length;
  const totalBalance = patients?.reduce((sum, p) => sum + p?.balance, 0);

  const stats = [
    {
      id: 'total',
      label: 'Total Pacientes',
      value: totalPatients?.toLocaleString('es-MX'),
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
      changeType: 'positive'
    },
    {
      id: 'active',
      label: 'Pacientes Activos',
      value: activePatients?.toLocaleString('es-MX'),
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+8%',
      changeType: 'positive'
    },
    {
      id: 'pending',
      label: 'Pagos Pendientes',
      value: pendingPayments?.toLocaleString('es-MX'),
      icon: 'AlertCircle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '-5%',
      changeType: 'negative'
    },
    {
      id: 'balance',
      label: 'Saldo Total',
      value: `$${totalBalance?.toLocaleString('es-MX')} MXN`,
      icon: 'DollarSign',
      color: 'text-error',
      bgColor: 'bg-error/10',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats?.map((stat) => (
        <div key={stat?.id} className="bg-card rounded-lg border border-border p-4 clinical-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              stat?.changeType === 'positive' ?'bg-success/10 text-success' :'bg-error/10 text-error'
            }`}>
              {stat?.change}
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">{stat?.value}</div>
            <div className="text-sm text-muted-foreground">{stat?.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientStats;