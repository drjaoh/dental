import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarView = ({ 
  currentDate, 
  viewMode, 
  appointments, 
  onDateChange, 
  onViewModeChange, 
  onAppointmentClick,
  onTimeSlotClick 
}) => {
  const [draggedAppointment, setDraggedAppointment] = useState(null);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const getDaysInWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek?.setDate(date?.getDate() - date?.getDay() + 1); // Monday start
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day?.setDate(startOfWeek?.getDate() + i);
      days?.push(day);
    }
    return days;
  };

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay() + 1);
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || days?.length < 35) {
      days?.push(new Date(current));
      current?.setDate(current?.getDate() + 1);
    }
    return days;
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return appointments?.filter(apt => apt?.date === dateStr);
  };

  const getAppointmentForTimeSlot = (date, time) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return appointments?.find(apt => apt?.date === dateStr && apt?.time === time);
  };

  const handleDragStart = (e, appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, date, time) => {
    e?.preventDefault();
    if (draggedAppointment) {
      // Handle appointment rescheduling
      console.log('Reschedule appointment:', draggedAppointment?.id, 'to', date, time);
      setDraggedAppointment(null);
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('es-MX', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-error text-error-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  const renderWeekView = () => {
    const weekDays = getDaysInWeek(currentDate);
    
    return (
      <div className="flex flex-col h-full">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-border">
          <div className="p-3 text-sm font-medium text-muted-foreground">Hora</div>
          {weekDays?.map((day, index) => (
            <div key={index} className="p-3 text-center border-l border-border">
              <div className="text-sm font-medium">{formatDate(day)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {getAppointmentsForDate(day)?.length} citas
              </div>
            </div>
          ))}
        </div>
        {/* Time Slots */}
        <div className="flex-1 overflow-y-auto">
          {timeSlots?.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-border min-h-[60px]">
              <div className="p-3 text-sm text-muted-foreground border-r border-border">
                {time}
              </div>
              {weekDays?.map((day, dayIndex) => {
                const appointment = getAppointmentForTimeSlot(day, time);
                return (
                  <div
                    key={dayIndex}
                    className="border-l border-border p-1 hover:bg-muted/50 cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, time)}
                    onClick={() => !appointment && onTimeSlotClick(day, time)}
                  >
                    {appointment && (
                      <div
                        className={`p-2 rounded-md text-xs ${getStatusColor(appointment?.status)} cursor-move`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, appointment)}
                        onClick={() => onAppointmentClick(appointment)}
                      >
                        <div className="font-medium truncate">{appointment?.patientName}</div>
                        <div className="truncate opacity-90">{appointment?.treatment}</div>
                        <div className="text-xs opacity-75">{appointment?.duration}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDays = getDaysInMonth(currentDate);
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    return (
      <div className="flex flex-col h-full">
        {/* Month Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays?.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
          {monthDays?.slice(0, 35)?.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isCurrentMonth = day?.getMonth() === currentDate?.getMonth();
            const isToday = day?.toDateString() === new Date()?.toDateString();
            
            return (
              <div
                key={index}
                className={`border-r border-b border-border p-2 cursor-pointer hover:bg-muted/50 ${
                  !isCurrentMonth ? 'text-muted-foreground bg-muted/20' : ''
                } ${isToday ? 'bg-primary/10' : ''}`}
                onClick={() => onDateChange(day)}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {day?.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAppointments?.slice(0, 3)?.map((apt, aptIndex) => (
                    <div
                      key={aptIndex}
                      className={`text-xs p-1 rounded truncate ${getStatusColor(apt?.status)}`}
                      onClick={(e) => {
                        e?.stopPropagation();
                        onAppointmentClick(apt);
                      }}
                    >
                      {apt?.time} - {apt?.patientName}
                    </div>
                  ))}
                  {dayAppointments?.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayAppointments?.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);
    
    return (
      <div className="flex flex-col h-full">
        {/* Day Header */}
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold">
            {currentDate?.toLocaleDateString('es-MX', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {dayAppointments?.length} citas programadas
          </p>
        </div>
        {/* Time Slots */}
        <div className="flex-1 overflow-y-auto">
          {timeSlots?.map((time) => {
            const appointment = getAppointmentForTimeSlot(currentDate, time);
            return (
              <div
                key={time}
                className="flex border-b border-border min-h-[80px] hover:bg-muted/50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, currentDate, time)}
                onClick={() => !appointment && onTimeSlotClick(currentDate, time)}
              >
                <div className="w-20 p-4 text-sm text-muted-foreground border-r border-border">
                  {time}
                </div>
                <div className="flex-1 p-4">
                  {appointment ? (
                    <div
                      className={`p-4 rounded-lg ${getStatusColor(appointment?.status)} cursor-move`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, appointment)}
                      onClick={() => onAppointmentClick(appointment)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{appointment?.patientName}</h4>
                        <span className="text-sm opacity-75">{appointment?.duration}</span>
                      </div>
                      <p className="text-sm opacity-90">{appointment?.treatment}</p>
                      <div className="flex items-center mt-2 text-xs opacity-75">
                        <Icon name="Phone" size={12} className="mr-1" />
                        {appointment?.phone}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground cursor-pointer">
                      <Icon name="Plus" size={16} className="mr-2" />
                      <span className="text-sm">Agregar cita</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {currentDate?.toLocaleDateString('es-MX', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              iconSize={16}
              onClick={() => {
                const newDate = new Date(currentDate);
                if (viewMode === 'month') {
                  newDate?.setMonth(newDate?.getMonth() - 1);
                } else if (viewMode === 'week') {
                  newDate?.setDate(newDate?.getDate() - 7);
                } else {
                  newDate?.setDate(newDate?.getDate() - 1);
                }
                onDateChange(newDate);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(new Date())}
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              iconSize={16}
              onClick={() => {
                const newDate = new Date(currentDate);
                if (viewMode === 'month') {
                  newDate?.setMonth(newDate?.getMonth() + 1);
                } else if (viewMode === 'week') {
                  newDate?.setDate(newDate?.getDate() + 7);
                } else {
                  newDate?.setDate(newDate?.getDate() + 1);
                }
                onDateChange(newDate);
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('day')}
              className="text-xs"
            >
              Día
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('week')}
              className="text-xs"
            >
              Semana
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('month')}
              className="text-xs"
            >
              Mes
            </Button>
          </div>
        </div>
      </div>
      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>
    </div>
  );
};

export default CalendarView;