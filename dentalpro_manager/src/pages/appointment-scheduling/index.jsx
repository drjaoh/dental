import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CalendarView from './components/CalendarView';
import AppointmentSidebar from './components/AppointmentSidebar';
import AppointmentFilters from './components/AppointmentFilters';
import WaitingListPanel from './components/WaitingListPanel';
import AppointmentStats from './components/AppointmentStats';

const AppointmentScheduling = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showWaitingList, setShowWaitingList] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    status: '',
    practitioner: '',
    treatment: '',
    timeRange: '',
    dateRange: { start: '', end: '' }
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const mockAppointments = [
    {
      id: 1,
      patientId: 'P001',
      patientName: 'Ana María González',
      phone: '555-0123',
      email: 'ana.gonzalez@email.com',
      date: '2024-09-08',
      time: '09:00',
      duration: '60',
      treatment: 'Limpieza dental',
      status: 'confirmed',
      notes: 'Primera visita del año',
      price: 800,
      practitioner: 'Dr. García',
      reminderWhatsApp: true,
      reminderSMS: false,
      reminderEmail: true
    },
    {
      id: 2,
      patientId: 'P002',
      patientName: 'Carlos López Martínez',
      phone: '555-0124',
      email: 'carlos.lopez@email.com',
      date: '2024-09-08',
      time: '10:30',
      duration: '45',
      treatment: 'Revisión general',
      status: 'pending',
      notes: 'Paciente con sensibilidad dental',
      price: 600,
      practitioner: 'Dr. García',
      reminderWhatsApp: true,
      reminderSMS: true,
      reminderEmail: true
    },
    {
      id: 3,
      patientId: 'P003',
      patientName: 'María Elena Rodríguez',
      phone: '555-0125',
      email: 'maria.rodriguez@email.com',
      date: '2024-09-09',
      time: '14:00',
      duration: '90',
      treatment: 'Endodoncia',
      status: 'confirmed',
      notes: 'Segunda sesión de tratamiento de conducto',
      price: 2500,
      practitioner: 'Dr. García',
      reminderWhatsApp: true,
      reminderSMS: false,
      reminderEmail: true
    },
    {
      id: 4,
      patientId: 'P004',
      patientName: 'José Antonio Hernández',
      phone: '555-0126',
      email: 'jose.hernandez@email.com',
      date: '2024-09-10',
      time: '11:00',
      duration: '30',
      treatment: 'Consulta de seguimiento',
      status: 'completed',
      notes: 'Revisión post-operatoria',
      price: 400,
      practitioner: 'Dr. García',
      reminderWhatsApp: false,
      reminderSMS: false,
      reminderEmail: true
    },
    {
      id: 5,
      patientId: 'P005',
      patientName: 'Laura Patricia Jiménez',
      phone: '555-0127',
      email: 'laura.jimenez@email.com',
      date: '2024-09-11',
      time: '16:30',
      duration: '60',
      treatment: 'Blanqueamiento dental',
      status: 'cancelled',
      notes: 'Cancelada por el paciente',
      price: 1200,
      practitioner: 'Dr. García',
      reminderWhatsApp: true,
      reminderSMS: true,
      reminderEmail: true
    }
  ];

  const mockPatients = [
    { id: 'P001', name: 'Ana María González', phone: '555-0123', email: 'ana.gonzalez@email.com' },
    { id: 'P002', name: 'Carlos López Martínez', phone: '555-0124', email: 'carlos.lopez@email.com' },
    { id: 'P003', name: 'María Elena Rodríguez', phone: '555-0125', email: 'maria.rodriguez@email.com' },
    { id: 'P004', name: 'José Antonio Hernández', phone: '555-0126', email: 'jose.hernandez@email.com' },
    { id: 'P005', name: 'Laura Patricia Jiménez', phone: '555-0127', email: 'laura.jimenez@email.com' },
    { id: 'P006', name: 'Roberto Sánchez Torres', phone: '555-0128', email: 'roberto.sanchez@email.com' },
    { id: 'P007', name: 'Carmen Delgado Vega', phone: '555-0129', email: 'carmen.delgado@email.com' }
  ];

  const mockTreatments = [
    { id: 'T001', name: 'Limpieza dental', price: 800, duration: 60 },
    { id: 'T002', name: 'Revisión general', price: 600, duration: 45 },
    { id: 'T003', name: 'Endodoncia', price: 2500, duration: 90 },
    { id: 'T004', name: 'Consulta de seguimiento', price: 400, duration: 30 },
    { id: 'T005', name: 'Blanqueamiento dental', price: 1200, duration: 60 },
    { id: 'T006', name: 'Extracción dental', price: 1000, duration: 45 },
    { id: 'T007', name: 'Ortodoncia - Consulta', price: 800, duration: 60 },
    { id: 'T008', name: 'Implante dental', price: 8000, duration: 120 }
  ];

  const mockPractitioners = [
    { id: 'D001', name: 'Dr. María García', specialty: 'Odontología General' },
    { id: 'D002', name: 'Dr. Carlos Mendoza', specialty: 'Endodoncia' },
    { id: 'D003', name: 'Dra. Ana Ruiz', specialty: 'Ortodoncia' }
  ];

  const [waitingList, setWaitingList] = useState([
    {
      id: 1,
      patientName: 'Pedro Ramírez',
      phone: '555-0130',
      email: 'pedro.ramirez@email.com',
      treatment: 'Limpieza dental',
      priority: 'normal',
      dateAdded: '2024-09-05',
      preferredDates: ['2024-09-12', '2024-09-13'],
      preferredTimes: ['morning', 'afternoon'],
      notes: 'Prefiere citas en la mañana',
      status: 'waiting'
    },
    {
      id: 2,
      patientName: 'Isabel Morales',
      phone: '555-0131',
      email: 'isabel.morales@email.com',
      treatment: 'Endodoncia',
      priority: 'high',
      dateAdded: '2024-09-06',
      preferredDates: [],
      preferredTimes: ['afternoon'],
      notes: 'Dolor persistente, necesita atención pronto',
      status: 'waiting'
    }
  ]);

  const [appointments, setAppointments] = useState(mockAppointments);

  // Filter appointments based on active filters and search
  const filteredAppointments = appointments?.filter(appointment => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery?.toLowerCase();
      if (!appointment?.patientName?.toLowerCase()?.includes(searchLower) &&
          !appointment?.treatment?.toLowerCase()?.includes(searchLower) &&
          !appointment?.phone?.includes(searchQuery)) {
        return false;
      }
    }

    // Status filter
    if (activeFilters?.status && appointment?.status !== activeFilters?.status) {
      return false;
    }

    // Practitioner filter
    if (activeFilters?.practitioner && appointment?.practitioner !== activeFilters?.practitioner) {
      return false;
    }

    // Treatment filter
    if (activeFilters?.treatment && appointment?.treatment !== activeFilters?.treatment) {
      return false;
    }

    // Time range filter
    if (activeFilters?.timeRange) {
      const appointmentHour = parseInt(appointment?.time?.split(':')?.[0]);
      switch (activeFilters?.timeRange) {
        case 'morning':
          if (appointmentHour < 8 || appointmentHour >= 12) return false;
          break;
        case 'afternoon':
          if (appointmentHour < 12 || appointmentHour >= 18) return false;
          break;
        case 'evening':
          if (appointmentHour < 18 || appointmentHour >= 20) return false;
          break;
      }
    }

    // Date range filter
    if (activeFilters?.dateRange?.start || activeFilters?.dateRange?.end) {
      const appointmentDate = new Date(appointment.date);
      if (activeFilters?.dateRange?.start) {
        const startDate = new Date(activeFilters.dateRange.start);
        if (appointmentDate < startDate) return false;
      }
      if (activeFilters?.dateRange?.end) {
        const endDate = new Date(activeFilters.dateRange.end);
        if (appointmentDate > endDate) return false;
      }
    }

    return true;
  });

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowSidebar(true);
  };

  const handleTimeSlotClick = (date, time) => {
    const newAppointment = {
      date: date?.toISOString()?.split('T')?.[0],
      time: time,
      status: 'pending'
    };
    setSelectedAppointment(newAppointment);
    setShowSidebar(true);
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setShowSidebar(true);
  };

  const handleSaveAppointment = (appointmentData) => {
    if (selectedAppointment?.id) {
      // Update existing appointment
      setAppointments(prev => prev?.map(apt => 
        apt?.id === selectedAppointment?.id ? { ...apt, ...appointmentData } : apt
      ));
    } else {
      // Create new appointment
      const newAppointment = {
        ...appointmentData,
        id: Date.now(),
        practitioner: 'Dr. García'
      };
      setAppointments(prev => [...prev, newAppointment]);
    }
    setShowSidebar(false);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId) => {
    setAppointments(prev => prev?.filter(apt => apt?.id !== appointmentId));
    setShowSidebar(false);
    setSelectedAppointment(null);
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleAddToWaitingList = (entry) => {
    setWaitingList(prev => [...prev, entry]);
  };

  const handleRemoveFromWaitingList = (entryId) => {
    setWaitingList(prev => prev?.filter(entry => entry?.id !== entryId));
  };

  const handleScheduleFromWaitingList = (entry) => {
    setSelectedAppointment({
      patientName: entry?.patientName,
      phone: entry?.phone,
      email: entry?.email,
      treatment: entry?.treatment,
      notes: entry?.notes,
      status: 'pending'
    });
    setShowSidebar(true);
  };

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowWaitingList(false);
        setShowStats(false);
      } else {
        setShowStats(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              iconName="ArrowLeft"
              iconSize={20}
              onClick={() => navigate('/doctor-dashboard')}
            />
            <div>
              <h1 className="text-lg font-semibold">Citas</h1>
              <p className="text-sm text-muted-foreground">
                {currentDate?.toLocaleDateString('es-MX', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              iconName="BarChart3"
              iconSize={20}
              onClick={() => setShowStats(!showStats)}
            />
            <Button
              variant="ghost"
              size="icon"
              iconName="Clock"
              iconSize={20}
              onClick={() => setShowWaitingList(!showWaitingList)}
            />
            <Button
              variant="default"
              size="icon"
              iconName="Plus"
              iconSize={20}
              onClick={handleNewAppointment}
            />
          </div>
        </div>
      </div>
      {/* Desktop Header */}
      <div className="hidden lg:block bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Programación de Citas</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las citas y horarios de tu consulta dental
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
              onClick={() => console.log('Export calendar')}
            >
              Exportar
            </Button>
            <Button
              variant="outline"
              iconName="Settings"
              iconPosition="left"
              iconSize={16}
              onClick={() => console.log('Calendar settings')}
            >
              Configurar
            </Button>
            <Button
              variant={showWaitingList ? "default" : "outline"}
              iconName="Clock"
              iconPosition="left"
              iconSize={16}
              onClick={() => setShowWaitingList(!showWaitingList)}
            >
              Lista de Espera ({waitingList?.length})
            </Button>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              onClick={handleNewAppointment}
            >
              Nueva Cita
            </Button>
          </div>
        </div>
      </div>
      {/* Stats Panel */}
      {showStats && (
        <AppointmentStats
          appointments={filteredAppointments}
          selectedDate={currentDate}
          viewMode={viewMode}
        />
      )}
      {/* Filters */}
      <AppointmentFilters
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        practitioners={mockPractitioners}
        treatments={mockTreatments}
        activeFilters={activeFilters}
      />
      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)] lg:h-[calc(100vh-300px)]">
        {/* Calendar View */}
        <div className="flex-1 flex flex-col">
          <CalendarView
            currentDate={currentDate}
            viewMode={viewMode}
            appointments={filteredAppointments}
            onDateChange={handleDateChange}
            onViewModeChange={handleViewModeChange}
            onAppointmentClick={handleAppointmentClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        </div>

        {/* Appointment Sidebar */}
        {showSidebar && (
          <AppointmentSidebar
            selectedAppointment={selectedAppointment}
            onClose={() => {
              setShowSidebar(false);
              setSelectedAppointment(null);
            }}
            onSave={handleSaveAppointment}
            onDelete={handleDeleteAppointment}
            patients={mockPatients}
            treatments={mockTreatments}
          />
        )}

        {/* Waiting List Panel */}
        {showWaitingList && (
          <WaitingListPanel
            waitingList={waitingList}
            onAddToWaitingList={handleAddToWaitingList}
            onRemoveFromWaitingList={handleRemoveFromWaitingList}
            onScheduleFromWaitingList={handleScheduleFromWaitingList}
            treatments={mockTreatments}
          />
        )}
      </div>
      {/* Mobile FAB for New Appointment */}
      <div className="lg:hidden fixed bottom-20 right-6 z-50">
        <Button
          variant="default"
          size="lg"
          onClick={handleNewAppointment}
          className="rounded-full w-14 h-14 clinical-shadow-lg"
          iconName="Plus"
          iconSize={24}
        />
      </div>
      {/* Conflict Detection Alert */}
      <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 z-40">
        {/* This would show when there are scheduling conflicts */}
        {false && (
          <div className="bg-warning text-warning-foreground p-4 rounded-lg clinical-shadow-lg border border-warning/20">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Conflicto de Horario</h4>
                <p className="text-sm opacity-90 mt-1">
                  Ya existe una cita programada para este horario
                </p>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="xs">
                    Ver Conflicto
                  </Button>
                  <Button variant="ghost" size="xs">
                    Ignorar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduling;