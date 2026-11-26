import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppointmentTimeline = ({ appointments, onAppointmentClick, onReschedule }) => {
  const getStatusColor = (status) => {
    const colors = {
      'confirmada': 'bg-success/10 text-success border-success/20',
      'pendiente': 'bg-warning/10 text-warning border-warning/20',
      'completada': 'bg-primary/10 text-primary border-primary/20',
      'cancelada': 'bg-error/10 text-error border-error/20'
    };
    return colors?.[status] || colors?.pendiente;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'confirmada': 'CheckCircle',
      'pendiente': 'Clock',
      'completada': 'Check',
      'cancelada': 'X'
    };
    return icons?.[status] || 'Clock';
  };

  const formatTime = (time) => {
    return new Date(`2025-01-01 ${time}`)?.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Citas de Hoy</h3>
            <p className="text-sm text-muted-foreground">
              {new Date()?.toLocaleDateString('es-MX', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            onClick={() => window.location.href = '/appointment-scheduling'}
          >
            Nueva Cita
          </Button>
        </div>
      </div>
      <div className="p-6">
        {appointments?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay citas programadas para hoy</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => window.location.href = '/appointment-scheduling'}
            >
              Programar Primera Cita
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments?.map((appointment, index) => (
              <div
                key={appointment?.id}
                className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-clinical cursor-pointer"
                onClick={() => onAppointmentClick && onAppointmentClick(appointment)}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 text-center">
                    <div className="text-lg font-semibold text-foreground">
                      {formatTime(appointment?.time)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {appointment?.duration}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {appointment?.patientName}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment?.status)}`}>
                      <Icon name={getStatusIcon(appointment?.status)} size={12} className="mr-1" />
                      {appointment?.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {appointment?.treatment}
                  </p>
                  {appointment?.notes && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {appointment?.notes}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Phone"
                    iconSize={16}
                    onClick={(e) => {
                      e?.stopPropagation();
                      window.open(`tel:${appointment?.phone}`, '_self');
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MessageCircle"
                    iconSize={16}
                    onClick={(e) => {
                      e?.stopPropagation();
                      window.open(`https://wa.me/52${appointment?.phone?.replace(/\D/g, '')}`, '_blank');
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreVertical"
                    iconSize={16}
                    onClick={(e) => {
                      e?.stopPropagation();
                      onReschedule && onReschedule(appointment);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentTimeline;