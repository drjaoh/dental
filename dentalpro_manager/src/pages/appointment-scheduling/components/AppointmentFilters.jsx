import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const AppointmentFilters = ({ 
  onFilterChange, 
  onSearchChange,
  practitioners,
  treatments,
  activeFilters 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'confirmed', label: 'Confirmada' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'no-show', label: 'No asistió' }
  ];

  const practitionerOptions = [
    { value: '', label: 'Todos los doctores' },
    ...practitioners?.map(p => ({
      value: p?.id,
      label: p?.name,
      description: p?.specialty
    }))
  ];

  const treatmentOptions = [
    { value: '', label: 'Todos los tratamientos' },
    ...treatments?.map(t => ({
      value: t?.id,
      label: t?.name,
      description: `$${t?.price} MXN`
    }))
  ];

  const timeRangeOptions = [
    { value: '', label: 'Todo el día' },
    { value: 'morning', label: 'Mañana (8:00 - 12:00)' },
    { value: 'afternoon', label: 'Tarde (12:00 - 18:00)' },
    { value: 'evening', label: 'Noche (18:00 - 20:00)' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    onSearchChange('');
    onFilterChange('status', '');
    onFilterChange('practitioner', '');
    onFilterChange('treatment', '');
    onFilterChange('timeRange', '');
    onFilterChange('dateRange', { start: '', end: '' });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters?.status) count++;
    if (activeFilters?.practitioner) count++;
    if (activeFilters?.treatment) count++;
    if (activeFilters?.timeRange) count++;
    if (activeFilters?.dateRange?.start || activeFilters?.dateRange?.end) count++;
    return count;
  };

  return (
    <div className="bg-card border-b border-border">
      {/* Main Filter Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search */}
          <div className="relative w-64">
            <Input
              type="search"
              placeholder="Buscar paciente o tratamiento..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2">
            <Select
              options={statusOptions}
              value={activeFilters?.status || ''}
              onChange={(value) => handleFilterChange('status', value)}
              placeholder="Estado"
              className="w-40"
            />
            
            <Select
              options={practitionerOptions}
              value={activeFilters?.practitioner || ''}
              onChange={(value) => handleFilterChange('practitioner', value)}
              placeholder="Doctor"
              className="w-40"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter Count Badge */}
          {getActiveFilterCount() > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="Filter" size={14} />
              <span>{getActiveFilterCount()} filtros</span>
            </div>
          )}

          {/* Expand/Collapse Button */}
          <Button
            variant="outline"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Menos filtros' : 'Más filtros'}
          </Button>

          {/* Clear Filters */}
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={16}
              onClick={clearAllFilters}
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>
      {/* Extended Filters */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Treatment Filter */}
            <Select
              label="Tratamiento"
              options={treatmentOptions}
              value={activeFilters?.treatment || ''}
              onChange={(value) => handleFilterChange('treatment', value)}
              searchable
            />

            {/* Time Range Filter */}
            <Select
              label="Horario"
              options={timeRangeOptions}
              value={activeFilters?.timeRange || ''}
              onChange={(value) => handleFilterChange('timeRange', value)}
            />

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rango de fechas</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={activeFilters?.dateRange?.start || ''}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...activeFilters?.dateRange,
                    start: e?.target?.value
                  })}
                  placeholder="Desde"
                />
                <Input
                  type="date"
                  value={activeFilters?.dateRange?.end || ''}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...activeFilters?.dateRange,
                    end: e?.target?.value
                  })}
                  placeholder="Hasta"
                />
              </div>
            </div>

            {/* Quick Date Presets */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Accesos rápidos</label>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    const today = new Date()?.toISOString()?.split('T')?.[0];
                    handleFilterChange('dateRange', { start: today, end: today });
                  }}
                >
                  Hoy
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow?.setDate(tomorrow?.getDate() + 1);
                    handleFilterChange('dateRange', { 
                      start: tomorrow?.toISOString()?.split('T')?.[0], 
                      end: tomorrow?.toISOString()?.split('T')?.[0] 
                    });
                  }}
                >
                  Mañana
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    const today = new Date();
                    const startOfWeek = new Date(today);
                    startOfWeek?.setDate(today?.getDate() - today?.getDay() + 1);
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek?.setDate(startOfWeek?.getDate() + 6);
                    handleFilterChange('dateRange', { 
                      start: startOfWeek?.toISOString()?.split('T')?.[0], 
                      end: endOfWeek?.toISOString()?.split('T')?.[0] 
                    });
                  }}
                >
                  Esta semana
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    const today = new Date();
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    handleFilterChange('dateRange', { 
                      start: startOfMonth?.toISOString()?.split('T')?.[0], 
                      end: endOfMonth?.toISOString()?.split('T')?.[0] 
                    });
                  }}
                >
                  Este mes
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Mostrando citas con los filtros aplicados
              </span>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <span>Total: 24 citas</span>
                <span>Confirmadas: 18</span>
                <span>Pendientes: 6</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentFilters;