import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TreatmentReminders = ({ reminders, onViewPatient, onMarkComplete }) => {
  const getReminderIcon = (type) => {
    const icons = {
      'follow_up': 'Calendar',
      'next_appointment': 'Clock',
      'treatment_plan': 'Stethoscope',
      'lab_results': 'FileText',
      'medication': 'Pill'
    };
    return icons?.[type] || 'Bell';
  };

  const getReminderColor = (priority) => {
    const colors = {
      'high': 'text-error bg-error/10 border-error/20',
      'medium': 'text-warning bg-warning/10 border-warning/20',
      'low': 'text-primary bg-primary/10 border-primary/20'
    };
    return colors?.[priority] || 'text-muted-foreground bg-muted/10 border-border';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      'high': 'Alta',
      'medium': 'Media',
      'low': 'Baja'
    };
    return labels?.[priority] || 'Normal';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} días atrasado`;
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    return `En ${diffDays} días`;
  };

  return (
    <div className="bg-card border border-border rounded-lg clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recordatorios de Tratamiento</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {reminders?.length} pendientes
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconName="Settings"
              iconSize={16}
            />
          </div>
        </div>
      </div>
      <div className="p-6">
        {reminders?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <p className="text-muted-foreground">No hay recordatorios pendientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders?.map((reminder, index) => (
              <div
                key={reminder?.id}
                className={`p-4 rounded-lg border ${getReminderColor(reminder?.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon name={getReminderIcon(reminder?.type)} size={20} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium">{reminder?.patientName}</h4>
                        <span className="text-xs px-2 py-1 bg-background rounded-full">
                          {getPriorityLabel(reminder?.priority)}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 mb-2">
                        {reminder?.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs opacity-70">
                        <span>{formatDate(reminder?.dueDate)}</span>
                        <span>•</span>
                        <span>{getDaysUntil(reminder?.dueDate)}</span>
                        {reminder?.treatment && (
                          <>
                            <span>•</span>
                            <span>{reminder?.treatment}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="User"
                      iconSize={16}
                      onClick={() => onViewPatient && onViewPatient(reminder?.patientId)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Check"
                      iconSize={16}
                      onClick={() => onMarkComplete && onMarkComplete(reminder?.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentReminders;