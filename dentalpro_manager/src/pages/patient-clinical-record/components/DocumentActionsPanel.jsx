import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentActionsPanel = ({ patient, onGenerateDocument }) => {
  const [isGenerating, setIsGenerating] = useState(null);

  const documentTypes = [
    {
      id: 'treatment_quote',
      title: 'Cotización de Tratamiento',
      description: 'Genera una cotización detallada con costos y plan de tratamiento',
      icon: 'FileText',
      color: 'primary',
      estimatedTime: '2-3 minutos'
    },
    {
      id: 'consent_form',
      title: 'Formato de Consentimiento',
      description: 'Documento de consentimiento informado para tratamientos',
      icon: 'FileCheck',
      color: 'success',
      estimatedTime: '1-2 minutos'
    },
    {
      id: 'clinical_report',
      title: 'Reporte Clínico',
      description: 'Informe completo del estado clínico y evolución del paciente',
      icon: 'Activity',
      color: 'warning',
      estimatedTime: '3-4 minutos'
    },
    {
      id: 'payment_statement',
      title: 'Estado de Cuenta',
      description: 'Resumen de pagos, saldos pendientes y historial financiero',
      icon: 'CreditCard',
      color: 'accent',
      estimatedTime: '1-2 minutos'
    },
    {
      id: 'prescription',
      title: 'Receta Médica',
      description: 'Prescripción de medicamentos y recomendaciones post-tratamiento',
      icon: 'Pill',
      color: 'secondary',
      estimatedTime: '1 minuto'
    },
    {
      id: 'appointment_summary',
      title: 'Resumen de Cita',
      description: 'Documento con detalles de la consulta y próximos pasos',
      icon: 'Calendar',
      color: 'primary',
      estimatedTime: '1-2 minutos'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 border-primary/20 text-primary';
      case 'success': return 'bg-success/10 border-success/20 text-success';
      case 'warning': return 'bg-warning/10 border-warning/20 text-warning';
      case 'accent': return 'bg-accent/10 border-accent/20 text-accent';
      case 'secondary': return 'bg-secondary/10 border-secondary/20 text-secondary';
      default: return 'bg-muted/10 border-muted/20 text-muted-foreground';
    }
  };

  const handleGenerateDocument = async (documentType) => {
    setIsGenerating(documentType?.id);
    
    try {
      // Simulate document generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the parent handler
      if (onGenerateDocument) {
        onGenerateDocument(documentType?.id, patient);
      }
      
      // Show success message (in a real app, this would be handled by a toast system)
      console.log(`Documento ${documentType?.title} generado exitosamente`);
      
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGenerating(null);
    }
  };

  const quickActions = [
    {
      id: 'schedule_appointment',
      title: 'Agendar Cita',
      icon: 'Calendar',
      action: () => window.location.href = '/appointment-scheduling'
    },
    {
      id: 'send_reminder',
      title: 'Enviar Recordatorio',
      icon: 'MessageCircle',
      action: () => console.log('Sending reminder...')
    },
    {
      id: 'view_payments',
      title: 'Ver Pagos',
      icon: 'DollarSign',
      action: () => window.location.href = '/financial-management'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Generación de Documentos</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Genera documentos clínicos y administrativos para {patient?.firstName} {patient?.lastName}
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Document Generation Options */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Documentos Disponibles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentTypes?.map((docType) => (
              <div
                key={docType?.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getColorClasses(docType?.color)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon name={docType?.icon} size={20} />
                    <div>
                      <h5 className="font-medium">{docType?.title}</h5>
                      <p className="text-sm opacity-80 mt-1">{docType?.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs opacity-70">
                    Tiempo estimado: {docType?.estimatedTime}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateDocument(docType)}
                    loading={isGenerating === docType?.id}
                    iconName={isGenerating === docType?.id ? "Loader2" : "Download"}
                    iconPosition="left"
                    iconSize={16}
                    className="border-current text-current hover:bg-current hover:text-white"
                  >
                    {isGenerating === docType?.id ? 'Generando...' : 'Generar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Acciones Rápidas</h4>
          <div className="flex flex-wrap gap-3">
            {quickActions?.map((action) => (
              <Button
                key={action?.id}
                variant="outline"
                size="sm"
                onClick={action?.action}
                iconName={action?.icon}
                iconPosition="left"
                iconSize={16}
                className="transition-clinical"
              >
                {action?.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Documentos Recientes</h4>
          <div className="space-y-3">
            {[
              {
                id: 1,
                title: 'Cotización de Tratamiento - Ortodoncia',
                date: '2024-01-08',
                type: 'PDF',
                size: '245 KB'
              },
              {
                id: 2,
                title: 'Consentimiento Informado - Endodoncia',
                date: '2024-01-05',
                type: 'PDF',
                size: '180 KB'
              },
              {
                id: 3,
                title: 'Estado de Cuenta - Enero 2024',
                date: '2024-01-01',
                type: 'PDF',
                size: '156 KB'
              }
            ]?.map((doc) => (
              <div key={doc?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="FileText" size={16} color="var(--color-primary)" />
                  <div>
                    <div className="font-medium text-foreground text-sm">{doc?.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(doc.date)?.toLocaleDateString('es-MX')} • {doc?.type} • {doc?.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="Eye"
                    iconSize={16}
                    className="w-8 h-8"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="Download"
                    iconSize={16}
                    className="w-8 h-8"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Templates */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Plantillas Personalizadas</h4>
          <div className="bg-muted/30 p-4 rounded-lg border border-dashed border-muted">
            <div className="text-center">
              <Icon name="FileTemplate" size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">
                Crea plantillas personalizadas para documentos frecuentes
              </p>
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Crear Plantilla
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentActionsPanel;