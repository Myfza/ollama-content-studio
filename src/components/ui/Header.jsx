import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'Home' },
    { label: 'Generate', path: '/content-generation', icon: 'Edit3' },
    { label: 'Models', path: '/model-management', icon: 'Server' },
    { label: 'Landing', path: '/landing-page', icon: 'Globe' },
  ];

  const secondaryItems = [
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help', path: '/help', icon: 'HelpCircle' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-primary border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-lg">
            <Icon name="Zap" size={20} color="white" />
          </div>
          <span className="font-heading font-semibold text-lg text-foreground">
            Ollama Content Studio
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              iconName={item.icon}
              iconPosition="left"
              iconSize={16}
              className="text-sm"
            >
              {item.label}
            </Button>
          ))}
          
          {/* More Menu */}
          <div className="relative ml-4">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              iconSize={16}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-sm"
            >
              More
            </Button>
            
            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-2 z-110">
                {secondaryItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name={item.icon} size={16} className="mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          iconName="Menu"
          iconSize={20}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        />
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-border">
          <nav className="px-4 py-4 space-y-2">
            {[...navigationItems, ...secondaryItems].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm transition-colors duration-150 ${
                  isActive(item.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={18} className="mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;