import React, { useState, useEffect, useMemo } from 'react';
import MetricsCard from './components/MetricsCard';
import AppointmentTimeline from './components/AppointmentTimeline';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import PaymentAlerts from './components/PaymentAlerts';
import TreatmentReminders from './components/TreatmentReminders';
import AttendancePatterns from './components/AttendancePatterns';
import { generateVisitHistory } from './data/visitHistory';

const DoctorDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Historial de visitas para el análisis mensual de asistencia
  const visitHistory = useMemo(() => generateVisitHistory(new Date(), 12), []);

  // Mock data for dashboard metrics
  const metricsData = [
    {
      title: "Citas de Hoy",
      value: "8",
      subtitle: "2 pendientes",
      icon: "Calendar",
      trend: "up",
      trendValue: "+12%",
      color: "primary"
    },
    {
      title: "Tratamientos Pendientes",
      value: "15",
      subtitle: "3 urgentes",
      icon: "Stethoscope",
      trend: "down",
      trendValue: "-5%",
      color: "warning"
    },
    {
      title: "Pagos Pendientes",
      value: "$24,500",
      subtitle: "MXN",
      icon: "CreditCard",
      trend: "up",
      trendValue: "+8%",
      color: "error"
    },
    {
      title: "Ingresos del Mes",
      value: "$185,750",
      subtitle: "MXN",
      icon: "TrendingUp",
      trend: "up",
      trendValue: "+15%",
      color: "success"
    }
  ];

  // Mock appointments data
  const appointmentsData = [
    {
      id: 1,
      time: "09:00",
      duration: "60 min",
      patientName: "María González Hernández",
      treatment: "Limpieza dental y revisión general",
      status: "confirmada",
      phone: "555-0123",
      notes: "Primera visita, paciente nerviosa"
    },
    {
      id: 2,
      time: "10:30",
      duration: "45 min",
      patientName: "Carlos Rodríguez López",
      treatment: "Extracción de muela del juicio",
      status: "confirmada",
      phone: "555-0124",
      notes: "Traer radiografías previas"
    },
    {
      id: 3,
      time: "12:00",
      duration: "30 min",
      patientName: "Ana Martínez Sánchez",
      treatment: "Control post-operatorio",
      status: "pendiente",
      phone: "555-0125",
      notes: "Revisar cicatrización"
    },
    {
      id: 4,
      time: "14:00",
      duration: "90 min",
      patientName: "José Luis Fernández",
      treatment: "Colocación de corona dental",
      status: "confirmada",
      phone: "555-0126",
      notes: "Corona ya lista en laboratorio"
    },
    {
      id: 5,
      time: "16:00",
      duration: "60 min",
      patientName: "Laura Jiménez Torres",
      treatment: "Ortodoncia - Ajuste de brackets",
      status: "completada",
      phone: "555-0127",
      notes: "Paciente regular, muy puntual"
    }
  ];

  // Mock recent activity data
  const recentActivityData = [
    {
      id: 1,
      type: "payment",
      title: "Pago recibido",
      description: "Tratamiento de conducto completado",
      patient: "María González",
      amount: 3500,
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      actionable: true
    },
    {
      id: 2,
      type: "appointment",
      title: "Cita reagendada",
      description: "Limpieza dental movida para mañana",
      patient: "Carlos López",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      actionable: true
    },
    {
      id: 3,
      type: "treatment",
      title: "Tratamiento completado",
      description: "Extracción de muela del juicio",
      patient: "Ana Martínez",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      actionable: false
    },
    {
      id: 4,
      type: "document",
      title: "Documento generado",
      description: "Presupuesto de ortodoncia enviado",
      patient: "José Fernández",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      actionable: true
    },
    {
      id: 5,
      type: "patient",
      title: "Nuevo paciente registrado",
      description: "Laura Jiménez - Primera consulta",
      patient: "Laura Jiménez",
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      actionable: true
    }
  ];

  // Mock payment alerts data
  const paymentAlertsData = [
    {
      id: 1,
      type: "overdue",
      patientName: "Roberto Méndez",
      treatment: "Implante dental",
      amount: 8500,
      dueDate: "2025-01-05",
      phone: "555-0128"
    },
    {
      id: 2,
      type: "due_today",
      patientName: "Carmen Ruiz",
      treatment: "Ortodoncia - Pago mensual",
      amount: 2200,
      dueDate: "2025-01-08",
      phone: "555-0129"
    },
    {
      id: 3,
      type: "due_soon",
      patientName: "Miguel Ángel Torres",
      treatment: "Blanqueamiento dental",
      amount: 1800,
      dueDate: "2025-01-10",
      phone: "555-0130"
    }
  ];

  // Mock treatment reminders data
  const treatmentRemindersData = [
    {
      id: 1,
      type: "follow_up",
      patientName: "Elena Vásquez",
      patientId: "patient-001",
      description: "Revisión post-extracción de muela",
      dueDate: "2025-01-09",
      priority: "high",
      treatment: "Extracción dental"
    },
    {
      id: 2,
      type: "next_appointment",
      patientName: "Fernando Castro",
      patientId: "patient-002",
      description: "Segunda sesión de tratamiento de conducto",
      dueDate: "2025-01-10",
      priority: "medium",
      treatment: "Endodoncia"
    },
    {
      id: 3,
      type: "lab_results",
      patientName: "Patricia Morales",
      patientId: "patient-003",
      description: "Revisar resultados de radiografías panorámicas",
      dueDate: "2025-01-11",
      priority: "low",
      treatment: "Diagnóstico"
    }
  ];

  useEffect(() => {
    // Update current date every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleMetricClick = (metric) => {
    // Navigate based on metric type
    switch (metric?.title) {
      case "Citas de Hoy":
        window.location.href = '/appointment-scheduling';
        break;
      case "Tratamientos Pendientes":
        window.location.href = '/patient-clinical-record';
        break;
      case "Pagos Pendientes": case"Ingresos del Mes":
        window.location.href = '/financial-management';
        break;
      default:
        break;
    }
  };

  const handleAppointmentClick = (appointment) => {
    // Navigate to patient record
    window.location.href = `/patient-management/${appointment?.id}`;
  };

  const handleQuickAction = (action) => {
    window.location.href = action?.route;
  };

  const handleViewAllActivity = () => {
    // Could open a modal or navigate to activity log
    console.log('View all activity clicked');
  };

  const handleViewFinances = () => {
    window.location.href = '/financial-management';
  };

  const handleContactPatient = (alert) => {
    const message = `Hola ${alert?.patientName}, le recordamos que tiene un pago pendiente de $${alert?.amount?.toLocaleString('es-MX')} MXN por su tratamiento de ${alert?.treatment}. ¿Podríamos coordinar el pago? Gracias.`;
    const whatsappUrl = `https://wa.me/52${alert?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewPatient = (patientId) => {
    window.location.href = `/patient-management/${patientId}`;
  };

  const handleMarkReminderComplete = (reminderId) => {
    // In a real app, this would update the backend
    console.log(`Marking reminder ${reminderId} as complete`);
  };

  const handleRescheduleAppointment = (appointment) => {
    // In a real app, this would open a rescheduling modal
    console.log('Reschedule appointment:', appointment);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="lg:ml-60 pt-16 lg:pt-0">
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Panel de Control
            </h1>
            <p className="text-muted-foreground">
              Bienvenido, Dr. García. Aquí tienes un resumen de tu práctica dental.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentDate?.toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} • {currentDate?.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                subtitle={metric?.subtitle}
                icon={metric?.icon}
                trend={metric?.trend}
                trendValue={metric?.trendValue}
                color={metric?.color}
                onClick={() => handleMetricClick(metric)}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Appointments Timeline */}
            <div className="lg:col-span-2">
              <AppointmentTimeline
                appointments={appointmentsData}
                onAppointmentClick={handleAppointmentClick}
                onReschedule={handleRescheduleAppointment}
              />
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-6">
              <RecentActivity
                activities={recentActivityData}
                onViewAll={handleViewAllActivity}
              />
            </div>
          </div>

          {/* Monthly Attendance Patterns */}
          <AttendancePatterns visits={visitHistory} />

          {/* Bottom Section - Alerts and Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Alerts */}
            <PaymentAlerts
              alerts={paymentAlertsData}
              onViewFinances={handleViewFinances}
              onContactPatient={handleContactPatient}
            />

            {/* Treatment Reminders */}
            <TreatmentReminders
              reminders={treatmentRemindersData}
              onViewPatient={handleViewPatient}
              onMarkComplete={handleMarkReminderComplete}
            />
          </div>
        </div>
      </div>
      {/* Mobile Bottom Padding */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default DoctorDashboard;