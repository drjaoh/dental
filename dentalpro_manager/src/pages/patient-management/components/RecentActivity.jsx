import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'appointment',
      patient: 'Ana Martínez',
      action: 'Cita programada',
      time: 'Hace 15 minutos',
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 2,
      type: 'payment',
      patient: 'Carlos López',
      action: 'Pago recibido - $800 MXN',
      time: 'Hace 1 hora',
      icon: 'CreditCard',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 3,
      type: 'patient',
      patient: 'María González',
      action: 'Nuevo paciente registrado',
      time: 'Hace 2 horas',
      icon: 'UserPlus',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      id: 4,
      type: 'treatment',
      patient: 'Roberto Silva',
      action: 'Tratamiento completado',
      time: 'Hace 3 horas',
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 5,
      type: 'reminder',
      patient: 'Laura Hernández',
      action: 'Recordatorio enviado',
      time: 'Hace 4 horas',
      icon: 'Bell',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Actividad Reciente</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="MoreHorizontal"
          iconSize={16}
        />
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity?.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 ${activity?.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon name={activity?.icon} size={16} className={activity?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity?.patient}
                  </p>
                  <span className="text-xs text-muted-foreground ml-2">
                    {activity?.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity?.action}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
          >
            Ver toda la actividad
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;