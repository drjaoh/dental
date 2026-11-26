import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PatientModal = ({ patient, isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    patientId: patient?.patientId || '',
    phone: patient?.phone || '',
    email: patient?.email || '',
    birthDate: patient?.birthDate || '',
    address: patient?.address || '',
    emergencyContact: patient?.emergencyContact || '',
    medicalHistory: patient?.medicalHistory || '',
    allergies: patient?.allergies || '',
    medications: patient?.medications || '',
    status: patient?.status || 'active'
  });

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'pending', label: 'Pendiente' }
  ];

  const tabs = [
    { id: 'general', label: 'Información General', icon: 'User' },
    { id: 'medical', label: 'Historial Médico', icon: 'FileText' },
    { id: 'treatments', label: 'Tratamientos', icon: 'Activity' },
    { id: 'payments', label: 'Pagos', icon: 'CreditCard' }
  ];

  const treatments = [
    {
      id: 1,
      date: '15/11/2024',
      treatment: 'Limpieza Dental',
      doctor: 'Dr. García',
      status: 'Completado',
      cost: 800
    },
    {
      id: 2,
      date: '22/10/2024',
      treatment: 'Empaste Composite',
      doctor: 'Dr. García',
      status: 'Completado',
      cost: 1200
    },
    {
      id: 3,
      date: '10/12/2024',
      treatment: 'Corona Dental',
      doctor: 'Dr. García',
      status: 'Programado',
      cost: 3500
    }
  ];

  const payments = [
    {
      id: 1,
      date: '15/11/2024',
      amount: 800,
      method: 'Efectivo',
      concept: 'Limpieza Dental',
      status: 'Pagado'
    },
    {
      id: 2,
      date: '22/10/2024',
      amount: 600,
      method: 'Tarjeta',
      concept: 'Anticipo Corona',
      status: 'Pagado'
    },
    {
      id: 3,
      date: '10/12/2024',
      amount: 2900,
      method: 'Pendiente',
      concept: 'Saldo Corona',
      status: 'Pendiente'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre Completo"
          type="text"
          value={formData?.name}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          required
        />
        <Input
          label="ID Paciente"
          type="text"
          value={formData?.patientId}
          onChange={(e) => handleInputChange('patientId', e?.target?.value)}
          required
        />
        <Input
          label="Teléfono"
          type="tel"
          value={formData?.phone}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
        />
        <Input
          label="Fecha de Nacimiento"
          type="date"
          value={formData?.birthDate}
          onChange={(e) => handleInputChange('birthDate', e?.target?.value)}
        />
        <Select
          label="Estado"
          options={statusOptions}
          value={formData?.status}
          onChange={(value) => handleInputChange('status', value)}
        />
      </div>
      <Input
        label="Dirección"
        type="text"
        value={formData?.address}
        onChange={(e) => handleInputChange('address', e?.target?.value)}
      />
      <Input
        label="Contacto de Emergencia"
        type="text"
        value={formData?.emergencyContact}
        onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
        description="Nombre y teléfono del contacto de emergencia"
      />
    </div>
  );

  const renderMedicalTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Historial Médico
        </label>
        <textarea
          className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData?.medicalHistory}
          onChange={(e) => handleInputChange('medicalHistory', e?.target?.value)}
          placeholder="Describe el historial médico del paciente..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Alergias
        </label>
        <textarea
          className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData?.allergies}
          onChange={(e) => handleInputChange('allergies', e?.target?.value)}
          placeholder="Lista de alergias conocidas..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Medicamentos Actuales
        </label>
        <textarea
          className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={formData?.medications}
          onChange={(e) => handleInputChange('medications', e?.target?.value)}
          placeholder="Medicamentos que toma actualmente..."
        />
      </div>
    </div>
  );

  const renderTreatmentsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-foreground">Historial de Tratamientos</h4>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Nuevo Tratamiento
        </Button>
      </div>
      <div className="space-y-3">
        {treatments?.map((treatment) => (
          <div key={treatment?.id} className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Activity" size={16} color="var(--color-primary)" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground">{treatment?.treatment}</h5>
                  <p className="text-xs text-muted-foreground">{treatment?.date} - {treatment?.doctor}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  ${treatment?.cost?.toLocaleString('es-MX')} MXN
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  treatment?.status === 'Completado' 
                    ? 'bg-success/10 text-success' :'bg-warning/10 text-warning'
                }`}>
                  {treatment?.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-foreground">Historial de Pagos</h4>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Registrar Pago
        </Button>
      </div>
      <div className="space-y-3">
        {payments?.map((payment) => (
          <div key={payment?.id} className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="CreditCard" size={16} color="var(--color-primary)" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground">{payment?.concept}</h5>
                  <p className="text-xs text-muted-foreground">{payment?.date} - {payment?.method}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  ${payment?.amount?.toLocaleString('es-MX')} MXN
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  payment?.status === 'Pagado' 
                    ? 'bg-success/10 text-success' :'bg-error/10 text-error'
                }`}>
                  {payment?.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-200 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border clinical-shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {patient ? `Editar Paciente` : 'Nuevo Paciente'}
              </h2>
              {patient && (
                <p className="text-sm text-muted-foreground">{patient?.name} - {patient?.patientId}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-clinical ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                {tab?.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'medical' && renderMedicalTab()}
          {activeTab === 'treatments' && renderTreatmentsTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;