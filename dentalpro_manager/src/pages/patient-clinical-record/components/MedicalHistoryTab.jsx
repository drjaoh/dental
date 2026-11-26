import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

import { Checkbox } from '../../../components/ui/Checkbox';

const MedicalHistoryTab = ({ medicalHistory, onUpdateMedicalHistory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    allergies: medicalHistory?.allergies || [],
    medications: medicalHistory?.medications || [],
    medicalConditions: medicalHistory?.medicalConditions || [],
    surgeries: medicalHistory?.surgeries || [],
    familyHistory: medicalHistory?.familyHistory || [],
    habits: medicalHistory?.habits || {},
    vitalSigns: medicalHistory?.vitalSigns || {}
  });

  const commonAllergies = [
    'Penicilina', 'Aspirina', 'Látex', 'Anestesia local', 'Ibuprofeno', 
    'Codeine', 'Sulfonamidas', 'Ninguna alergia conocida'
  ];

  const commonConditions = [
    'Diabetes', 'Hipertensión', 'Cardiopatía', 'Asma', 'Artritis', 
    'Osteoporosis', 'Hepatitis', 'VIH/SIDA', 'Cáncer', 'Epilepsia'
  ];

  const familyConditions = [
    'Diabetes', 'Hipertensión', 'Cardiopatía', 'Cáncer', 'Osteoporosis',
    'Enfermedades mentales', 'Enfermedades autoinmunes'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, item, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev?.[field], item]
        : prev?.[field]?.filter(i => i !== item)
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev?.[parent],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onUpdateMedicalHistory(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      allergies: medicalHistory?.allergies || [],
      medications: medicalHistory?.medications || [],
      medicalConditions: medicalHistory?.medicalConditions || [],
      surgeries: medicalHistory?.surgeries || [],
      familyHistory: medicalHistory?.familyHistory || [],
      habits: medicalHistory?.habits || {},
      vitalSigns: medicalHistory?.vitalSigns || {}
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Heart" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Historia Médica</h3>
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
      <div className="p-6 space-y-8">
        {/* Allergies Section */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mr-2" />
            Alergias
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {commonAllergies?.map((allergy) => (
              <Checkbox
                key={allergy}
                label={allergy}
                checked={formData?.allergies?.includes(allergy)}
                onChange={(e) => handleArrayChange('allergies', allergy, e?.target?.checked)}
                disabled={!isEditing}
              />
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Pill" size={16} color="var(--color-primary)" className="mr-2" />
            Medicamentos Actuales
          </h4>
          <div className="space-y-3">
            {formData?.medications?.map((medication, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    label="Medicamento"
                    type="text"
                    value={medication?.name || ''}
                    onChange={(e) => {
                      const newMedications = [...formData?.medications];
                      newMedications[index] = { ...medication, name: e?.target?.value };
                      handleInputChange('medications', newMedications);
                    }}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Dosis"
                    type="text"
                    value={medication?.dose || ''}
                    onChange={(e) => {
                      const newMedications = [...formData?.medications];
                      newMedications[index] = { ...medication, dose: e?.target?.value };
                      handleInputChange('medications', newMedications);
                    }}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Frecuencia"
                    type="text"
                    value={medication?.frequency || ''}
                    onChange={(e) => {
                      const newMedications = [...formData?.medications];
                      newMedications[index] = { ...medication, frequency: e?.target?.value };
                      handleInputChange('medications', newMedications);
                    }}
                    disabled={!isEditing}
                  />
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newMedications = formData?.medications?.filter((_, i) => i !== index);
                      handleInputChange('medications', newMedications);
                    }}
                    iconName="Trash2"
                    iconSize={16}
                    className="text-error hover:text-error"
                  />
                )}
              </div>
            ))}
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newMedications = [...formData?.medications, { name: '', dose: '', frequency: '' }];
                  handleInputChange('medications', newMedications);
                }}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Agregar Medicamento
              </Button>
            )}
          </div>
        </div>

        {/* Medical Conditions */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Activity" size={16} color="var(--color-primary)" className="mr-2" />
            Condiciones Médicas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {commonConditions?.map((condition) => (
              <Checkbox
                key={condition}
                label={condition}
                checked={formData?.medicalConditions?.includes(condition)}
                onChange={(e) => handleArrayChange('medicalConditions', condition, e?.target?.checked)}
                disabled={!isEditing}
              />
            ))}
          </div>
        </div>

        {/* Family History */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Users" size={16} color="var(--color-primary)" className="mr-2" />
            Antecedentes Familiares
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {familyConditions?.map((condition) => (
              <Checkbox
                key={condition}
                label={condition}
                checked={formData?.familyHistory?.includes(condition)}
                onChange={(e) => handleArrayChange('familyHistory', condition, e?.target?.checked)}
                disabled={!isEditing}
              />
            ))}
          </div>
        </div>

        {/* Habits */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Coffee" size={16} color="var(--color-primary)" className="mr-2" />
            Hábitos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Checkbox
                label="Fumador"
                checked={formData?.habits?.smoking || false}
                onChange={(e) => handleNestedChange('habits', 'smoking', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Consumo de Alcohol"
                checked={formData?.habits?.alcohol || false}
                onChange={(e) => handleNestedChange('habits', 'alcohol', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Ejercicio Regular"
                checked={formData?.habits?.exercise || false}
                onChange={(e) => handleNestedChange('habits', 'exercise', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-3">
              <Input
                label="Cigarrillos por día"
                type="number"
                value={formData?.habits?.cigarettesPerDay || ''}
                onChange={(e) => handleNestedChange('habits', 'cigarettesPerDay', e?.target?.value)}
                disabled={!isEditing || !formData?.habits?.smoking}
              />
              <Input
                label="Bebidas por semana"
                type="number"
                value={formData?.habits?.drinksPerWeek || ''}
                onChange={(e) => handleNestedChange('habits', 'drinksPerWeek', e?.target?.value)}
                disabled={!isEditing || !formData?.habits?.alcohol}
              />
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Thermometer" size={16} color="var(--color-primary)" className="mr-2" />
            Signos Vitales (Última Consulta)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Presión Arterial"
              type="text"
              placeholder="120/80"
              value={formData?.vitalSigns?.bloodPressure || ''}
              onChange={(e) => handleNestedChange('vitalSigns', 'bloodPressure', e?.target?.value)}
              disabled={!isEditing}
            />
            <Input
              label="Frecuencia Cardíaca"
              type="number"
              placeholder="72"
              value={formData?.vitalSigns?.heartRate || ''}
              onChange={(e) => handleNestedChange('vitalSigns', 'heartRate', e?.target?.value)}
              disabled={!isEditing}
            />
            <Input
              label="Temperatura (°C)"
              type="number"
              step="0.1"
              placeholder="36.5"
              value={formData?.vitalSigns?.temperature || ''}
              onChange={(e) => handleNestedChange('vitalSigns', 'temperature', e?.target?.value)}
              disabled={!isEditing}
            />
            <Input
              label="Peso (kg)"
              type="number"
              placeholder="70"
              value={formData?.vitalSigns?.weight || ''}
              onChange={(e) => handleNestedChange('vitalSigns', 'weight', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryTab;