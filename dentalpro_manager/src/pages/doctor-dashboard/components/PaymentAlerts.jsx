import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentAlerts = ({ alerts, onViewFinances, onContactPatient }) => {
  const getAlertIcon = (type) => {
    const icons = {
      'overdue': 'AlertTriangle',
      'due_today': 'Clock',
      'due_soon': 'Calendar',
      'partial': 'CreditCard'
    };
    return icons?.[type] || 'AlertCircle';
  };

  const getAlertColor = (type) => {
    const colors = {
      'overdue': 'text-error bg-error/10 border-error/20',
      'due_today': 'text-warning bg-warning/10 border-warning/20',
      'due_soon': 'text-primary bg-primary/10 border-primary/20',
      'partial': 'text-secondary bg-secondary/10 border-secondary/20'
    };
    return colors?.[type] || 'text-muted-foreground bg-muted/10 border-border';
  };

  const getAlertTitle = (type) => {
    const titles = {
      'overdue': 'Pagos Vencidos',
      'due_today': 'Vencen Hoy',
      'due_soon': 'Próximos a Vencer',
      'partial': 'Pagos Parciales'
    };
    return titles?.[type] || 'Alertas de Pago';
  };

  const formatDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `${diffDays} días vencido`;
    if (diffDays === 0) return 'Vence hoy';
    return `Vence en ${Math.abs(diffDays)} días`;
  };

  const totalAmount = alerts?.reduce((sum, alert) => sum + alert?.amount, 0);

  return (
    <div className="bg-card border border-border rounded-lg clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Alertas de Pago</h3>
            <p className="text-sm text-muted-foreground">
              Total pendiente: <span className="font-medium text-error">${totalAmount?.toLocaleString('es-MX')} MXN</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="CreditCard"
            iconPosition="left"
            iconSize={16}
            onClick={onViewFinances}
          >
            Ver Finanzas
          </Button>
        </div>
      </div>
      <div className="p-6">
        {alerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <p className="text-muted-foreground">Todos los pagos están al día</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts?.map((alert, index) => (
              <div
                key={alert?.id}
                className={`p-4 rounded-lg border ${getAlertColor(alert?.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon name={getAlertIcon(alert?.type)} size={20} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium">{alert?.patientName}</h4>
                        <span className="text-xs px-2 py-1 bg-background rounded-full">
                          {getAlertTitle(alert?.type)}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 mb-2">
                        {alert?.treatment} - ${alert?.amount?.toLocaleString('es-MX')} MXN
                      </p>
                      <p className="text-xs opacity-70">
                        {formatDaysOverdue(alert?.dueDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Phone"
                      iconSize={16}
                      onClick={() => window.open(`tel:${alert?.phone}`, '_self')}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MessageCircle"
                      iconSize={16}
                      onClick={() => onContactPatient && onContactPatient(alert)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentAlerts;