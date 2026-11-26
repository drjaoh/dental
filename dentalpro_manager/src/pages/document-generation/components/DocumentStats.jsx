import React from 'react';
import Icon from '../../../components/AppIcon';

const DocumentStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Documentos Generados',
      value: stats?.totalDocuments,
      change: '+12%',
      changeType: 'positive',
      icon: 'FileText',
      color: 'bg-blue-500'
    },
    {
      title: 'Cotizaciones Enviadas',
      value: stats?.quotationsSent,
      change: '+8%',
      changeType: 'positive',
      icon: 'Calculator',
      color: 'bg-green-500'
    },
    {
      title: 'Formularios Firmados',
      value: stats?.formsSigned,
      change: '+15%',
      changeType: 'positive',
      icon: 'FileCheck',
      color: 'bg-purple-500'
    },
    {
      title: 'Reportes Generados',
      value: stats?.reportsGenerated,
      change: '+5%',
      changeType: 'positive',
      icon: 'BarChart3',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat?.color} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} color="white" />
            </div>
            <div className={`text-sm font-medium ${
              stat?.changeType === 'positive' ? 'text-success' : 'text-error'
            }`}>
              {stat?.change}
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">{stat?.value}</div>
            <div className="text-sm text-muted-foreground">{stat?.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentStats;