import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAddPatient, onBulkExport, onSendReminders }) => {
  const actions = [
    {
      id: 'add-patient',
      label: 'Nuevo Paciente',
      description: 'Registrar un nuevo paciente',
      icon: 'UserPlus',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: onAddPatient
    },
    {
      id: 'bulk-export',
      label: 'Exportar Datos',
      description: 'Descargar lista de pacientes',
      icon: 'Download',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      onClick: onBulkExport
    },
    {
      id: 'send-reminders',
      label: 'Enviar Recordatorios',
      description: 'Notificar citas próximas',
      icon: 'Bell',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      onClick: onSendReminders
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {actions?.map((action) => (
            <Button
              key={action?.id}
              variant="ghost"
              onClick={action?.onClick}
              className="w-full justify-start p-4 h-auto"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${action?.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon name={action?.icon} size={20} className={action?.color} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-foreground">{action?.label}</div>
                  <div className="text-xs text-muted-foreground">{action?.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;