import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: 'Home',
      tooltip: 'Overview and quick actions'
    },
    { 
      label: 'Content Generation', 
      path: '/content-generation', 
      icon: 'Edit3',
      tooltip: 'Create AI-powered content'
    },
    { 
      label: 'Model Management', 
      path: '/model-management', 
      icon: 'Server',
      tooltip: 'Manage local AI models'
    },
  ];

  // Simulate Ollama connection status
  useEffect(() => {
    const checkConnection = () => {
      // Simulate connection check
      const statuses = ['connected', 'connecting', 'disconnected'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success';
      case 'connecting':
        return 'text-warning';
      case 'disconnected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'CheckCircle';
      case 'connecting':
        return 'Clock';
      case 'disconnected':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Ollama Connected';
      case 'connecting':
        return 'Connecting to Ollama';
      case 'disconnected':
        return 'Ollama Disconnected';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-primary border-r border-border flex-col z-100">
        {/* Header with Logo and Status */}
        <div className="p-4 border-b border-border">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-lg">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="font-heading font-semibold text-lg text-foreground">
              Ollama Studio
            </span>
          </div>

          {/* Ollama Status Indicator */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center w-full p-3 rounded-lg bg-secondary hover:bg-muted transition-colors duration-150"
            >
              <Icon 
                name={getStatusIcon()} 
                size={16} 
                className={`mr-3 ${getStatusColor()} ${connectionStatus === 'connecting' ? 'pulse-subtle' : ''}`}
              />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-foreground">
                  {getStatusText()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Local AI Processing
                </div>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {/* Status Dropdown */}
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg py-2 z-110">
                <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                  Connection Details
                </div>
                <div className="px-4 py-2">
                  <div className="text-sm text-popover-foreground">Status: {connectionStatus}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {connectionStatus === 'connected' && 'All models available'}
                    {connectionStatus === 'connecting' && 'Establishing connection...'}
                    {connectionStatus === 'disconnected' && 'Check Ollama service'}
                  </div>
                </div>
                <div className="border-t border-border mt-2 pt-2">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150">
                    <Icon name="RefreshCw" size={14} className="mr-2" />
                    Retry Connection
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150">
                    <Icon name="Settings" size={14} className="mr-2" />
                    Connection Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              title={item.tooltip}
              className={`flex items-center w-full p-3 rounded-lg text-left transition-all duration-150 ease-out group ${
                isActive(item.path)
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : 'text-foreground hover:bg-secondary hover:shadow-sm'
              }`}
            >
              <Icon 
                name={item.icon} 
                size={20} 
                className={`mr-3 ${isActive(item.path) ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
              />
              <span className="font-caption font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            Privacy-First AI Content
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-border z-100">
        <div className="flex items-center justify-around h-16 px-4">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors duration-150 ${
                isActive(item.path)
                  ? 'text-accent' :'text-muted-foreground'
              }`}
            >
              <Icon 
                name={item.icon} 
                size={20} 
                className="mb-1"
              />
              <span className="text-xs font-caption font-medium">
                {item.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;