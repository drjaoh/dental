import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentPreview = ({ 
  document, 
  onClose, 
  onSave, 
  onPrint, 
  onEmail, 
  onDownload 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Selecciona un documento para previsualizar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} />
          <div>
            <h3 className="font-semibold text-foreground">{document?.title}</h3>
            <p className="text-sm text-muted-foreground">{document?.type}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction(onPrint)}
            iconName="Printer"
            iconSize={16}
            disabled={isLoading}
          >
            Imprimir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction(onEmail)}
            iconName="Mail"
            iconSize={16}
            disabled={isLoading}
          >
            Enviar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction(onDownload)}
            iconName="Download"
            iconSize={16}
            disabled={isLoading}
          >
            Descargar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={16}
          />
        </div>
      </div>
      {/* Document Content */}
      <div className="flex-1 p-6 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto bg-white shadow-lg">
          {/* Document Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DentalPro Manager</h1>
                <p className="text-gray-600">Clínica Dental Profesional</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>Fecha: {new Date()?.toLocaleDateString('es-MX')}</p>
                <p>Documento: #{document?.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Información de la Clínica</h3>
                <p className="text-sm text-gray-600">
                  Av. Reforma 123, Col. Centro<br />
                  Ciudad de México, CDMX 06000<br />
                  Tel: (55) 1234-5678<br />
                  contacto@dentalpro.mx
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Información del Paciente</h3>
                <p className="text-sm text-gray-600">
                  {document?.patientName}<br />
                  {document?.patientPhone}<br />
                  {document?.patientEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{document?.title}</h2>
            
            {document?.type === 'quotation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Tratamientos Propuestos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Tratamiento</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Cantidad</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Precio Unit.</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {document?.treatments?.map((treatment, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{treatment?.name}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{treatment?.quantity}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">${treatment?.unitPrice?.toLocaleString('es-MX')}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">${treatment?.total?.toLocaleString('es-MX')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-semibold">
                          <td colSpan="3" className="border border-gray-300 px-4 py-2 text-right">Total:</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">${document?.total?.toLocaleString('es-MX')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Opciones de Pago</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pago de contado: 10% de descuento</li>
                    <li>• Pago en 3 meses: Sin intereses</li>
                    <li>• Pago en 6 meses: 5% de interés</li>
                  </ul>
                </div>
              </div>
            )}

            {document?.type === 'consent' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Por medio del presente documento, yo {document?.patientName}, 
                  mayor de edad, con pleno conocimiento y capacidad legal, 
                  manifiesto mi consentimiento informado para el tratamiento dental propuesto.
                </p>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tratamiento Propuesto</h3>
                  <p className="text-sm text-gray-700">{document?.treatmentDescription}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Riesgos y Complicaciones</h3>
                  <p className="text-sm text-gray-700">{document?.risks}</p>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="border-t border-gray-400 w-48 mb-2"></div>
                      <p className="text-sm text-gray-600">Firma del Paciente</p>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-gray-400 w-48 mb-2"></div>
                      <p className="text-sm text-gray-600">Firma del Doctor</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {document?.type === 'report' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hallazgos Clínicos</h3>
                  <p className="text-sm text-gray-700">{document?.findings}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Diagnóstico</h3>
                  <p className="text-sm text-gray-700">{document?.diagnosis}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Plan de Tratamiento</h3>
                  <p className="text-sm text-gray-700">{document?.treatmentPlan}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recomendaciones</h3>
                  <p className="text-sm text-gray-700">{document?.recommendations}</p>
                </div>
              </div>
            )}

            {document?.type === 'statement' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Estado de Cuenta</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Concepto</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Cargo</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Pago</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {document?.transactions?.map((transaction, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{transaction?.date}</td>
                            <td className="border border-gray-300 px-4 py-2">{transaction?.concept}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              {transaction?.charge ? `$${transaction?.charge?.toLocaleString('es-MX')}` : '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              {transaction?.payment ? `$${transaction?.payment?.toLocaleString('es-MX')}` : '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-right">
                              ${transaction?.balance?.toLocaleString('es-MX')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Saldo Actual:</span>
                    <span className="text-xl font-bold text-primary">${document?.currentBalance?.toLocaleString('es-MX')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Document Footer */}
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            <div className="text-center text-xs text-gray-500">
              <p>Este documento fue generado automáticamente por DentalPro Manager</p>
              <p>Para cualquier duda o aclaración, contacte a la clínica</p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Actions */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-muted/50">
        <div className="text-sm text-muted-foreground">
          Documento generado el {new Date()?.toLocaleString('es-MX')}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            loading={isLoading}
          >
            Guardar Cambios
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleAction(onDownload)}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            loading={isLoading}
          >
            Descargar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;