import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LandingHeader = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Demo', path: '/dashboard' },
  ];

  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.href) {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    navigate('/authentication');
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-200 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-xl shadow-lg">
              <Icon name="Zap" size={24} color="white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-xl text-foreground">
                Ollama Studio
              </span>
              <div className="text-xs text-muted-foreground font-caption">
                Privacy-First AI
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                onClick={() => handleNavigation(item)}
                className="text-foreground hover:text-accent transition-colors duration-200 font-caption font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full" />
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="font-caption font-medium"
            >
              Sign In
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={16}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-caption font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName={mobileMenuOpen ? "X" : "Menu"}
            iconSize={24}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          />
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-md border-t border-border"
        >
          <nav className="py-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className="flex items-center w-full px-4 py-3 text-foreground hover:text-accent hover:bg-secondary/50 transition-all duration-200 font-caption font-medium rounded-lg"
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile CTA buttons */}
            <div className="px-4 pt-4 space-y-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                fullWidth
                className="font-caption font-medium"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleGetStarted}
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={16}
                fullWidth
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-caption font-semibold"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default LandingHeader;