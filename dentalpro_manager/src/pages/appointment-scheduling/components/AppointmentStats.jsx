import React from 'react';
import Icon from '../../../components/AppIcon';

const AppointmentStats = ({ appointments, selectedDate, viewMode }) => {
  const getStatsForPeriod = () => {
    let filteredAppointments = appointments;
    
    if (viewMode === 'day') {
      const dateStr = selectedDate?.toISOString()?.split('T')?.[0];
      filteredAppointments = appointments?.filter(apt => apt?.date === dateStr);
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek?.setDate(selectedDate?.getDate() - selectedDate?.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek?.setDate(startOfWeek?.getDate() + 6);
      
      filteredAppointments = appointments?.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= startOfWeek && aptDate <= endOfWeek;
      });
    } else if (viewMode === 'month') {
      const year = selectedDate?.getFullYear();
      const month = selectedDate?.getMonth();
      
      filteredAppointments = appointments?.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate?.getFullYear() === year && aptDate?.getMonth() === month;
      });
    }

    const stats = {
      total: filteredAppointments?.length,
      confirmed: filteredAppointments?.filter(apt => apt?.status === 'confirmed')?.length,
      pending: filteredAppointments?.filter(apt => apt?.status === 'pending')?.length,
      completed: filteredAppointments?.filter(apt => apt?.status === 'completed')?.length,
      cancelled: filteredAppointments?.filter(apt => apt?.status === 'cancelled')?.length,
      noShow: filteredAppointments?.filter(apt => apt?.status === 'no-show')?.length,
      revenue: filteredAppointments?.filter(apt => apt?.status === 'completed')?.reduce((sum, apt) => sum + (apt?.price || 0), 0)
    };

    return stats;
  };

  const stats = getStatsForPeriod();

  const getPeriodLabel = () => {
    switch (viewMode) {
      case 'day':
        return selectedDate?.toLocaleDateString('es-MX', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        });
      case 'week':
        const startOfWeek = new Date(selectedDate);
        startOfWeek?.setDate(selectedDate?.getDate() - selectedDate?.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek?.setDate(startOfWeek?.getDate() + 6);
        return `${startOfWeek?.getDate()} - ${endOfWeek?.getDate()} de ${startOfWeek?.toLocaleDateString('es-MX', { month: 'long' })}`;
      case 'month':
        return selectedDate?.toLocaleDateString('es-MX', { 
          month: 'long', 
          year: 'numeric' 
        });
      default:
        return '';
    }
  };

  const statCards = [
    {
      label: 'Total de Citas',
      value: stats?.total,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Confirmadas',
      value: stats?.confirmed,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Pendientes',
      value: stats?.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Completadas',
      value: stats?.completed,
      icon: 'Check',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Canceladas',
      value: stats?.cancelled,
      icon: 'X',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      label: 'No Asistieron',
      value: stats?.noShow,
      icon: 'UserX',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    }
  ];

  const completionRate = stats?.total > 0 ? ((stats?.completed / stats?.total) * 100)?.toFixed(1) : 0;
  const confirmationRate = stats?.total > 0 ? (((stats?.confirmed + stats?.completed) / stats?.total) * 100)?.toFixed(1) : 0;

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Estadísticas de Citas</h3>
          <p className="text-sm text-muted-foreground">{getPeriodLabel()}</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-muted-foreground">Tasa de confirmación:</span>
            <span className="font-medium text-success">{confirmationRate}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-muted-foreground">Tasa de finalización:</span>
            <span className="font-medium text-primary">{completionRate}%</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards?.map((stat, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-clinical"
          >
            <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat?.value}</p>
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Revenue Display */}
      {stats?.revenue > 0 && (
        <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="DollarSign" size={20} className="text-success" />
              <span className="font-medium">Ingresos del período</span>
            </div>
            <span className="text-2xl font-bold text-success">
              ${stats?.revenue?.toLocaleString('es-MX')} MXN
            </span>
          </div>
        </div>
      )}
      {/* Quick Insights */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Clock" size={14} className="text-warning" />
            <span className="font-medium">Horario más ocupado</span>
          </div>
          <p className="text-muted-foreground">10:00 - 11:00 AM</p>
        </div>
        
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Star" size={14} className="text-primary" />
            <span className="font-medium">Tratamiento más común</span>
          </div>
          <p className="text-muted-foreground">Limpieza dental</p>
        </div>
        
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Users" size={14} className="text-accent" />
            <span className="font-medium">Pacientes únicos</span>
          </div>
          <p className="text-muted-foreground">
            {new Set(appointments.map(apt => apt.patientId))?.size} pacientes
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentStats;