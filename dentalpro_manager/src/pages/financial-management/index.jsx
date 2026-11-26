import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FinancialMetricsCard from './components/FinancialMetricsCard';
import AccountsReceivableTable from './components/AccountsReceivableTable';
import PaymentTrackingSection from './components/PaymentTrackingSection';
import BillingManagementPanel from './components/BillingManagementPanel';
import TreatmentCostEstimator from './components/TreatmentCostEstimator';
import FinancialAlertsPanel from './components/FinancialAlertsPanel';
import FinancialAnalyticsSection from './components/FinancialAnalyticsSection';

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: 'LayoutDashboard' },
    { id: 'accounts', label: 'Cuentas por Cobrar', icon: 'CreditCard' },
    { id: 'payments', label: 'Pagos', icon: 'Receipt' },
    { id: 'billing', label: 'Facturación', icon: 'FileText' },
    { id: 'estimator', label: 'Cotizador', icon: 'Calculator' },
    { id: 'alerts', label: 'Alertas', icon: 'Bell' },
    { id: 'analytics', label: 'Análisis', icon: 'BarChart3' }
  ];

  const financialMetrics = [
    {
      title: "Ingresos del Mes",
      value: "$78,500",
      change: "+12.5%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "success"
    },
    {
      title: "Cuentas por Cobrar",
      value: "$12,350",
      change: "-8.2%",
      changeType: "positive",
      icon: "CreditCard",
      color: "warning"
    },
    {
      title: "Pagos Pendientes",
      value: "7",
      change: "+2",
      changeType: "negative",
      icon: "Clock",
      color: "error"
    },
    {
      title: "Ganancia Neta",
      value: "$50,500",
      change: "+15.3%",
      changeType: "positive",
      icon: "DollarSign",
      color: "primary"
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {financialMetrics?.map((metric, index) => (
                <FinancialMetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  color={metric?.color}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AccountsReceivableTable />
              <div className="space-y-6">
                <PaymentTrackingSection />
              </div>
            </div>
          </div>
        );
      case 'accounts':
        return <AccountsReceivableTable />;
      case 'payments':
        return <PaymentTrackingSection />;
      case 'billing':
        return <BillingManagementPanel />;
      case 'estimator':
        return <TreatmentCostEstimator />;
      case 'alerts':
        return <FinancialAlertsPanel />;
      case 'analytics':
        return <FinancialAnalyticsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border clinical-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="CreditCard" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Gestión Financiera</h1>
                <p className="text-sm text-muted-foreground">Control de ingresos, pagos y facturación</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="Download" iconPosition="left">
                Exportar Reporte
              </Button>
              <Button variant="default" iconName="Plus" iconPosition="left">
                Nueva Factura
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {tabs?.map((tab) => (
              <Button
                key={tab?.id}
                variant={activeTab === tab?.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab?.id)}
                iconName={tab?.icon}
                iconPosition="left"
                iconSize={16}
                className="whitespace-nowrap transition-clinical"
              >
                {tab?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
      {/* Mobile Bottom Padding */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default FinancialManagement;