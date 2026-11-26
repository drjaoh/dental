import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'new-patient',
      label: 'Nuevo Paciente',
      icon: 'UserPlus',
      variant: 'default',
      route: '/patient-management'
    },
    {
      id: 'schedule-appointment',
      label: 'Programar Cita',
      icon: 'Calendar',
      variant: 'outline',
      route: '/appointment-scheduling'
    },
    {
      id: 'generate-report',
      label: 'Generar Reporte',
      icon: 'FileText',
      variant: 'outline',
      route: '/document-generation'
    },
    {
      id: 'financial-overview',
      label: 'Ver Finanzas',
      icon: 'CreditCard',
      variant: 'outline',
      route: '/financial-management'
    }
  ];

  const handleActionClick = (action) => {
    if (onAction) {
      onAction(action);
    } else {
      window.location.href = action?.route;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 clinical-shadow">
      <h3 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            size="default"
            iconName={action?.icon}
            iconPosition="left"
            iconSize={20}
            onClick={() => handleActionClick(action)}
            className="justify-start h-12 transition-clinical"
          >
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;