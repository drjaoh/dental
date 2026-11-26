import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TreatmentPlansTab = ({ treatmentPlans, onUpdateTreatmentPlans }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    currentPlans: treatmentPlans?.currentPlans || [],
    completedTreatments: treatmentPlans?.completedTreatments || []
  });

  const treatmentTypes = [
    { value: 'cleaning', label: 'Limpieza Dental', basePrice: 800 },
    { value: 'filling', label: 'Empaste', basePrice: 1200 },
    { value: 'root_canal', label: 'Endodoncia', basePrice: 3500 },
    { value: 'crown', label: 'Corona', basePrice: 4500 },
    { value: 'extraction', label: 'Extracción', basePrice: 1500 },
    { value: 'implant', label: 'Implante', basePrice: 15000 },
    { value: 'orthodontics', label: 'Ortodoncia', basePrice: 25000 },
    { value: 'whitening', label: 'Blanqueamiento', basePrice: 2500 },
    { value: 'bridge', label: 'Puente', basePrice: 8000 },
    { value: 'denture', label: 'Prótesis', basePrice: 12000 }
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Urgente' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' }
  ];

  const statusOptions = [
    { value: 'planned', label: 'Planificado' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planned': return 'bg-muted text-muted-foreground';
      case 'in_progress': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-success/10 text-success';
      case 'cancelled': return 'bg-error/10 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const addNewTreatment = () => {
    const newTreatment = {
      id: Date.now(),
      type: '',
      description: '',
      tooth: '',
      priority: 'medium',
      status: 'planned',
      estimatedCost: 0,
      estimatedSessions: 1,
      startDate: '',
      completionDate: '',
      notes: '',
      progress: 0
    };
    
    setFormData(prev => ({
      ...prev,
      currentPlans: [newTreatment, ...prev?.currentPlans]
    }));
  };

  const updateTreatment = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      currentPlans: prev?.currentPlans?.map(treatment => {
        if (treatment?.id === id) {
          const updated = { ...treatment, [field]: value };
          
          // Auto-update estimated cost based on treatment type
          if (field === 'type') {
            const treatmentType = treatmentTypes?.find(t => t?.value === value);
            if (treatmentType) {
              updated.estimatedCost = treatmentType?.basePrice;
            }
          }
          
          return updated;
        }
        return treatment;
      })
    }));
  };

  const deleteTreatment = (id) => {
    setFormData(prev => ({
      ...prev,
      currentPlans: prev?.currentPlans?.filter(treatment => treatment?.id !== id)
    }));
  };

  const markAsCompleted = (id) => {
    const treatment = formData?.currentPlans?.find(t => t?.id === id);
    if (treatment) {
      const completedTreatment = {
        ...treatment,
        status: 'completed',
        completionDate: new Date()?.toISOString()?.split('T')?.[0],
        progress: 100
      };
      
      setFormData(prev => ({
        ...prev,
        currentPlans: prev?.currentPlans?.filter(t => t?.id !== id),
        completedTreatments: [completedTreatment, ...prev?.completedTreatments]
      }));
    }
  };

  const handleSave = () => {
    onUpdateTreatmentPlans(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      currentPlans: treatmentPlans?.currentPlans || [],
      completedTreatments: treatmentPlans?.completedTreatments || []
    });
    setIsEditing(false);
  };

  const getTotalEstimatedCost = () => {
    return formData?.currentPlans?.reduce((total, treatment) => total + (treatment?.estimatedCost || 0), 0);
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="ClipboardList" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Planes de Tratamiento</h3>
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
        {/* Treatment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} color="var(--color-primary)" />
              <span className="text-sm font-medium text-primary">Tratamientos Pendientes</span>
            </div>
            <div className="text-2xl font-bold text-primary">{formData?.currentPlans?.length}</div>
          </div>
          
          <div className="bg-success/10 p-4 rounded-lg border border-success/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              <span className="text-sm font-medium text-success">Completados</span>
            </div>
            <div className="text-2xl font-bold text-success">{formData?.completedTreatments?.length}</div>
          </div>
          
          <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="DollarSign" size={16} color="var(--color-warning)" />
              <span className="text-sm font-medium text-warning">Costo Estimado</span>
            </div>
            <div className="text-2xl font-bold text-warning">
              ${getTotalEstimatedCost()?.toLocaleString('es-MX')}
            </div>
          </div>
        </div>

        {/* Current Treatment Plans */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-md font-medium text-foreground flex items-center">
              <Icon name="Calendar" size={16} color="var(--color-primary)" className="mr-2" />
              Tratamientos Actuales
            </h4>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={addNewTreatment}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Nuevo Tratamiento
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {formData?.currentPlans?.map((treatment) => (
              <div key={treatment?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(treatment?.status)}`}>
                      {statusOptions?.find(s => s?.value === treatment?.status)?.label || 'Planificado'}
                    </div>
                    <div className={`text-sm font-medium ${getPriorityColor(treatment?.priority)}`}>
                      {priorityOptions?.find(p => p?.value === treatment?.priority)?.label || 'Media'}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsCompleted(treatment?.id)}
                        iconName="Check"
                        iconSize={16}
                        className="text-success hover:text-success"
                      >
                        Completar
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTreatment(treatment?.id)}
                        iconName="Trash2"
                        iconSize={16}
                        className="text-error hover:text-error"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Select
                    label="Tipo de Tratamiento"
                    options={treatmentTypes}
                    value={treatment?.type}
                    onChange={(value) => updateTreatment(treatment?.id, 'type', value)}
                    disabled={!isEditing}
                    required
                  />
                  <Input
                    label="Diente/Zona"
                    type="text"
                    value={treatment?.tooth}
                    onChange={(e) => updateTreatment(treatment?.id, 'tooth', e?.target?.value)}
                    disabled={!isEditing}
                    placeholder="Ej: 16, 21-22"
                  />
                  <Select
                    label="Prioridad"
                    options={priorityOptions}
                    value={treatment?.priority}
                    onChange={(value) => updateTreatment(treatment?.id, 'priority', value)}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Costo Estimado (MXN)"
                    type="number"
                    value={treatment?.estimatedCost}
                    onChange={(e) => updateTreatment(treatment?.id, 'estimatedCost', parseFloat(e?.target?.value) || 0)}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Sesiones Estimadas"
                    type="number"
                    value={treatment?.estimatedSessions}
                    onChange={(e) => updateTreatment(treatment?.id, 'estimatedSessions', parseInt(e?.target?.value) || 1)}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Fecha de Inicio"
                    type="date"
                    value={treatment?.startDate}
                    onChange={(e) => updateTreatment(treatment?.id, 'startDate', e?.target?.value)}
                    disabled={!isEditing}
                  />
                  <div className="md:col-span-2 lg:col-span-3">
                    <Input
                      label="Descripción del Tratamiento"
                      type="text"
                      value={treatment?.description}
                      onChange={(e) => updateTreatment(treatment?.id, 'description', e?.target?.value)}
                      disabled={!isEditing}
                      placeholder="Describe el tratamiento a realizar..."
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Input
                      label="Notas Adicionales"
                      type="text"
                      value={treatment?.notes}
                      onChange={(e) => updateTreatment(treatment?.id, 'notes', e?.target?.value)}
                      disabled={!isEditing}
                      placeholder="Observaciones, consideraciones especiales..."
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                {treatment?.status === 'in_progress' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Progreso</span>
                      <span className="text-sm text-muted-foreground">{treatment?.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${treatment?.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {formData?.currentPlans?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="ClipboardList" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay planes de tratamiento activos</p>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addNewTreatment}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                    className="mt-4"
                  >
                    Crear Primer Plan
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Completed Treatments */}
        {formData?.completedTreatments?.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" className="mr-2" />
              Tratamientos Completados
            </h4>
            <div className="space-y-3">
              {formData?.completedTreatments?.slice(0, 5)?.map((treatment) => (
                <div key={treatment?.id} className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                    <div>
                      <div className="font-medium text-foreground">
                        {treatmentTypes?.find(t => t?.value === treatment?.type)?.label || treatment?.type}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {treatment?.tooth && `Diente ${treatment?.tooth} - `}
                        Completado el {new Date(treatment.completionDate)?.toLocaleDateString('es-MX')}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-success">
                    ${treatment?.estimatedCost?.toLocaleString('es-MX')}
                  </div>
                </div>
              ))}
              {formData?.completedTreatments?.length > 5 && (
                <div className="text-center text-sm text-muted-foreground">
                  Y {formData?.completedTreatments?.length - 5} tratamientos más...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentPlansTab;