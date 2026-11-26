import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentTrackingSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const recentPayments = [
    {
      id: 1,
      patientName: "Ana Martínez López",
      amount: 1500.00,
      method: "Tarjeta de Crédito",
      date: "2025-01-08",
      time: "14:30",
      status: "completed",
      reference: "TXN-001234",
      treatment: "Limpieza dental"
    },
    {
      id: 2,
      patientName: "Carlos Rodríguez García",
      amount: 850.00,
      method: "Efectivo",
      date: "2025-01-08",
      time: "11:15",
      status: "completed",
      reference: "TXN-001235",
      treatment: "Consulta general"
    },
    {
      id: 3,
      patientName: "María González Hernández",
      amount: 2200.00,
      method: "Transferencia",
      date: "2025-01-07",
      time: "16:45",
      status: "pending",
      reference: "TXN-001236",
      treatment: "Ortodoncia"
    },
    {
      id: 4,
      patientName: "José Luis Fernández",
      amount: 650.00,
      method: "Tarjeta de Débito",
      date: "2025-01-07",
      time: "09:20",
      status: "completed",
      reference: "TXN-001237",
      treatment: "Extracción"
    },
    {
      id: 5,
      patientName: "Laura Sánchez Morales",
      amount: 3200.00,
      method: "Tarjeta de Crédito",
      date: "2025-01-06",
      time: "13:10",
      status: "completed",
      reference: "TXN-001238",
      treatment: "Implante dental"
    }
  ];

  const paymentMethods = [
    { method: "Tarjeta de Crédito", count: 12, percentage: 45, amount: 18500.00 },
    { method: "Efectivo", count: 8, percentage: 30, amount: 12300.00 },
    { method: "Transferencia", count: 5, percentage: 18, amount: 7400.00 },
    { method: "Tarjeta de Débito", count: 3, percentage: 7, amount: 2800.00 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-MX');
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
          <Icon name="CheckCircle" size={12} className="mr-1" />
          Completado
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
          <Icon name="Clock" size={12} className="mr-1" />
          Pendiente
        </span>
      );
    }
    return null;
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Tarjeta de Crédito': case'Tarjeta de Débito':
        return 'CreditCard';
      case 'Efectivo':
        return 'Banknote';
      case 'Transferencia':
        return 'ArrowRightLeft';
      default:
        return 'DollarSign';
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods Summary */}
      <div className="bg-card border border-border rounded-lg clinical-shadow">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Métodos de Pago</h3>
              <p className="text-sm text-muted-foreground">Distribución de pagos por método</p>
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
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods?.map((method, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={getMethodIcon(method?.method)} size={20} color="var(--color-primary)" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{method?.method}</h4>
                    <p className="text-xs text-muted-foreground">{method?.count} transacciones</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Total</span>
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(method?.amount)}</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${method?.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">{method?.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Recent Payments */}
      <div className="bg-card border border-border rounded-lg clinical-shadow">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Pagos Recientes</h3>
              <p className="text-sm text-muted-foreground">Últimas transacciones registradas</p>
            </div>
            <Button variant="outline" iconName="Download" iconPosition="left">
              Exportar
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Paciente</th>
                <th className="text-left p-4 font-medium text-foreground">Monto</th>
                <th className="text-left p-4 font-medium text-foreground">Método</th>
                <th className="text-left p-4 font-medium text-foreground">Fecha</th>
                <th className="text-left p-4 font-medium text-foreground">Estado</th>
                <th className="text-right p-4 font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments?.map((payment) => (
                <tr key={payment?.id} className="border-t border-border hover:bg-muted/30 transition-clinical">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{payment?.patientName}</div>
                      <div className="text-sm text-muted-foreground">{payment?.treatment}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{formatCurrency(payment?.amount)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={getMethodIcon(payment?.method)} size={16} className="text-muted-foreground" />
                      <span className="text-foreground">{payment?.method}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-foreground">{formatDate(payment?.date)}</div>
                      <div className="text-sm text-muted-foreground">{payment?.time}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(payment?.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" iconName="Eye">
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm" iconName="Download">
                        Recibo
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTrackingSection;