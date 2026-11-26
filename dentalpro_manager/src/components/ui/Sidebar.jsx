import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigationItems = [
    { 
      path: '/doctor-dashboard', 
      label: 'Dashboard', 
      icon: 'LayoutDashboard',
      description: 'Vista general de la práctica'
    },
    { 
      path: '/patient-management', 
      label: 'Pacientes', 
      icon: 'Users',
      description: 'Gestión de pacientes'
    },
    { 
      path: '/patient-clinical-record', 
      label: 'Historial Clínico', 
      icon: 'FileText',
      description: 'Registros médicos'
    },
    { 
      path: '/appointment-scheduling', 
      label: 'Citas', 
      icon: 'Calendar',
      description: 'Programación de citas'
    },
    { 
      path: '/financial-management', 
      label: 'Finanzas', 
      icon: 'CreditCard',
      description: 'Gestión financiera'
    },
    { 
      path: '/document-generation', 
      label: 'Documentos', 
      icon: 'FileText',
      description: 'Generación de documentos'
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e?.target?.value);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const filteredPatients = [
    { id: 1, name: 'Ana Martínez', phone: '555-0123' },
    { id: 2, name: 'Carlos López', phone: '555-0124' },
    { id: 3, name: 'María González', phone: '555-0125' }
  ]?.filter(patient => 
    patient?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    patient?.phone?.includes(searchQuery)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 z-100 h-full bg-card border-r border-border clinical-shadow transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-60'
      } hidden lg:block`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Stethoscope" size={20} color="white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-foreground">DentalPro</span>
                  <span className="text-xs text-muted-foreground -mt-1">Manager</span>
                </div>
              )}
            </div>
          </div>

          {/* Patient Search */}
          {!isCollapsed && (
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar paciente..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="pl-10"
                />
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                
                {/* Search Results Dropdown */}
                {isSearchFocused && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg clinical-shadow-lg z-200 max-h-48 overflow-y-auto">
                    {filteredPatients?.length > 0 ? (
                      <div className="p-2">
                        {filteredPatients?.map((patient) => (
                          <button
                            key={patient?.id}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-clinical"
                            onClick={() => handleNavigation(`/patient-management/${patient?.id}`)}
                          >
                            <div className="text-sm font-medium">{patient?.name}</div>
                            <div className="text-xs text-muted-foreground">{patient?.phone}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No se encontraron pacientes
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems?.map((item) => (
              <div key={item?.path} className="relative group">
                <Button
                  variant={isActive(item?.path) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full justify-start transition-clinical ${
                    isCollapsed ? 'px-2' : 'px-3'
                  }`}
                >
                  <Icon name={item?.icon} size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">{item?.label}</span>
                  )}
                </Button>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-popover border border-border rounded-md clinical-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-200 whitespace-nowrap">
                    <div className="text-sm font-medium">{item?.label}</div>
                    <div className="text-xs text-muted-foreground">{item?.description}</div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Financial Alert Indicator */}
          <div className="p-4 border-t border-border">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 bg-warning/10 rounded-lg border border-warning/20`}>
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
                {!isCollapsed && (
                  <div>
                    <div className="text-xs font-medium text-warning">3 Pagos Pendientes</div>
                    <div className="text-xs text-muted-foreground">$2,450 MXN</div>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleNavigation('/financial-management')}
                  className="text-warning hover:text-warning"
                >
                  Ver
                </Button>
              )}
            </div>
          </div>

          {/* Collapse Toggle */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-full justify-center transition-clinical"
              iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              iconSize={16}
            >
              {!isCollapsed && <span className="ml-2">Contraer</span>}
            </Button>
          </div>
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-100 bg-card border-t border-border clinical-shadow lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems?.slice(0, 4)?.map((item) => (
            <Button
              key={item?.path}
              variant={isActive(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              className="flex flex-col items-center space-y-1 min-w-0 flex-1 h-12"
            >
              <Icon name={item?.icon} size={16} />
              <span className="text-xs truncate">{item?.label}</span>
            </Button>
          ))}
          
          {/* More Menu for Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 h-12"
          >
            <Icon name="MoreHorizontal" size={16} />
            <span className="text-xs">Más</span>
          </Button>
        </div>
      </nav>
      {/* Floating Action Button - Appointment Quick Actions */}
      <div className="fixed bottom-20 right-6 z-100 lg:bottom-6">
        <Button
          variant="default"
          size="lg"
          onClick={() => handleNavigation('/appointment-scheduling')}
          className="rounded-full w-14 h-14 clinical-shadow-lg"
          iconName="Plus"
          iconSize={24}
        />
      </div>
    </>
  );
};

export default Sidebar;