import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PersonalDataTab from './components/PersonalDataTab';
import MedicalHistoryTab from './components/MedicalHistoryTab';
import DentalHistoryTab from './components/DentalHistoryTab';
import ClinicalExaminationsTab from './components/ClinicalExaminationsTab';
import TreatmentPlansTab from './components/TreatmentPlansTab';
import ClinicalImagesTab from './components/ClinicalImagesTab';
import DocumentActionsPanel from './components/DocumentActionsPanel';

const PatientClinicalRecord = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [patientData, setPatientData] = useState({
    personal: {
      id: 'P-2024-001',
      firstName: 'María Elena',
      lastName: 'González Rodríguez',
      email: 'maria.gonzalez@email.com',
      phone: '+52 55 1234 5678',
      birthDate: '1985-03-15',
      gender: 'femenino',
      address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
      city: 'Ciudad de México',
      state: 'cdmx',
      postalCode: '03100',
      occupation: 'Ingeniera de Software',
      emergencyContactName: 'Carlos González',
      emergencyContactPhone: '+52 55 9876 5432',
      emergencyContactRelation: 'conyuge',
      insuranceProvider: 'Seguros Monterrey',
      insuranceNumber: 'SM-789456123'
    },
    medicalHistory: {
      allergies: ['Penicilina', 'Látex'],
      medications: [
        { name: 'Losartán', dose: '50mg', frequency: '1 vez al día' },
        { name: 'Metformina', dose: '500mg', frequency: '2 veces al día' }
      ],
      medicalConditions: ['Hipertensión', 'Diabetes'],
      surgeries: [],
      familyHistory: ['Diabetes', 'Hipertensión', 'Cardiopatía'],
      habits: {
        smoking: false,
        alcohol: true,
        exercise: true,
        cigarettesPerDay: 0,
        drinksPerWeek: 2
      },
      vitalSigns: {
        bloodPressure: '130/85',
        heartRate: '78',
        temperature: '36.5',
        weight: '65'
      }
    },
    dentalHistory: {
      previousTreatments: ['Limpieza dental', 'Empastes', 'Endodoncia'],
      dentalConcerns: ['Sensibilidad', 'Sangrado de encías'],
      oralHygiene: {
        brushingFrequency: '2',
        flossingFrequency: 'weekly',
        toothbrushType: 'Eléctrico',
        usesMouthwash: true,
        usesWaterFlosser: false,
        lastCleaning: '2023-12-15'
      },
      dentalHabits: {
        bruxism: true,
        nailBiting: false,
        iceChewing: false,
        teethAsTools: false,
        mouthBreathing: false,
        nightGuard: true
      },
      painHistory: {
        currentPain: false,
        location: '',
        intensity: '',
        duration: ''
      },
      previousDentist: {
        name: 'Dr. Martínez',
        clinic: 'Clínica Dental San Ángel',
        lastVisit: '2023-11-20',
        reasonForChange: 'Cambio de domicilio'
      }
    },
    examinations: {
      examinations: [
        {
          id: 1,
          date: '2024-01-08',
          examiner: 'Dr. García',
          findings: 'Caries en molar superior derecho, inflamación gingival leve en sector anterior',
          diagnosis: 'Caries dental grado II en pieza 16, gingivitis marginal',
          notes: 'Paciente refiere sensibilidad al frío. Recomendar tratamiento inmediato.',
          images: []
        }
      ],
      dentalChart: {
        16: 'caries',
        11: 'filling',
        21: 'filling',
        26: 'crown',
        36: 'root_canal',
        46: 'missing'
      }
    },
    treatmentPlans: {
      currentPlans: [
        {
          id: 1,
          type: 'root_canal',
          description: 'Tratamiento de endodoncia en molar superior derecho',
          tooth: '16',
          priority: 'high',
          status: 'planned',
          estimatedCost: 3500,
          estimatedSessions: 3,
          startDate: '2024-01-15',
          completionDate: '',
          notes: 'Paciente presenta dolor intermitente. Programar cita urgente.',
          progress: 0
        },
        {
          id: 2,
          type: 'cleaning',
          description: 'Limpieza dental profunda y pulido',
          tooth: 'arcada completa',
          priority: 'medium',
          status: 'planned',
          estimatedCost: 800,
          estimatedSessions: 1,
          startDate: '2024-01-22',
          completionDate: '',
          notes: 'Incluir aplicación de flúor',
          progress: 0
        }
      ],
      completedTreatments: [
        {
          id: 3,
          type: 'filling',
          description: 'Empaste de resina en incisivo central',
          tooth: '11',
          priority: 'medium',
          status: 'completed',
          estimatedCost: 1200,
          estimatedSessions: 1,
          startDate: '2023-12-10',
          completionDate: '2023-12-10',
          notes: 'Tratamiento completado sin complicaciones',
          progress: 100
        }
      ]
    },
    clinicalImages: []
  });

  const tabs = [
    {
      id: 'personal',
      label: 'Datos Personales',
      icon: 'User',
      component: PersonalDataTab
    },
    {
      id: 'medical',
      label: 'Historia Médica',
      icon: 'Heart',
      component: MedicalHistoryTab
    },
    {
      id: 'dental',
      label: 'Historia Dental',
      icon: 'Smile',
      component: DentalHistoryTab
    },
    {
      id: 'examinations',
      label: 'Exámenes Clínicos',
      icon: 'Search',
      component: ClinicalExaminationsTab
    },
    {
      id: 'treatments',
      label: 'Planes de Tratamiento',
      icon: 'ClipboardList',
      component: TreatmentPlansTab
    },
    {
      id: 'images',
      label: 'Imágenes Clínicas',
      icon: 'Camera',
      component: ClinicalImagesTab
    }
  ];

  const handleUpdatePatientData = (section, data) => {
    setPatientData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleGenerateDocument = (documentType, patient) => {
    console.log(`Generating ${documentType} for patient:`, patient);
    // In a real application, this would trigger PDF generation
  };

  const getTabNotificationCount = (tabId) => {
    switch (tabId) {
      case 'treatments':
        return patientData?.treatmentPlans?.currentPlans?.filter(t => t?.priority === 'urgent' || t?.priority === 'high')?.length;
      case 'examinations':
        return patientData?.examinations?.examinations?.filter(e => 
          new Date(e.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        )?.length;
      default:
        return 0;
    }
  };

  const renderActiveTab = () => {
    const activeTabConfig = tabs?.find(tab => tab?.id === activeTab);
    if (!activeTabConfig) return null;

    const Component = activeTabConfig?.component;
    const props = {
      [activeTab === 'personal' ? 'patient' : activeTab === 'medical' ? 'medicalHistory' : 
        activeTab === 'dental' ? 'dentalHistory' : activeTab === 'examinations' ? 'examinations' :
        activeTab === 'treatments' ? 'treatmentPlans' : 'images']: patientData?.[activeTab === 'personal' ? 'personal' : 
        activeTab === 'medical' ? 'medicalHistory' : activeTab === 'dental' ? 'dentalHistory' : 
        activeTab === 'examinations' ? 'examinations' : activeTab === 'treatments' ? 'treatmentPlans' : 'clinicalImages'],
      [`onUpdate${activeTab === 'personal' ? 'Patient' : activeTab === 'medical' ? 'MedicalHistory' : 
        activeTab === 'dental' ? 'DentalHistory' : activeTab === 'examinations' ? 'Examinations' :
        activeTab === 'treatments' ? 'TreatmentPlans' : 'Images'}`]: (data) => handleUpdatePatientData(
        activeTab === 'personal' ? 'personal' : activeTab === 'medical' ? 'medicalHistory' : 
        activeTab === 'dental' ? 'dentalHistory' : activeTab === 'examinations' ? 'examinations' :
        activeTab === 'treatments' ? 'treatmentPlans' : 'clinicalImages', data)
    };

    return <Component {...props} />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border clinical-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history?.back()}
                iconName="ArrowLeft"
                iconSize={20}
              />
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Expediente Clínico
                </h1>
                <p className="text-sm text-muted-foreground">
                  {patientData?.personal?.firstName} {patientData?.personal?.lastName} • ID: {patientData?.personal?.id}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Calendar" size={16} />
                <span>Última actualización: {new Date()?.toLocaleDateString('es-MX')}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/patient-management'}
                iconName="Users"
                iconPosition="left"
                iconSize={16}
              >
                Ver Pacientes
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Patient Summary Card */}
            <div className="bg-card rounded-lg border border-border clinical-shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={24} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {patientData?.personal?.firstName} {patientData?.personal?.lastName}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>{new Date()?.getFullYear() - new Date(patientData.personal.birthDate)?.getFullYear()} años</span>
                      <span>•</span>
                      <span>{patientData?.personal?.phone}</span>
                      <span>•</span>
                      <span>{patientData?.personal?.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">Próxima Cita</div>
                    <div className="text-sm text-muted-foreground">15 Ene 2024, 10:00 AM</div>
                  </div>
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-card rounded-lg border border-border clinical-shadow">
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs?.map((tab) => {
                    const notificationCount = getTabNotificationCount(tab?.id);
                    return (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                          activeTab === tab?.id
                            ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                        }`}
                      >
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.label}</span>
                        {notificationCount > 0 && (
                          <span className="bg-error text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                            {notificationCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderActiveTab()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DocumentActionsPanel 
              patient={patientData?.personal}
              onGenerateDocument={handleGenerateDocument}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientClinicalRecord;