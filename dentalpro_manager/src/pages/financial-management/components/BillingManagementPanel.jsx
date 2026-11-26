import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BillingManagementPanel = () => {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const invoicesData = [
    {
      id: 1,
      invoiceNumber: "FAC-2025-001",
      patientName: "Ana Martínez López",
      patientId: "PAT-001",
      amount: 2450.00,
      issueDate: "2025-01-05",
      dueDate: "2025-01-15",
      status: "pending",
      treatments: ["Limpieza dental", "Fluorización"],
      paymentMethod: "Pendiente"
    },
    {
      id: 2,
      invoiceNumber: "FAC-2025-002",
      patientName: "Carlos Rodríguez García",
      patientId: "PAT-002",
      amount: 1850.00,
      issueDate: "2025-01-03",
      dueDate: "2025-01-10",
      status: "overdue",
      treatments: ["Consulta general", "Radiografía"],
      paymentMethod: "Pendiente"
    },
    {
      id: 3,
      invoiceNumber: "FAC-2025-003",
      patientName: "María González Hernández",
      patientId: "PAT-003",
      amount: 3200.00,
      issueDate: "2025-01-02",
      dueDate: "2025-01-20",
      status: "paid",
      treatments: ["Ortodoncia - Consulta inicial"],
      paymentMethod: "Tarjeta de Crédito"
    },
    {
      id: 4,
      invoiceNumber: "FAC-2025-004",
      patientName: "José Luis Fernández",
      patientId: "PAT-004",
      amount: 950.00,
      issueDate: "2024-12-28",
      dueDate: "2024-12-30",
      status: "overdue",
      treatments: ["Extracción molar"],
      paymentMethod: "Pendiente"
    },
    {
      id: 5,
      invoiceNumber: "FAC-2025-005",
      patientName: "Laura Sánchez Morales",
      patientId: "PAT-005",
      amount: 4100.00,
      issueDate: "2025-01-01",
      dueDate: "2025-01-25",
      status: "partial",
      treatments: ["Implante dental", "Corona"],
      paymentMethod: "Parcial - $2000"
    }
  ];

  const quickActions = [
    {
      title: "Nueva Factura",
      description: "Crear factura para tratamiento",
      icon: "FileText",
      color: "primary",
      action: "create-invoice"
    },
    {
      title: "Registrar Pago",
      description: "Registrar pago recibido",
      icon: "CreditCard",
      color: "success",
      action: "record-payment"
    },
    {
      title: "Estado de Cuenta",
      description: "Generar estado de cuenta",
      icon: "Receipt",
      color: "secondary",
      action: "generate-statement"
    },
    {
      title: "Recordatorio",
      description: "Enviar recordatorio de pago",
      icon: "Bell",
      color: "warning",
      action: "send-reminder"
    }
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
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
            <Icon name="CheckCircle" size={12} className="mr-1" />
            Pagada
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
            <Icon name="Clock" size={12} className="mr-1" />
            Pendiente
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error border border-error/20">
            <Icon name="AlertCircle" size={12} className="mr-1" />
            Vencida
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <Icon name="DollarSign" size={12} className="mr-1" />
            Parcial
          </span>
        );
      default:
        return null;
    }
  };

  const getActionColor = (color) => {
    switch (color) {
      case 'success':
        return 'bg-success/10 border-success/20 text-success hover:bg-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning hover:bg-warning/20';
      case 'secondary':
        return 'bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary/20';
      default:
        return 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20';
    }
  };

  const handleInvoiceSelect = (invoiceId) => {
    setSelectedInvoices(prev => 
      prev?.includes(invoiceId) 
        ? prev?.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} for invoices:`, selectedInvoices);
  };

  const filteredInvoices = invoicesData?.filter(invoice =>
    invoice?.patientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    invoice?.invoiceNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg clinical-shadow">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
          <p className="text-sm text-muted-foreground">Gestión de facturación y pagos</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions?.map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-lg border transition-clinical text-left ${getActionColor(action?.color)}`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon name={action?.icon} size={24} />
                  <h4 className="font-medium">{action?.title}</h4>
                </div>
                <p className="text-sm opacity-80">{action?.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Invoices Management */}
      <div className="bg-card border border-border rounded-lg clinical-shadow">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Facturas</h3>
              <p className="text-sm text-muted-foreground">Gestión de facturas y estados de cuenta</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar factura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10 w-64"
                />
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </div>
              <Button variant="default" iconName="Plus" iconPosition="left">
                Nueva Factura
              </Button>
            </div>
          </div>
          
          {selectedInvoices?.length > 0 && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary font-medium">
                  {selectedInvoices?.length} factura(s) seleccionada(s)
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleBulkAction('send-reminder')}>
                    Enviar Recordatorio
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleBulkAction('export')}>
                    Exportar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedInvoices([])}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        setSelectedInvoices(filteredInvoices?.map(inv => inv?.id));
                      } else {
                        setSelectedInvoices([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left p-4 font-medium text-foreground">Factura</th>
                <th className="text-left p-4 font-medium text-foreground">Paciente</th>
                <th className="text-left p-4 font-medium text-foreground">Monto</th>
                <th className="text-left p-4 font-medium text-foreground">Vencimiento</th>
                <th className="text-left p-4 font-medium text-foreground">Estado</th>
                <th className="text-right p-4 font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices?.map((invoice) => (
                <tr key={invoice?.id} className="border-t border-border hover:bg-muted/30 transition-clinical">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                      checked={selectedInvoices?.includes(invoice?.id)}
                      onChange={() => handleInvoiceSelect(invoice?.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{invoice?.invoiceNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        Emitida: {formatDate(invoice?.issueDate)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{invoice?.patientName}</div>
                      <div className="text-sm text-muted-foreground">{invoice?.patientId}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{formatCurrency(invoice?.amount)}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-foreground">{formatDate(invoice?.dueDate)}</div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(invoice?.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" iconName="Eye">
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm" iconName="Download">
                        PDF
                      </Button>
                      <Button variant="ghost" size="sm" iconName="CreditCard">
                        Cobrar
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

export default BillingManagementPanel;