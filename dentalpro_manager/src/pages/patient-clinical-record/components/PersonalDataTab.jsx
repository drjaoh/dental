import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PersonalDataTab = ({ patient, onUpdatePatient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    birthDate: patient?.birthDate || '',
    gender: patient?.gender || '',
    address: patient?.address || '',
    city: patient?.city || '',
    state: patient?.state || '',
    postalCode: patient?.postalCode || '',
    occupation: patient?.occupation || '',
    emergencyContactName: patient?.emergencyContactName || '',
    emergencyContactPhone: patient?.emergencyContactPhone || '',
    emergencyContactRelation: patient?.emergencyContactRelation || '',
    insuranceProvider: patient?.insuranceProvider || '',
    insuranceNumber: patient?.insuranceNumber || ''
  });

  const genderOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' }
  ];

  const stateOptions = [
    { value: 'cdmx', label: 'Ciudad de México' },
    { value: 'jalisco', label: 'Jalisco' },
    { value: 'nuevo-leon', label: 'Nuevo León' },
    { value: 'puebla', label: 'Puebla' },
    { value: 'guanajuato', label: 'Guanajuato' }
  ];

  const relationOptions = [
    { value: 'padre', label: 'Padre' },
    { value: 'madre', label: 'Madre' },
    { value: 'conyuge', label: 'Cónyuge' },
    { value: 'hermano', label: 'Hermano/a' },
    { value: 'hijo', label: 'Hijo/a' },
    { value: 'otro', label: 'Otro' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onUpdatePatient(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: patient?.firstName || '',
      lastName: patient?.lastName || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      birthDate: patient?.birthDate || '',
      gender: patient?.gender || '',
      address: patient?.address || '',
      city: patient?.city || '',
      state: patient?.state || '',
      postalCode: patient?.postalCode || '',
      occupation: patient?.occupation || '',
      emergencyContactName: patient?.emergencyContactName || '',
      emergencyContactPhone: patient?.emergencyContactPhone || '',
      emergencyContactRelation: patient?.emergencyContactRelation || '',
      insuranceProvider: patient?.insuranceProvider || '',
      insuranceNumber: patient?.insuranceNumber || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="User" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Datos Personales</h3>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                iconName="Check"
                iconPosition="left"
                iconSize={16}
              >
                Guardar
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
              iconSize={16}
            >
              Editar
            </Button>
          )}
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Información Básica</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              type="text"
              value={formData?.firstName}
              onChange={(e) => handleInputChange('firstName', e?.target?.value)}
              disabled={!isEditing}
              required
            />
            <Input
              label="Apellidos"
              type="text"
              value={formData?.lastName}
              onChange={(e) => handleInputChange('lastName', e?.target?.value)}
              disabled={!isEditing}
              required
            />
            <Input
              label="Correo Electrónico"
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              disabled={!isEditing}
            />
            <Input
              label="Teléfono"
              type="tel"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              disabled={!isEditing}
              required
            />
            <Input
              label="Fecha de Nacimiento"
              type="date"
              value={formData?.birthDate}
              onChange={(e) => handleInputChange('birthDate', e?.target?.value)}
              disabled={!isEditing}
              required
            />
            <Select
              label="Género"
              options={genderOptions}
              value={formData?.gender}
              onChange={(value) => handleInputChange('gender', value)}
              disabled={!isEditing}
              required
            />
            <Input
              label="Ocupación"
              type="text"
              value={formData?.occupation}
              onChange={(e) => handleInputChange('occupation', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Dirección</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Dirección"
                type="text"
                value={formData?.address}
                onChange={(e) => handleInputChange('address', e?.target?.value)}
                disabled={!isEditing}
              />
            </div>
            <Input
              label="Ciudad"
              type="text"
              value={formData?.city}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              disabled={!isEditing}
            />
            <Select
              label="Estado"
              options={stateOptions}
              value={formData?.state}
              onChange={(value) => handleInputChange('state', value)}
              disabled={!isEditing}
            />
            <Input
              label="Código Postal"
              type="text"
              value={formData?.postalCode}
              onChange={(e) => handleInputChange('postalCode', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Contacto de Emergencia</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre Completo"
              type="text"
              value={formData?.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e?.target?.value)}
              disabled={!isEditing}
              required
            />
            <Input
              label="Teléfono"
              type="tel"
              value={formData?.emergencyContactPhone}
              onChange={(e) => handleInputChange('emergencyContactPhone', e?.target?.value)}
              disabled={!isEditing}
              required
            />
            <Select
              label="Parentesco"
              options={relationOptions}
              value={formData?.emergencyContactRelation}
              onChange={(value) => handleInputChange('emergencyContactRelation', value)}
              disabled={!isEditing}
              required
            />
          </div>
        </div>

        {/* Insurance Information */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">Información del Seguro</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Proveedor de Seguro"
              type="text"
              value={formData?.insuranceProvider}
              onChange={(e) => handleInputChange('insuranceProvider', e?.target?.value)}
              disabled={!isEditing}
            />
            <Input
              label="Número de Póliza"
              type="text"
              value={formData?.insuranceNumber}
              onChange={(e) => handleInputChange('insuranceNumber', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDataTab;