import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PatientTable = ({ patients, onPatientSelect, onEditPatient, onScheduleAppointment }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatients, setSelectedPatients] = useState([]);

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'pending', label: 'Pendiente' }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      // Use patients directly since filteredAndSortedPatients isn't available yet
      const currentFiltered = patients?.filter(patient => {
        const matchesSearch = patient?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                             patient?.patientId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                             patient?.phone?.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || patient?.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
      setSelectedPatients(currentFiltered?.map(p => p?.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (patientId, checked) => {
    if (checked) {
      setSelectedPatients([...selectedPatients, patientId]);
    } else {
      setSelectedPatients(selectedPatients?.filter(id => id !== patientId));
    }
  };

  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients?.filter(patient => {
      const matchesSearch = patient?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           patient?.patientId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           patient?.phone?.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || patient?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [patients, searchTerm, statusFilter, sortConfig]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success/10 text-success border-success/20', label: 'Activo' },
      inactive: { color: 'bg-muted text-muted-foreground border-border', label: 'Inactivo' },
      pending: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Pendiente' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card rounded-lg border border-border clinical-shadow">
      {/* Table Header with Search and Filters */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Buscar por nombre, ID o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Estado"
              className="w-40"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Exportar
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedPatients?.length === filteredAndSortedPatients?.length && filteredAndSortedPatients?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('patientId')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  ID Paciente
                  {getSortIcon('patientId')}
                </button>
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  Nombre
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('lastVisit')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  Última Visita
                  {getSortIcon('lastVisit')}
                </button>
              </th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('balance')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  Saldo
                  {getSortIcon('balance')}
                </button>
              </th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPatients?.map((patient) => (
              <tr
                key={patient?.id}
                className="border-b border-border hover:bg-muted/30 transition-clinical cursor-pointer"
                onClick={() => onPatientSelect(patient)}
              >
                <td className="p-3" onClick={(e) => e?.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedPatients?.includes(patient?.id)}
                    onChange={(e) => handleSelectPatient(patient?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-3">
                  <span className="text-sm font-medium text-primary">{patient?.patientId}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{patient?.name}</div>
                      <div className="text-xs text-muted-foreground">{patient?.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-sm text-foreground">{patient?.lastVisit}</span>
                </td>
                <td className="p-3">
                  {getStatusBadge(patient?.status)}
                </td>
                <td className="p-3">
                  <span className={`text-sm font-medium ${patient?.balance > 0 ? 'text-error' : 'text-success'}`}>
                    ${patient?.balance?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </span>
                </td>
                <td className="p-3" onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      iconSize={16}
                      onClick={() => onEditPatient(patient)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Calendar"
                      iconSize={16}
                      onClick={() => onScheduleAppointment(patient)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreVertical"
                      iconSize={16}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden">
        {filteredAndSortedPatients?.map((patient) => (
          <div
            key={patient?.id}
            className="p-4 border-b border-border hover:bg-muted/30 transition-clinical cursor-pointer"
            onClick={() => onPatientSelect(patient)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{patient?.name}</div>
                  <div className="text-xs text-muted-foreground">{patient?.patientId}</div>
                </div>
              </div>
              {getStatusBadge(patient?.status)}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Teléfono:</span>
                <div className="font-medium">{patient?.phone}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Última Visita:</span>
                <div className="font-medium">{patient?.lastVisit}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Saldo:</span>
                <div className={`font-medium ${patient?.balance > 0 ? 'text-error' : 'text-success'}`}>
                  ${patient?.balance?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-3" onClick={(e) => e?.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit"
                iconSize={16}
                onClick={() => onEditPatient(patient)}
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="Calendar"
                iconSize={16}
                onClick={() => onScheduleAppointment(patient)}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredAndSortedPatients?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron pacientes</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || statusFilter !== 'all' ? 'Intenta ajustar los filtros de búsqueda' : 'Comienza agregando tu primer paciente'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientTable;