import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction }) => {
  const quickActions = [
    {
      id: 'recent-quotation',
      title: 'Cotización Reciente',
      description: 'Generar cotización basada en el último tratamiento',
      icon: 'Calculator',
      color: 'bg-blue-500',
      action: () => onAction('recent-quotation')
    },
    {
      id: 'batch-statements',
      title: 'Estados de Cuenta',
      description: 'Generar estados de cuenta masivos',
      icon: 'FileSpreadsheet',
      color: 'bg-green-500',
      action: () => onAction('batch-statements')
    },
    {
      id: 'consent-forms',
      title: 'Formularios de Consentimiento',
      description: 'Crear formularios para próximas citas',
      icon: 'FileCheck',
      color: 'bg-purple-500',
      action: () => onAction('consent-forms')
    },
    {
      id: 'monthly-reports',
      title: 'Reportes Mensuales',
      description: 'Generar reportes de actividad mensual',
      icon: 'BarChart3',
      color: 'bg-orange-500',
      action: () => onAction('monthly-reports')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
        <Icon name="Zap" size={20} className="text-warning" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={action?.action}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                <Icon name={action?.icon} size={20} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                  {action?.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {action?.description}
                </p>
              </div>
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" 
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction('view-all')}
          iconName="Grid3x3"
          iconPosition="left"
          iconSize={16}
          className="w-full"
        >
          Ver Todas las Opciones
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;