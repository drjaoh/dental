import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigationItems = [
    { path: '/doctor-dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/patient-management', label: 'Pacientes', icon: 'Users' },
    { path: '/appointment-scheduling', label: 'Citas', icon: 'Calendar' },
    { path: '/financial-management', label: 'Finanzas', icon: 'CreditCard' },
    { path: '/document-generation', label: 'Documentos', icon: 'FileText' }
  ];

  const primaryNavItems = navigationItems?.slice(0, 4);
  const secondaryNavItems = navigationItems?.slice(4);

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout clicked');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border clinical-shadow">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Stethoscope" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">DentalPro</span>
              <span className="text-xs text-muted-foreground -mt-1">Manager</span>
            </div>
          </div>
        </div>

        {/* Primary Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActive(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="transition-clinical"
            >
              {item?.label}
            </Button>
          ))}
          
          {/* More Menu */}
          {secondaryNavItems?.length > 0 && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
                iconSize={16}
                className="transition-clinical"
              >
                Más
              </Button>
            </div>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            iconName="Bell"
            iconSize={20}
            className="relative transition-clinical"
          >
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProfileToggle}
              className="flex items-center space-x-2 transition-clinical"
            >
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="var(--color-muted-foreground)" />
              </div>
              <span className="hidden md:block text-sm font-medium">Dr. García</span>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg clinical-shadow-lg z-200">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium">Dr. María García</p>
                    <p className="text-xs text-muted-foreground">maria.garcia@dentalpro.com</p>
                  </div>
                  <div className="mt-2 space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Settings"
                      iconPosition="left"
                      iconSize={16}
                      className="w-full justify-start"
                    >
                      Configuración
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="HelpCircle"
                      iconPosition="left"
                      iconSize={16}
                      className="w-full justify-start"
                    >
                      Ayuda
                    </Button>
                    <div className="border-t border-border pt-1 mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="LogOut"
                        iconPosition="left"
                        iconSize={16}
                        onClick={handleLogout}
                        className="w-full justify-start text-error hover:text-error"
                      >
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          iconName="Menu"
          iconSize={20}
          className="lg:hidden transition-clinical"
        />
      </div>
    </header>
  );
};

export default Header;