import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TreatmentCostEstimator = () => {
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const treatmentCatalog = [
    {
      id: 1,
      category: "Preventiva",
      name: "Limpieza Dental",
      description: "Profilaxis dental completa con fluorización",
      basePrice: 450.00,
      duration: "45 min",
      icon: "Sparkles"
    },
    {
      id: 2,
      category: "Preventiva",
      name: "Consulta General",
      description: "Examen clínico y diagnóstico inicial",
      basePrice: 350.00,
      duration: "30 min",
      icon: "Stethoscope"
    },
    {
      id: 3,
      category: "Restaurativa",
      name: "Resina Compuesta",
      description: "Restauración con resina fotopolimerizable",
      basePrice: 650.00,
      duration: "60 min",
      icon: "Wrench"
    },
    {
      id: 4,
      category: "Restaurativa",
      name: "Corona Dental",
      description: "Corona de porcelana o metal-porcelana",
      basePrice: 2800.00,
      duration: "90 min",
      icon: "Crown"
    },
    {
      id: 5,
      category: "Cirugía",
      name: "Extracción Simple",
      description: "Extracción dental simple con anestesia local",
      basePrice: 450.00,
      duration: "30 min",
      icon: "Scissors"
    },
    {
      id: 6,
      category: "Cirugía",
      name: "Implante Dental",
      description: "Implante de titanio con corona",
      basePrice: 8500.00,
      duration: "120 min",
      icon: "Zap"
    },
    {
      id: 7,
      category: "Ortodoncia",
      name: "Brackets Metálicos",
      description: "Tratamiento completo de ortodoncia",
      basePrice: 15000.00,
      duration: "24 meses",
      icon: "Grid3x3"
    },
    {
      id: 8,
      category: "Endodoncia",
      name: "Tratamiento de Conducto",
      description: "Endodoncia completa con obturación",
      basePrice: 1800.00,
      duration: "90 min",
      icon: "Activity"
    }
  ];

  const paymentPlans = [
    { id: 1, name: "Pago Único", discount: 5, description: "5% descuento por pago completo" },
    { id: 2, name: "3 Meses", discount: 0, description: "Sin intereses" },
    { id: 3, name: "6 Meses", discount: -3, description: "3% interés" },
    { id: 4, name: "12 Meses", discount: -8, description: "8% interés" }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    })?.format(amount);
  };

  const handleTreatmentToggle = (treatment) => {
    setSelectedTreatments(prev => {
      const exists = prev?.find(t => t?.id === treatment?.id);
      if (exists) {
        return prev?.filter(t => t?.id !== treatment?.id);
      } else {
        return [...prev, { ...treatment, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (treatmentId, quantity) => {
    setSelectedTreatments(prev =>
      prev?.map(t => t?.id === treatmentId ? { ...t, quantity: Math.max(1, quantity) } : t)
    );
  };

  const calculateSubtotal = () => {
    return selectedTreatments?.reduce((sum, treatment) => 
      sum + (treatment?.basePrice * treatment?.quantity), 0
    );
  };

  const calculateDiscount = () => {
    return calculateSubtotal() * (discountPercentage / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const generateQuotation = () => {
    console.log('Generating quotation for:', {
      patient: patientInfo,
      treatments: selectedTreatments,
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      total: calculateTotal()
    });
  };

  const categories = [...new Set(treatmentCatalog.map(t => t.category))];

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <div className="bg-card border border-border rounded-lg clinical-shadow">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Información del Paciente</h3>
          <p className="text-sm text-muted-foreground">Datos para la cotización</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Nombre Completo"
              type="text"
              placeholder="Nombre del paciente"
              value={patientInfo?.name}
              onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e?.target?.value }))}
            />
            <Input
              label="Teléfono"
              type="tel"
              placeholder="555-000-0000"
              value={patientInfo?.phone}
              onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e?.target?.value }))}
            />
            <Input
              label="Email"
              type="email"
              placeholder="paciente@email.com"
              value={patientInfo?.email}
              onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e?.target?.value }))}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Treatment Catalog */}
        <div className="lg:col-span-2 space-y-6">
          {categories?.map(category => (
            <div key={category} className="bg-card border border-border rounded-lg clinical-shadow">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                <p className="text-sm text-muted-foreground">Selecciona los tratamientos necesarios</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {treatmentCatalog?.filter(treatment => treatment?.category === category)?.map(treatment => {
                      const isSelected = selectedTreatments?.find(t => t?.id === treatment?.id);
                      return (
                        <div
                          key={treatment?.id}
                          className={`p-4 rounded-lg border transition-clinical cursor-pointer ${
                            isSelected 
                              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleTreatmentToggle(treatment)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                            }`}>
                              <Icon name={treatment?.icon} size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-foreground">{treatment?.name}</h4>
                                <span className="text-sm font-semibold text-primary">
                                  {formatCurrency(treatment?.basePrice)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{treatment?.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  <Icon name="Clock" size={12} className="inline mr-1" />
                                  {treatment?.duration}
                                </span>
                                {isSelected && (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-muted-foreground">Cantidad:</span>
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={(e) => {
                                          e?.stopPropagation();
                                          handleQuantityChange(treatment?.id, isSelected?.quantity - 1);
                                        }}
                                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted"
                                      >
                                        <Icon name="Minus" size={12} />
                                      </button>
                                      <span className="w-8 text-center text-sm font-medium">
                                        {isSelected?.quantity}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e?.stopPropagation();
                                          handleQuantityChange(treatment?.id, isSelected?.quantity + 1);
                                        }}
                                        className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted"
                                      >
                                        <Icon name="Plus" size={12} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quotation Summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg clinical-shadow sticky top-6">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Resumen de Cotización</h3>
              <p className="text-sm text-muted-foreground">
                {selectedTreatments?.length} tratamiento(s) seleccionado(s)
              </p>
            </div>
            <div className="p-6 space-y-4">
              {selectedTreatments?.length > 0 ? (
                <>
                  {selectedTreatments?.map(treatment => (
                    <div key={treatment?.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm">{treatment?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(treatment?.basePrice)} × {treatment?.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {formatCurrency(treatment?.basePrice * treatment?.quantity)}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        label="Descuento (%)"
                        type="number"
                        placeholder="0"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(Number(e?.target?.value))}
                        className="flex-1"
                      />
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="text-foreground">{formatCurrency(calculateSubtotal())}</span>
                      </div>
                      {discountPercentage > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Descuento ({discountPercentage}%):</span>
                          <span className="text-success">-{formatCurrency(calculateDiscount())}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                        <span className="text-foreground">Total:</span>
                        <span className="text-primary">{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Icon name="Calculator" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Selecciona tratamientos para generar cotización</p>
                </div>
              )}
            </div>
            
            {selectedTreatments?.length > 0 && (
              <div className="p-6 border-t border-border space-y-3">
                <Button 
                  variant="default" 
                  fullWidth 
                  iconName="FileText" 
                  iconPosition="left"
                  onClick={generateQuotation}
                >
                  Generar Cotización PDF
                </Button>
                <Button variant="outline" fullWidth iconName="Send" iconPosition="left">
                  Enviar por Email
                </Button>
              </div>
            )}
          </div>

          {/* Payment Plans */}
          {selectedTreatments?.length > 0 && (
            <div className="bg-card border border-border rounded-lg clinical-shadow">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Planes de Pago</h3>
                <p className="text-sm text-muted-foreground">Opciones de financiamiento</p>
              </div>
              <div className="p-6 space-y-3">
                {paymentPlans?.map(plan => {
                  const totalWithPlan = calculateTotal() * (1 + plan?.discount / 100);
                  const monthlyPayment = plan?.name === "Pago Único" ? totalWithPlan : totalWithPlan / parseInt(plan?.name);
                  
                  return (
                    <div key={plan?.id} className="p-3 rounded-lg border border-border hover:border-primary/50 transition-clinical">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{plan?.name}</h4>
                          <p className="text-xs text-muted-foreground">{plan?.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-foreground">
                            {formatCurrency(totalWithPlan)}
                          </div>
                          {plan?.name !== "Pago Único" && (
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(monthlyPayment)}/mes
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatmentCostEstimator;