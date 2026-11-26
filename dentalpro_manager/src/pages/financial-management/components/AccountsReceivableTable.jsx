import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AccountsReceivableTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');

  const accountsData = [
    {
      id: 1,
      patientName: "Ana Martínez López",
      patientId: "PAT-001",
      balance: 2450.00,
      dueDate: "2025-01-15",
      daysPastDue: 0,
      lastPayment: "2024-12-15",
      status: "current",
      phone: "555-0123"
    },
    {
      id: 2,
      patientName: "Carlos Rodríguez García",
      patientId: "PAT-002",
      balance: 1850.00,
      dueDate: "2025-01-10",
      daysPastDue: 5,
      lastPayment: "2024-11-20",
      status: "overdue",
      phone: "555-0124"
    },
    {
      id: 3,
      patientName: "María González Hernández",
      patientId: "PAT-003",
      balance: 3200.00,
      dueDate: "2025-01-20",
      daysPastDue: 0,
      lastPayment: "2024-12-28",
      status: "current",
      phone: "555-0125"
    },
    {
      id: 4,
      patientName: "José Luis Fernández",
      patientId: "PAT-004",
      balance: 950.00,
      dueDate: "2024-12-30",
      daysPastDue: 15,
      lastPayment: "2024-10-15",
      status: "overdue",
      phone: "555-0126"
    },
    {
      id: 5,
      patientName: "Laura Sánchez Morales",
      patientId: "PAT-005",
      balance: 4100.00,
      dueDate: "2025-01-25",
      daysPastDue: 0,
      lastPayment: "2025-01-05",
      status: "current",
      phone: "555-0127"
    }
  ];

  const getStatusBadge = (status, daysPastDue) => {
    if (status === 'overdue') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error border border-error/20">
          <Icon name="AlertCircle" size={12} className="mr-1" />
          Vencido ({daysPastDue}d)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
        <Icon name="CheckCircle" size={12} className="mr-1" />
        Al día
      </span>
    );
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = accountsData?.filter(account => 
      account?.patientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      account?.patientId?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )?.sort((a, b) => {
      let aValue = a?.[sortField];
      let bValue = b?.[sortField];
      
      if (sortField === 'dueDate' || sortField === 'lastPayment') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className="bg-card border border-border rounded-lg clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cuentas por Cobrar</h3>
            <p className="text-sm text-muted-foreground">Gestión de saldos pendientes y pagos</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar paciente..."
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
            <Button variant="outline" iconName="Download" iconPosition="left">
              Exportar
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button 
                  onClick={() => handleSort('patientName')}
                  className="flex items-center space-x-1 hover:text-primary transition-clinical"
                >
                  <span>Paciente</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button 
                  onClick={() => handleSort('balance')}
                  className="flex items-center space-x-1 hover:text-primary transition-clinical"
                >
                  <span>Saldo</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button 
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center space-x-1 hover:text-primary transition-clinical"
                >
                  <span>Vencimiento</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Estado</th>
              <th className="text-left p-4 font-medium text-foreground">Último Pago</th>
              <th className="text-right p-4 font-medium text-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData?.map((account) => (
              <tr key={account?.id} className="border-t border-border hover:bg-muted/30 transition-clinical">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{account?.patientName}</div>
                    <div className="text-sm text-muted-foreground">{account?.patientId}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">{formatCurrency(account?.balance)}</div>
                </td>
                <td className="p-4">
                  <div className="text-foreground">{formatDate(account?.dueDate)}</div>
                </td>
                <td className="p-4">
                  {getStatusBadge(account?.status, account?.daysPastDue)}
                </td>
                <td className="p-4">
                  <div className="text-muted-foreground">{formatDate(account?.lastPayment)}</div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" iconName="Eye">
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm" iconName="CreditCard">
                      Cobrar
                    </Button>
                    <Button variant="ghost" size="sm" iconName="MoreHorizontal">
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountsReceivableTable;