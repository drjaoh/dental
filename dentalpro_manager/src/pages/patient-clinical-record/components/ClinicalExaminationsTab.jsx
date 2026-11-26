import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const ClinicalExaminationsTab = ({ examinations, onUpdateExaminations }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [formData, setFormData] = useState({
    examinations: examinations || [],
    dentalChart: examinations?.dentalChart || {}
  });

  // Dental chart layout - adult teeth numbering (1-32)
  const upperTeeth = [
    [1, 2, 3, 4, 5, 6, 7, 8], // Upper right
    [9, 10, 11, 12, 13, 14, 15, 16] // Upper left
  ];
  
  const lowerTeeth = [
    [32, 31, 30, 29, 28, 27, 26, 25], // Lower right
    [24, 23, 22, 21, 20, 19, 18, 17] // Lower left
  ];

  const toothConditions = [
    { value: 'healthy', label: 'Sano', color: 'bg-success' },
    { value: 'caries', label: 'Caries', color: 'bg-error' },
    { value: 'filling', label: 'Empaste', color: 'bg-primary' },
    { value: 'crown', label: 'Corona', color: 'bg-warning' },
    { value: 'missing', label: 'Ausente', color: 'bg-muted' },
    { value: 'root_canal', label: 'Endodoncia', color: 'bg-secondary' },
    { value: 'implant', label: 'Implante', color: 'bg-accent' }
  ];

  const getToothCondition = (toothNumber) => {
    return formData?.dentalChart?.[toothNumber] || 'healthy';
  };

  const getConditionColor = (condition) => {
    const conditionObj = toothConditions?.find(c => c?.value === condition);
    return conditionObj ? conditionObj?.color : 'bg-muted';
  };

  const handleToothClick = (toothNumber) => {
    if (isEditing) {
      setSelectedTooth(toothNumber);
    }
  };

  const handleToothConditionChange = (condition) => {
    if (selectedTooth) {
      setFormData(prev => ({
        ...prev,
        dentalChart: {
          ...prev?.dentalChart,
          [selectedTooth]: condition
        }
      }));
      setSelectedTooth(null);
    }
  };

  const addNewExamination = () => {
    const newExamination = {
      id: Date.now(),
      date: new Date()?.toISOString()?.split('T')?.[0],
      examiner: 'Dr. García',
      findings: '',
      diagnosis: '',
      notes: '',
      images: []
    };
    
    setFormData(prev => ({
      ...prev,
      examinations: [newExamination, ...prev?.examinations]
    }));
  };

  const updateExamination = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      examinations: prev?.examinations?.map(exam => 
        exam?.id === id ? { ...exam, [field]: value } : exam
      )
    }));
  };

  const deleteExamination = (id) => {
    setFormData(prev => ({
      ...prev,
      examinations: prev?.examinations?.filter(exam => exam?.id !== id)
    }));
  };

  const handleSave = () => {
    onUpdateExaminations(formData);
    setIsEditing(false);
    setSelectedTooth(null);
  };

  const handleCancel = () => {
    setFormData({
      examinations: examinations || [],
      dentalChart: examinations?.dentalChart || {}
    });
    setIsEditing(false);
    setSelectedTooth(null);
  };

  const ToothComponent = ({ number, condition, onClick }) => (
    <div
      className={`w-8 h-8 rounded border-2 border-border cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-medium ${
        getConditionColor(condition)
      } ${selectedTooth === number ? 'ring-2 ring-primary' : ''} ${
        isEditing ? 'hover:scale-110' : ''
      }`}
      onClick={() => onClick(number)}
      title={`Diente ${number} - ${toothConditions?.find(c => c?.value === condition)?.label || 'Sano'}`}
    >
      {number}
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Search" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Exámenes Clínicos</h3>
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
        {/* Dental Chart */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-md font-medium text-foreground flex items-center">
              <Icon name="Grid3x3" size={16} color="var(--color-primary)" className="mr-2" />
              Odontograma
            </h4>
            {selectedTooth && (
              <div className="text-sm text-muted-foreground">
                Diente seleccionado: {selectedTooth}
              </div>
            )}
          </div>

          {/* Dental Chart Visualization */}
          <div className="bg-muted/30 p-6 rounded-lg">
            {/* Upper Teeth */}
            <div className="mb-8">
              <div className="text-center text-sm text-muted-foreground mb-2">Arcada Superior</div>
              <div className="flex justify-center space-x-8">
                {/* Upper Right */}
                <div className="flex space-x-1">
                  {upperTeeth?.[0]?.map(tooth => (
                    <ToothComponent
                      key={tooth}
                      number={tooth}
                      condition={getToothCondition(tooth)}
                      onClick={handleToothClick}
                    />
                  ))}
                </div>
                {/* Upper Left */}
                <div className="flex space-x-1">
                  {upperTeeth?.[1]?.map(tooth => (
                    <ToothComponent
                      key={tooth}
                      number={tooth}
                      condition={getToothCondition(tooth)}
                      onClick={handleToothClick}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Lower Teeth */}
            <div>
              <div className="flex justify-center space-x-8">
                {/* Lower Right */}
                <div className="flex space-x-1">
                  {lowerTeeth?.[0]?.map(tooth => (
                    <ToothComponent
                      key={tooth}
                      number={tooth}
                      condition={getToothCondition(tooth)}
                      onClick={handleToothClick}
                    />
                  ))}
                </div>
                {/* Lower Left */}
                <div className="flex space-x-1">
                  {lowerTeeth?.[1]?.map(tooth => (
                    <ToothComponent
                      key={tooth}
                      number={tooth}
                      condition={getToothCondition(tooth)}
                      onClick={handleToothClick}
                    />
                  ))}
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-2">Arcada Inferior</div>
            </div>
          </div>

          {/* Tooth Condition Legend */}
          <div className="mt-4">
            <div className="text-sm font-medium text-foreground mb-2">Leyenda:</div>
            <div className="flex flex-wrap gap-3">
              {toothConditions?.map(condition => (
                <div key={condition?.value} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${condition?.color}`}></div>
                  <span className="text-sm text-muted-foreground">{condition?.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tooth Condition Selector */}
          {selectedTooth && isEditing && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-sm font-medium text-foreground mb-3">
                Seleccionar condición para el diente {selectedTooth}:
              </div>
              <div className="flex flex-wrap gap-2">
                {toothConditions?.map(condition => (
                  <Button
                    key={condition?.value}
                    variant={getToothCondition(selectedTooth) === condition?.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToothConditionChange(condition?.value)}
                  >
                    {condition?.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Examination Records */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-md font-medium text-foreground flex items-center">
              <Icon name="FileText" size={16} color="var(--color-primary)" className="mr-2" />
              Registros de Examen
            </h4>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={addNewExamination}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Nuevo Examen
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {formData?.examinations?.map((examination) => (
              <div key={examination?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Calendar" size={16} color="var(--color-primary)" />
                    <span className="font-medium text-foreground">
                      Examen del {new Date(examination.date)?.toLocaleDateString('es-MX')}
                    </span>
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExamination(examination?.id)}
                      iconName="Trash2"
                      iconSize={16}
                      className="text-error hover:text-error"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Fecha del Examen"
                    type="date"
                    value={examination?.date}
                    onChange={(e) => updateExamination(examination?.id, 'date', e?.target?.value)}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Examinador"
                    type="text"
                    value={examination?.examiner}
                    onChange={(e) => updateExamination(examination?.id, 'examiner', e?.target?.value)}
                    disabled={!isEditing}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Hallazgos Clínicos"
                      type="text"
                      value={examination?.findings}
                      onChange={(e) => updateExamination(examination?.id, 'findings', e?.target?.value)}
                      disabled={!isEditing}
                      placeholder="Describe los hallazgos del examen..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Diagnóstico"
                      type="text"
                      value={examination?.diagnosis}
                      onChange={(e) => updateExamination(examination?.id, 'diagnosis', e?.target?.value)}
                      disabled={!isEditing}
                      placeholder="Diagnóstico basado en los hallazgos..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Notas Adicionales"
                      type="text"
                      value={examination?.notes}
                      onChange={(e) => updateExamination(examination?.id, 'notes', e?.target?.value)}
                      disabled={!isEditing}
                      placeholder="Observaciones adicionales..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData?.examinations?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay registros de exámenes clínicos</p>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addNewExamination}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                    className="mt-4"
                  >
                    Agregar Primer Examen
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalExaminationsTab;