import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const WaitingListPanel = ({ 
  waitingList, 
  onAddToWaitingList, 
  onRemoveFromWaitingList,
  onScheduleFromWaitingList,
  treatments 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWaitingEntry, setNewWaitingEntry] = useState({
    patientName: '',
    phone: '',
    email: '',
    treatment: '',
    preferredDates: [],
    preferredTimes: [],
    notes: '',
    priority: 'normal'
  });

  const priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const treatmentOptions = treatments?.map(treatment => ({
    value: treatment?.id,
    label: treatment?.name,
    description: `$${treatment?.price} MXN - ${treatment?.duration} min`
  }));

  const timeSlotOptions = [
    { value: 'morning', label: 'Mañana (8:00 - 12:00)' },
    { value: 'afternoon', label: 'Tarde (12:00 - 18:00)' },
    { value: 'evening', label: 'Noche (18:00 - 20:00)' }
  ];

  const handleInputChange = (field, value) => {
    setNewWaitingEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleAddToWaitingList = () => {
    if (newWaitingEntry?.patientName && newWaitingEntry?.phone && newWaitingEntry?.treatment) {
      onAddToWaitingList({
        ...newWaitingEntry,
        id: Date.now(),
        dateAdded: new Date()?.toISOString()?.split('T')?.[0],
        status: 'waiting'
      });
      setNewWaitingEntry({
        patientName: '',
        phone: '',
        email: '',
        treatment: '',
        preferredDates: [],
        preferredTimes: [],
        notes: '',
        priority: 'normal'
      });
      setShowAddForm(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error';
      case 'high': return 'text-warning';
      case 'normal': return 'text-primary';
      case 'low': return 'text-muted-foreground';
      default: return 'text-primary';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return 'AlertTriangle';
      case 'high': return 'ArrowUp';
      case 'normal': return 'Minus';
      case 'low': return 'ArrowDown';
      default: return 'Minus';
    }
  };

  const formatDateRange = (dates) => {
    if (!dates || dates?.length === 0) return 'Cualquier fecha';
    if (dates?.length === 1) return new Date(dates[0])?.toLocaleDateString('es-MX');
    return `${dates?.length} fechas disponibles`;
  };

  const formatTimePreferences = (times) => {
    if (!times || times?.length === 0) return 'Cualquier horario';
    return times?.map(time => {
      switch (time) {
        case 'morning': return 'Mañana';
        case 'afternoon': return 'Tarde';
        case 'evening': return 'Noche';
        default: return time;
      }
    })?.join(', ');
  };

  return (
    <div className="bg-card border-l border-border w-80 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={20} />
          <h3 className="text-lg font-semibold">Lista de Espera</h3>
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {waitingList?.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          iconName={isExpanded ? "ChevronRight" : "ChevronLeft"}
          iconSize={20}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      {isExpanded && (
        <>
          {/* Add to Waiting List Button */}
          <div className="p-4 border-b border-border">
            <Button
              variant="outline"
              fullWidth
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              Agregar a Lista de Espera
            </Button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="p-4 border-b border-border bg-muted/30 space-y-3">
              <Input
                label="Nombre del paciente"
                value={newWaitingEntry?.patientName}
                onChange={(e) => handleInputChange('patientName', e?.target?.value)}
                required
              />
              <Input
                label="Teléfono"
                type="tel"
                value={newWaitingEntry?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                value={newWaitingEntry?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
              />
              <Select
                label="Tratamiento"
                options={treatmentOptions}
                value={newWaitingEntry?.treatment}
                onChange={(value) => handleInputChange('treatment', value)}
                searchable
                required
              />
              <Select
                label="Prioridad"
                options={priorityOptions}
                value={newWaitingEntry?.priority}
                onChange={(value) => handleInputChange('priority', value)}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Notas</label>
                <textarea
                  className="w-full p-2 border border-border rounded-lg text-sm resize-none"
                  rows={2}
                  value={newWaitingEntry?.notes}
                  onChange={(e) => handleInputChange('notes', e?.target?.value)}
                  placeholder="Notas adicionales..."
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddToWaitingList}
                  className="flex-1"
                >
                  Agregar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Waiting List Items */}
          <div className="flex-1 overflow-y-auto">
            {waitingList?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Icon name="Clock" size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">No hay pacientes en lista de espera</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {waitingList?.map((entry) => (
                  <div
                    key={entry?.id}
                    className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-clinical"
                  >
                    {/* Patient Info */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-sm">{entry?.patientName}</h4>
                          <Icon 
                            name={getPriorityIcon(entry?.priority)} 
                            size={14} 
                            className={getPriorityColor(entry?.priority)}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{entry?.phone}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Calendar"
                          iconSize={12}
                          onClick={() => onScheduleFromWaitingList(entry)}
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="X"
                          iconSize={12}
                          onClick={() => onRemoveFromWaitingList(entry?.id)}
                        />
                      </div>
                    </div>

                    {/* Treatment */}
                    <div className="mb-2">
                      <p className="text-xs font-medium text-primary">{entry?.treatment}</p>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={10} />
                        <span>{formatDateRange(entry?.preferredDates)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={10} />
                        <span>{formatTimePreferences(entry?.preferredTimes)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Plus" size={10} />
                        <span>Agregado: {new Date(entry.dateAdded)?.toLocaleDateString('es-MX')}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {entry?.notes && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        {entry?.notes}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="mt-3 flex space-x-1">
                      <Button
                        variant="outline"
                        size="xs"
                        iconName="Phone"
                        iconSize={12}
                        onClick={() => window.open(`tel:${entry?.phone}`)}
                      >
                        Llamar
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        iconName="MessageCircle"
                        iconSize={12}
                        onClick={() => window.open(`https://wa.me/${entry?.phone?.replace(/\D/g, '')}`)}
                      >
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auto-notification Settings */}
          <div className="p-4 border-t border-border">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Notificaciones Automáticas</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-xs">
                  <input type="checkbox" defaultChecked className="rounded border-border" />
                  <span>Notificar cuando haya cancelaciones</span>
                </label>
                <label className="flex items-center space-x-2 text-xs">
                  <input type="checkbox" defaultChecked className="rounded border-border" />
                  <span>Enviar recordatorio semanal</span>
                </label>
                <label className="flex items-center space-x-2 text-xs">
                  <input type="checkbox" className="rounded border-border" />
                  <span>Auto-programar citas disponibles</span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WaitingListPanel;