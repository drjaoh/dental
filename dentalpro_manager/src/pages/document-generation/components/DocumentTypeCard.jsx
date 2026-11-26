import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentTypeCard = ({ 
  type, 
  title, 
  description, 
  icon, 
  count, 
  isSelected, 
  onSelect,
  onCreateNew 
}) => {
  return (
    <div 
      className={`p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
      }`}
      onClick={() => onSelect(type)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
        }`}>
          <Icon name={icon} size={24} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{count}</div>
          <div className="text-xs text-muted-foreground">plantillas</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        onClick={(e) => {
          e?.stopPropagation();
          onCreateNew(type);
        }}
        iconName="Plus"
        iconPosition="left"
        iconSize={16}
        className="w-full"
      >
        Crear Nuevo
      </Button>
    </div>
  );
};

export default DocumentTypeCard;