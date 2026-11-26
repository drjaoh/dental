import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentDocuments = ({ documents, onViewDocument, onDuplicateDocument }) => {
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'quotation': return 'Calculator';
      case 'consent': return 'FileCheck';
      case 'report': return 'FileText';
      case 'statement': return 'FileSpreadsheet';
      default: return 'File';
    }
  };

  const getDocumentColor = (type) => {
    switch (type) {
      case 'quotation': return 'text-blue-600';
      case 'consent': return 'text-green-600';
      case 'report': return 'text-purple-600';
      case 'statement': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'sent': { color: 'bg-green-100 text-green-800', label: 'Enviado' },
      'draft': { color: 'bg-yellow-100 text-yellow-800', label: 'Borrador' },
      'pending': { color: 'bg-blue-100 text-blue-800', label: 'Pendiente' },
      'signed': { color: 'bg-purple-100 text-purple-800', label: 'Firmado' }
    };

    const config = statusConfig?.[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  if (!documents || documents?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center">
          <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay documentos recientes</h3>
          <p className="text-muted-foreground mb-4">Comienza creando tu primer documento</p>
          <Button variant="default" iconName="Plus" iconPosition="left" iconSize={16}>
            Crear Documento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Documentos Recientes</h3>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" iconSize={16} />
        </div>
      </div>
      <div className="divide-y divide-border">
        {documents?.map((document) => (
          <div key={document?.id} className="p-4 hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${getDocumentColor(document?.type)}`}>
                  <Icon name={getDocumentIcon(document?.type)} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">{document?.title}</h4>
                    {getStatusBadge(document?.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="User" size={14} />
                      <span>{document?.patientName}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{document?.createdAt}</span>
                    </span>
                    {document?.size && (
                      <span className="flex items-center space-x-1">
                        <Icon name="HardDrive" size={14} />
                        <span>{document?.size}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDocument(document)}
                  iconName="Eye"
                  iconSize={16}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDuplicateDocument(document)}
                  iconName="Copy"
                  iconSize={16}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Download"
                  iconSize={16}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MoreVertical"
                  iconSize={16}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          iconName="Archive"
          iconPosition="left"
          iconSize={16}
        >
          Ver Todos los Documentos
        </Button>
      </div>
    </div>
  );
};

export default RecentDocuments;