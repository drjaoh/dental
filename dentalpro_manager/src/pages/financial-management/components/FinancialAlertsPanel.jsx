import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FinancialAlertsPanel = () => {
  const [selectedAlerts, setSelectedAlerts] = useState([]);

  const financialAlerts = [
    {
      id: 1,
      type: "overdue",
      priority: "high",
      title: "Pago Vencido - José Luis Fernández",
      description: "Factura FAC-2025-004 vencida hace 15 días",
      amount: 950.00,
      dueDate: "2024-12-30",
      patientId: "PAT-004",
      actions: ["call", "email", "sms"],
      createdAt: "2025-01-08T10:00:00Z"
    },
    {
      id: 2,
      type: "due_soon",
      priority: "medium",
      title: "Pago Próximo a Vencer - Carlos Rodríguez",
      description: "Factura FAC-2025-002 vence en 2 días",
      amount: 1850.00,
      dueDate: "2025-01-10",
      patientId: "PAT-002",
      actions: ["email", "sms"],
      createdAt: "2025-01-08T09:30:00Z"
    },
    {
      id: 3,
      type: "high_balance",
      priority: "medium",
      title: "Saldo Alto - Laura Sánchez Morales",
      description: "Saldo pendiente superior a $4,000 MXN",
      amount: 4100.00,
      dueDate: "2025-01-25",
      patientId: "PAT-005",
      actions: ["call", "meeting"],
      createdAt: "2025-01-08T08:15:00Z"
    },
    {
      id: 4,
      type: "payment_plan",
      priority: "low",
      title: "Plan de Pagos - Ana Martínez López",
      description: "Próximo pago del plan de financiamiento",
      amount: 816.67,
      dueDate: "2025-01-15",
      patientId: "PAT-001",
      actions: ["reminder"],
      createdAt: "2025-01-07T16:45:00Z"
    },
    {
      id: 5,
      type: "collection",
      priority: "high",
      title: "Cuenta en Cobranza - Roberto Jiménez",
      description: "Cuenta enviada a proceso de cobranza",
      amount: 2300.00,
      dueDate: "2024-11-15",
      patientId: "PAT-006",
      actions: ["legal", "call"],
      createdAt: "2025-01-06T14:20:00Z"
    }
  ];

  const alertStats = {
    total: financialAlerts?.length,
    high: financialAlerts?.filter(a => a?.priority === 'high')?.length,
    medium: financialAlerts?.filter(a => a?.priority === 'medium')?.length,
    low: financialAlerts?.filter(a => a?.priority === 'low')?.length,
    totalAmount: financialAlerts?.reduce((sum, alert) => sum + alert?.amount, 0)
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-MX');
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'overdue':
        return 'AlertTriangle';
      case 'due_soon':
        return 'Clock';
      case 'high_balance':
        return 'DollarSign';
      case 'payment_plan':
        return 'Calendar';
      case 'collection':
        return 'AlertCircle';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-error/20 bg-error/5';
      case 'medium':
        return 'border-warning/20 bg-warning/5';
      case 'low':
        return 'border-primary/20 bg-primary/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error border border-error/20">
            <Icon name="AlertTriangle" size={10} className="mr-1" />
            Alta
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
            <Icon name="AlertCircle" size={10} className="mr-1" />
            Media
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <Icon name="Info" size={10} className="mr-1" />
            Baja
          </span>
        );
      default:
        return null;
    }
  };

  const getActionButton = (action) => {
    switch (action) {
      case 'call':
        return { icon: 'Phone', label: 'Llamar', variant: 'outline' };
      case 'email':
        return { icon: 'Mail', label: 'Email', variant: 'outline' };
      case 'sms':
        return { icon: 'MessageSquare', label: 'SMS', variant: 'outline' };
      case 'meeting':
        return { icon: 'Calendar', label: 'Cita', variant: 'outline' };
      case 'reminder':
        return { icon: 'Bell', label: 'Recordar', variant: 'ghost' };
      case 'legal':
        return { icon: 'Scale', label: 'Legal', variant: 'destructive' };
      default:
        return { icon: 'MoreHorizontal', label: 'Más', variant: 'ghost' };
    }
  };

  const handleAlertSelect = (alertId) => {
    setSelectedAlerts(prev => 
      prev?.includes(alertId) 
        ? prev?.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} for alerts:`, selectedAlerts);
  };

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 clinical-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Bell" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Alertas</div>
              <div className="text-xl font-bold text-foreground">{alertStats?.total}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 clinical-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Prioridad Alta</div>
              <div className="text-xl font-bold text-error">{alertStats?.high}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 clinical-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Prioridad Media</div>
              <div className="text-xl font-bold text-warning">{alertStats?.medium}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 clinical-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} color="var(--color-success)" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Monto Total</div>
              <div className="text-lg font-bold text-foreground">{formatCurrency(alertStats?.totalAmount)}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Alerts List */}
      <div className="bg-card border border-border rounded-lg clinical-shadow">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Alertas Financieras</h3>
              <p className="text-sm text-muted-foreground">Gestión de pagos y cobranza</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" iconName="Settings" iconPosition="left">
                Configurar
              </Button>
              <Button variant="ghost" iconName="RefreshCw" iconPosition="left">
                Actualizar
              </Button>
            </div>
          </div>
          
          {selectedAlerts?.length > 0 && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary font-medium">
                  {selectedAlerts?.length} alerta(s) seleccionada(s)
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleBulkAction('mark-resolved')}>
                    Marcar Resueltas
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleBulkAction('send-reminders')}>
                    Enviar Recordatorios
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedAlerts([])}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {financialAlerts?.map((alert) => (
            <div
              key={alert?.id}
              className={`p-4 rounded-lg border transition-clinical ${getAlertColor(alert?.priority)}`}
            >
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-border"
                  checked={selectedAlerts?.includes(alert?.id)}
                  onChange={() => handleAlertSelect(alert?.id)}
                />
                
                <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
                  <Icon name={getAlertIcon(alert?.type)} size={20} className="text-muted-foreground" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{alert?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{alert?.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {getPriorityBadge(alert?.priority)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Icon name="DollarSign" size={14} className="mr-1" />
                        {formatCurrency(alert?.amount)}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Calendar" size={14} className="mr-1" />
                        Vence: {formatDate(alert?.dueDate)}
                      </span>
                      <span className="flex items-center">
                        <Icon name="User" size={14} className="mr-1" />
                        {alert?.patientId}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {alert?.actions?.slice(0, 3)?.map((action, index) => {
                        const actionConfig = getActionButton(action);
                        return (
                          <Button
                            key={index}
                            variant={actionConfig?.variant}
                            size="sm"
                            iconName={actionConfig?.icon}
                            iconPosition="left"
                          >
                            {actionConfig?.label}
                          </Button>
                        );
                      })}
                      {alert?.actions?.length > 3 && (
                        <Button variant="ghost" size="sm" iconName="MoreHorizontal">
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialAlertsPanel;