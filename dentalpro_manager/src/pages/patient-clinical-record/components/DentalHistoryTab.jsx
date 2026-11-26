import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const DentalHistoryTab = ({ dentalHistory, onUpdateDentalHistory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    previousTreatments: dentalHistory?.previousTreatments || [],
    dentalConcerns: dentalHistory?.dentalConcerns || [],
    oralHygiene: dentalHistory?.oralHygiene || {},
    dentalHabits: dentalHistory?.dentalHabits || {},
    previousDentist: dentalHistory?.previousDentist || {},
    painHistory: dentalHistory?.painHistory || {},
    orthodonticHistory: dentalHistory?.orthodonticHistory || {}
  });

  const treatmentTypes = [
    'Limpieza dental', 'Empastes', 'Endodoncia', 'Extracción', 'Corona',
    'Puente', 'Implante', 'Ortodoncia', 'Blanqueamiento', 'Cirugía oral'
  ];

  const dentalConcernsList = [
    'Dolor dental', 'Sensibilidad', 'Sangrado de encías', 'Mal aliento',
    'Dientes flojos', 'Manchas en dientes', 'Dientes torcidos', 'Bruxismo',
    'Sequedad bucal', 'Úlceras bucales'
  ];

  const brushingFrequency = [
    { value: '1', label: '1 vez al día' },
    { value: '2', label: '2 veces al día' },
    { value: '3', label: '3 veces al día' },
    { value: 'irregular', label: 'Irregular' }
  ];

  const flossingFrequency = [
    { value: 'daily', label: 'Diariamente' },
    { value: 'weekly', label: 'Semanalmente' },
    { value: 'monthly', label: 'Mensualmente' },
    { value: 'rarely', label: 'Raramente' },
    { value: 'never', label: 'Nunca' }
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
    onUpdateDentalHistory(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      previousTreatments: dentalHistory?.previousTreatments || [],
      dentalConcerns: dentalHistory?.dentalConcerns || [],
      oralHygiene: dentalHistory?.oralHygiene || {},
      dentalHabits: dentalHistory?.dentalHabits || {},
      previousDentist: dentalHistory?.previousDentist || {},
      painHistory: dentalHistory?.painHistory || {},
      orthodonticHistory: dentalHistory?.orthodonticHistory || {}
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Smile" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Historia Dental</h3>
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
        {/* Previous Treatments */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Wrench" size={16} color="var(--color-primary)" className="mr-2" />
            Tratamientos Previos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {treatmentTypes?.map((treatment) => (
              <Checkbox
                key={treatment}
                label={treatment}
                checked={formData?.previousTreatments?.includes(treatment)}
                onChange={(e) => handleArrayChange('previousTreatments', treatment, e?.target?.checked)}
                disabled={!isEditing}
              />
            ))}
          </div>
        </div>

        {/* Current Dental Concerns */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="AlertCircle" size={16} color="var(--color-warning)" className="mr-2" />
            Preocupaciones Dentales Actuales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dentalConcernsList?.map((concern) => (
              <Checkbox
                key={concern}
                label={concern}
                checked={formData?.dentalConcerns?.includes(concern)}
                onChange={(e) => handleArrayChange('dentalConcerns', concern, e?.target?.checked)}
                disabled={!isEditing}
              />
            ))}
          </div>
        </div>

        {/* Oral Hygiene Habits */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Sparkles" size={16} color="var(--color-primary)" className="mr-2" />
            Hábitos de Higiene Oral
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Select
                label="Frecuencia de Cepillado"
                options={brushingFrequency}
                value={formData?.oralHygiene?.brushingFrequency}
                onChange={(value) => handleNestedChange('oralHygiene', 'brushingFrequency', value)}
                disabled={!isEditing}
              />
              <Select
                label="Uso de Hilo Dental"
                options={flossingFrequency}
                value={formData?.oralHygiene?.flossingFrequency}
                onChange={(value) => handleNestedChange('oralHygiene', 'flossingFrequency', value)}
                disabled={!isEditing}
              />
              <Input
                label="Tipo de Cepillo"
                type="text"
                placeholder="Manual, eléctrico, etc."
                value={formData?.oralHygiene?.toothbrushType || ''}
                onChange={(e) => handleNestedChange('oralHygiene', 'toothbrushType', e?.target?.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-4">
              <Checkbox
                label="Usa enjuague bucal"
                checked={formData?.oralHygiene?.usesMouthwash || false}
                onChange={(e) => handleNestedChange('oralHygiene', 'usesMouthwash', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Usa irrigador dental"
                checked={formData?.oralHygiene?.usesWaterFlosser || false}
                onChange={(e) => handleNestedChange('oralHygiene', 'usesWaterFlosser', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Input
                label="Última limpieza dental"
                type="date"
                value={formData?.oralHygiene?.lastCleaning || ''}
                onChange={(e) => handleNestedChange('oralHygiene', 'lastCleaning', e?.target?.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Dental Habits */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Zap" size={16} color="var(--color-warning)" className="mr-2" />
            Hábitos Dentales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Checkbox
                label="Rechina los dientes (Bruxismo)"
                checked={formData?.dentalHabits?.bruxism || false}
                onChange={(e) => handleNestedChange('dentalHabits', 'bruxism', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Se muerde las uñas"
                checked={formData?.dentalHabits?.nailBiting || false}
                onChange={(e) => handleNestedChange('dentalHabits', 'nailBiting', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Mastica hielo"
                checked={formData?.dentalHabits?.iceChewing || false}
                onChange={(e) => handleNestedChange('dentalHabits', 'iceChewing', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-3">
              <Checkbox
                label="Usa los dientes como herramientas"
                checked={formData?.dentalHabits?.teethAsTools || false}
                onChange={(e) => handleNestedChange('dentalHabits', 'teethAsTools', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Respira por la boca"
                checked={formData?.dentalHabits?.mouthBreathing || false}
                onChange={(e) => handleNestedChange('dentalHabits', 'mouthBreathing', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Usa protector nocturno"
                checked={formData?.dentalHabits?.nightGuard || false}
                onChange={(e) => handleNestedChange('dentalHabits', 'nightGuard', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Pain History */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="Zap" size={16} color="var(--color-error)" className="mr-2" />
            Historia de Dolor
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Dolor dental actual"
              checked={formData?.painHistory?.currentPain || false}
              onChange={(e) => handleNestedChange('painHistory', 'currentPain', e?.target?.checked)}
              disabled={!isEditing}
            />
            <Input
              label="Ubicación del dolor"
              type="text"
              placeholder="Ej: Molar superior derecho"
              value={formData?.painHistory?.location || ''}
              onChange={(e) => handleNestedChange('painHistory', 'location', e?.target?.value)}
              disabled={!isEditing || !formData?.painHistory?.currentPain}
            />
            <Input
              label="Intensidad (1-10)"
              type="number"
              min="1"
              max="10"
              value={formData?.painHistory?.intensity || ''}
              onChange={(e) => handleNestedChange('painHistory', 'intensity', e?.target?.value)}
              disabled={!isEditing || !formData?.painHistory?.currentPain}
            />
            <Input
              label="Duración del dolor"
              type="text"
              placeholder="Ej: 3 días"
              value={formData?.painHistory?.duration || ''}
              onChange={(e) => handleNestedChange('painHistory', 'duration', e?.target?.value)}
              disabled={!isEditing || !formData?.painHistory?.currentPain}
            />
          </div>
        </div>

        {/* Previous Dentist Information */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
            <Icon name="UserCheck" size={16} color="var(--color-primary)" className="mr-2" />
            Dentista Anterior
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del dentista"
              type="text"
              value={formData?.previousDentist?.name || ''}
              onChange={(e) => handleNestedChange('previousDentist', 'name', e?.target?.value)}
              disabled={!isEditing}
            />
            <Input
              label="Clínica/Consultorio"
              type="text"
              value={formData?.previousDentist?.clinic || ''}
              onChange={(e) => handleNestedChange('previousDentist', 'clinic', e?.target?.value)}
              disabled={!isEditing}
            />
            <Input
              label="Última visita"
              type="date"
              value={formData?.previousDentist?.lastVisit || ''}
              onChange={(e) => handleNestedChange('previousDentist', 'lastVisit', e?.target?.value)}
              disabled={!isEditing}
            />
            <Input
              label="Motivo de cambio"
              type="text"
              placeholder="Opcional"
              value={formData?.previousDentist?.reasonForChange || ''}
              onChange={(e) => handleNestedChange('previousDentist', 'reasonForChange', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalHistoryTab;