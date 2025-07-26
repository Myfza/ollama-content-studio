import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Button from './Button';

const QuickActionButton = ({ onAction, loading = false, disabled = false }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Only show on content generation page
  useEffect(() => {
    setIsVisible(location.pathname === '/content-generation');
  }, [location.pathname]);

  // Handle mobile keyboard visibility
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      setIsKeyboardVisible(viewportHeight < windowHeight * 0.75);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleClick = () => {
    if (!loading && !disabled && onAction) {
      onAction();
    }
  };

  if (!isVisible || loading) {
    return null;
  }

  return (
    <div 
      className={`fixed z-200 transition-all duration-300 ease-out ${
        isKeyboardVisible 
          ? 'bottom-4 right-4' :'bottom-20 md:bottom-6 right-4 md:right-6'
      }`}
    >
      <Button
        variant="default"
        size="lg"
        onClick={handleClick}
        disabled={disabled}
        iconName="Zap"
        iconPosition="left"
        iconSize={20}
        className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-150 ease-out font-caption font-medium"
      >
        Generate
      </Button>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-150 rounded-lg" />
      </div>
    </div>
  );
};

export default QuickActionButton;