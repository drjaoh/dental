import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const TemplateGrid = ({ templates, selectedType, onSelectTemplate, onEditTemplate }) => {
  if (!templates || templates?.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No hay plantillas disponibles</h3>
        <p className="text-muted-foreground">Crea tu primera plantilla para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates?.map((template) => (
        <div
          key={template?.id}
          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
        >
          {/* Template Preview */}
          <div className="aspect-[3/4] bg-muted relative overflow-hidden">
            <Image
              src={template?.preview}
              alt={`Vista previa de ${template?.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  template?.category === 'quotation' ? 'bg-blue-500 text-white' :
                  template?.category === 'consent' ? 'bg-green-500 text-white' :
                  template?.category === 'report'? 'bg-purple-500 text-white' : 'bg-orange-500 text-white'
                }`}>
                  {template?.categoryLabel}
                </div>
                {template?.isDefault && (
                  <div className="bg-warning text-white px-2 py-1 rounded text-xs font-medium">
                    Por defecto
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Template Info */}
          <div className="p-4">
            <h4 className="font-semibold text-foreground mb-1">{template?.name}</h4>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {template?.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span>Usado {template?.usageCount} veces</span>
              <span>Actualizado {template?.lastModified}</span>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onSelectTemplate(template)}
                iconName="Eye"
                iconPosition="left"
                iconSize={14}
                className="flex-1"
              >
                Usar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditTemplate(template)}
                iconName="Edit"
                iconSize={14}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateGrid;