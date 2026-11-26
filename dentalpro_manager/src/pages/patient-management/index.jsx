import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PatientTable from './components/PatientTable';
import PatientModal from './components/PatientModal';
import PatientStats from './components/PatientStats';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import Button from '../../components/ui/Button';


const PatientManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingPatient, setIsAddingPatient] = useState(false);

  // Mock patient data
  const [patients, setPatients] = useState([
    {
      id: 1,
      patientId: 'PAC-001',
      name: 'Ana Martínez López',
      phone: '555-0123',
      email: 'ana.martinez@email.com',
      birthDate: '1985-03-15',
      address: 'Av. Reforma 123, Col. Centro, CDMX',
      emergencyContact: 'Juan Martínez - 555-0124',
      lastVisit: '15/11/2024',
      status: 'active',
      balance: 2900,
      medicalHistory: `Paciente con historial de hipertensión controlada con medicamento.\nSin alergias conocidas a medicamentos dentales.\nÚltima limpieza dental hace 6 meses.`,
      allergies: 'Ninguna conocida',
      medications: 'Losartán 50mg - 1 vez al día'
    },
    {
      id: 2,
      patientId: 'PAC-002',
      name: 'Carlos López Hernández',
      phone: '555-0125',
      email: 'carlos.lopez@email.com',
      birthDate: '1978-07-22',
      address: 'Calle Juárez 456, Col. Roma Norte, CDMX',
      emergencyContact: 'María López - 555-0126',
      lastVisit: '22/10/2024',
      status: 'active',
      balance: 0,
      medicalHistory: `Paciente diabético tipo 2, controlado con dieta y ejercicio.\nHistorial de gingivitis, mejorado con tratamiento periodontal.\nSensibilidad dental en molares superiores.`,
      allergies: 'Penicilina',
      medications: 'Metformina 850mg - 2 veces al día'
    },
    {
      id: 3,
      patientId: 'PAC-003',
      name: 'María González Ruiz',
      phone: '555-0127',
      email: 'maria.gonzalez@email.com',
      birthDate: '1992-12-08',
      address: 'Insurgentes Sur 789, Col. Del Valle, CDMX',
      emergencyContact: 'Pedro González - 555-0128',
      lastVisit: '08/11/2024',
      status: 'active',
      balance: 1200,
      medicalHistory: `Paciente joven sin antecedentes médicos relevantes.\nOrtodoncia previa completada hace 3 años.\nBuena higiene oral, visitas regulares de mantenimiento.`,
      allergies: 'Látex',
      medications: 'Ninguno'
    },
    {
      id: 4,
      patientId: 'PAC-004',
      name: 'Roberto Silva Mendoza',
      phone: '555-0129',
      email: 'roberto.silva@email.com',
      birthDate: '1965-05-30',
      address: 'Av. Universidad 321, Col. Copilco, CDMX',
      emergencyContact: 'Carmen Silva - 555-0130',
      lastVisit: '01/11/2024',
      status: 'inactive',
      balance: 0,
      medicalHistory: `Paciente con enfermedad periodontal avanzada.\nHistorial de tabaquismo (dejó hace 2 años).\nVarias extracciones y implantes realizados.`,
      allergies: 'Ibuprofeno',
      medications: 'Atorvastatina 20mg - 1 vez al día'
    },
    {
      id: 5,
      patientId: 'PAC-005',
      name: 'Laura Hernández Castro',
      phone: '555-0131',
      email: 'laura.hernandez@email.com',
      birthDate: '1988-09-14',
      address: 'Calz. de Tlalpan 654, Col. Portales, CDMX',
      emergencyContact: 'Miguel Hernández - 555-0132',
      lastVisit: '25/10/2024',
      status: 'pending',
      balance: 800,
      medicalHistory: `Embarazo actual (segundo trimestre).\nGingivitis del embarazo en tratamiento.\nSin complicaciones dentales previas.`,
      allergies: 'Ninguna conocida',
      medications: 'Ácido fólico, Vitaminas prenatales'
    }
  ]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setIsAddingPatient(false);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsAddingPatient(false);
    setIsModalOpen(true);
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsAddingPatient(true);
    setIsModalOpen(true);
  };

  const handleScheduleAppointment = (patient) => {
    navigate('/appointment-scheduling', { state: { selectedPatient: patient } });
  };

  const handleSavePatient = (patientData) => {
    if (isAddingPatient) {
      const newPatient = {
        ...patientData,
        id: patients?.length + 1,
        patientId: `PAC-${String(patients?.length + 1)?.padStart(3, '0')}`,
        lastVisit: 'Nuevo',
        balance: 0
      };
      setPatients([...patients, newPatient]);
    } else {
      setPatients(patients?.map(p => 
        p?.id === selectedPatient?.id ? { ...p, ...patientData } : p
      ));
    }
  };

  const handleBulkExport = () => {
    // Mock export functionality
    console.log('Exporting patient data...');
    alert('Exportando datos de pacientes...');
  };

  const handleSendReminders = () => {
    // Mock reminder functionality
    console.log('Sending appointment reminders...');
    alert('Enviando recordatorios de citas...');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
    setIsAddingPatient(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
      
      <main className={`transition-all duration-200 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-16 pb-20 lg:pb-6`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestión de Pacientes</h1>
              <p className="text-muted-foreground">
                Administra la información y historial clínico de tus pacientes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                iconName="FileText"
                iconPosition="left"
                iconSize={16}
                onClick={() => navigate('/patient-clinical-record')}
              >
                Historial Clínico
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="UserPlus"
                iconPosition="left"
                iconSize={16}
                onClick={handleAddPatient}
              >
                Nuevo Paciente
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <PatientStats patients={patients} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Patient Table - Takes 3 columns on desktop */}
            <div className="lg:col-span-3">
              <PatientTable
                patients={patients}
                onPatientSelect={handlePatientSelect}
                onEditPatient={handleEditPatient}
                onScheduleAppointment={handleScheduleAppointment}
              />
            </div>

            {/* Sidebar Content - Takes 1 column on desktop */}
            <div className="space-y-6">
              <QuickActions
                onAddPatient={handleAddPatient}
                onBulkExport={handleBulkExport}
                onSendReminders={handleSendReminders}
              />
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>

      {/* Patient Modal */}
      <PatientModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePatient}
      />
    </div>
  );
};

export default PatientManagement;