import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AppointmentSidebar = ({ 
  selectedAppointment, 
  onClose, 
  onSave, 
  onDelete,
  patients,
  treatments 
}) => {
  const [formData, setFormData] = useState({
    patientId: selectedAppointment?.patientId || '',
    patientName: selectedAppointment?.patientName || '',
    phone: selectedAppointment?.phone || '',
    email: selectedAppointment?.email || '',
    date: selectedAppointment?.date || '',
    time: selectedAppointment?.time || '',
    duration: selectedAppointment?.duration || '30',
    treatment: selectedAppointment?.treatment || '',
    notes: selectedAppointment?.notes || '',
    status: selectedAppointment?.status || 'pending',
    reminderWhatsApp: selectedAppointment?.reminderWhatsApp || false,
    reminderSMS: selectedAppointment?.reminderSMS || false,
    reminderEmail: selectedAppointment?.reminderEmail || true
  });

  const [errors, setErrors] = useState({});
  const [isNewPatient, setIsNewPatient] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmada' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'no-show', label: 'No asistió' }
  ];

  const durationOptions = [
    { value: '15', label: '15 minutos' },
    { value: '30', label: '30 minutos' },
    { value: '45', label: '45 minutos' },
    { value: '60', label: '1 hora' },
    { value: '90', label: '1.5 horas' },
    { value: '120', label: '2 horas' }
  ];

  const patientOptions = patients?.map(patient => ({
    value: patient?.id,
    label: `${patient?.name} - ${patient?.phone}`,
    description: patient?.email
  }));

  const treatmentOptions = treatments?.map(treatment => ({
    value: treatment?.id,
    label: treatment?.name,
    description: `$${treatment?.price} MXN - ${treatment?.duration} min`
  }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePatientSelect = (patientId) => {
    const patient = patients?.find(p => p?.id === patientId);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientId: patient?.id,
        patientName: patient?.name,
        phone: patient?.phone,
        email: patient?.email
      }));
      setIsNewPatient(false);
    }
  };

  const handleTreatmentSelect = (treatmentId) => {
    const treatment = treatments?.find(t => t?.id === treatmentId);
    if (treatment) {
      setFormData(prev => ({
        ...prev,
        treatment: treatment?.name,
        duration: treatment?.duration?.toString()
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.patientName?.trim()) {
      newErrors.patientName = 'El nombre del paciente es requerido';
    }
    if (!formData?.phone?.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    if (!formData?.date) {
      newErrors.date = 'La fecha es requerida';
    }
    if (!formData?.time) {
      newErrors.time = 'La hora es requerida';
    }
    if (!formData?.treatment?.trim()) {
      newErrors.treatment = 'El tratamiento es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
      onDelete(selectedAppointment?.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'cancelled': return 'text-error';
      case 'completed': return 'text-muted-foreground';
      default: return 'text-primary';
    }
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold">
          {selectedAppointment ? 'Editar Cita' : 'Nueva Cita'}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          iconName="X"
          iconSize={20}
          onClick={onClose}
        />
      </div>
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Patient Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Paciente</label>
            <Button
              variant="ghost"
              size="xs"
              iconName="Plus"
              iconSize={14}
              onClick={() => setIsNewPatient(!isNewPatient)}
            >
              {isNewPatient ? 'Seleccionar' : 'Nuevo'}
            </Button>
          </div>
          
          {!isNewPatient ? (
            <Select
              options={patientOptions}
              value={formData?.patientId}
              onChange={handlePatientSelect}
              placeholder="Buscar paciente..."
              searchable
              error={errors?.patientName}
            />
          ) : (
            <div className="space-y-3">
              <Input
                label="Nombre completo"
                value={formData?.patientName}
                onChange={(e) => handleInputChange('patientName', e?.target?.value)}
                error={errors?.patientName}
                required
              />
              <Input
                label="Teléfono"
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
              />
            </div>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Fecha"
            type="date"
            value={formData?.date}
            onChange={(e) => handleInputChange('date', e?.target?.value)}
            error={errors?.date}
            required
          />
          <Input
            label="Hora"
            type="time"
            value={formData?.time}
            onChange={(e) => handleInputChange('time', e?.target?.value)}
            error={errors?.time}
            required
          />
        </div>

        {/* Treatment and Duration */}
        <div className="space-y-3">
          <Select
            label="Tratamiento"
            options={treatmentOptions}
            value={formData?.treatment}
            onChange={handleTreatmentSelect}
            placeholder="Seleccionar tratamiento..."
            searchable
            error={errors?.treatment}
            required
          />
          <Select
            label="Duración"
            options={durationOptions}
            value={formData?.duration}
            onChange={(value) => handleInputChange('duration', value)}
          />
        </div>

        {/* Status */}
        <Select
          label="Estado"
          options={statusOptions}
          value={formData?.status}
          onChange={(value) => handleInputChange('status', value)}
        />

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Notas</label>
          <textarea
            className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-ring focus:border-transparent"
            rows={3}
            value={formData?.notes}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            placeholder="Notas adicionales..."
          />
        </div>

        {/* Reminder Settings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recordatorios</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData?.reminderWhatsApp}
                onChange={(e) => handleInputChange('reminderWhatsApp', e?.target?.checked)}
                className="rounded border-border"
              />
              <div className="flex items-center space-x-2">
                <Icon name="MessageCircle" size={16} color="var(--color-success)" />
                <span className="text-sm">WhatsApp</span>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData?.reminderSMS}
                onChange={(e) => handleInputChange('reminderSMS', e?.target?.checked)}
                className="rounded border-border"
              />
              <div className="flex items-center space-x-2">
                <Icon name="Smartphone" size={16} color="var(--color-primary)" />
                <span className="text-sm">SMS</span>
              </div>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData?.reminderEmail}
                onChange={(e) => handleInputChange('reminderEmail', e?.target?.checked)}
                className="rounded border-border"
              />
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} color="var(--color-secondary)" />
                <span className="text-sm">Email</span>
              </div>
            </label>
          </div>
        </div>

        {/* Patient Quick Info */}
        {selectedAppointment && (
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <h4 className="text-sm font-medium">Información del Paciente</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={14} />
                <span>{formData?.phone}</span>
              </div>
              {formData?.email && (
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={14} />
                  <span>{formData?.email}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={14} />
                <span>Última visita: 15/08/2024</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="default"
          fullWidth
          onClick={handleSave}
          iconName="Save"
          iconPosition="left"
          iconSize={16}
        >
          {selectedAppointment ? 'Actualizar Cita' : 'Crear Cita'}
        </Button>
        
        {selectedAppointment && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => console.log('Send reminder')}
              iconName="Bell"
              iconPosition="left"
              iconSize={14}
            >
              Recordatorio
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              iconName="Trash2"
              iconPosition="left"
              iconSize={14}
            >
              Eliminar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSidebar;