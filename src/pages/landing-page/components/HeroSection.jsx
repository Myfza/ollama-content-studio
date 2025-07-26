import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/authentication');
  };

  const handleLearnMore = () => {
    // Smooth scroll to features section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 ambient-pattern">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Main Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-foreground leading-tight"
            >
              Privacy-First
              <span className="block text-accent">AI Content Studio</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed"
            >
              Generate high-quality content with local AI models. No API costs, no data sharing, complete privacy control.
            </motion.p>
          </div>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {[
              { icon: 'Shield', text: '100% Private' },
              { icon: 'DollarSign', text: 'Zero Cost' },
              { icon: 'Zap', text: 'Local Processing' },
              { icon: 'Wifi', text: 'Offline Ready' }
            ].map((badge, index) => (
              <div
                key={badge.text}
                className="flex items-center space-x-2 bg-secondary/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border"
              >
                <Icon name={badge.icon} size={16} className="text-accent" />
                <span className="text-sm font-caption font-medium text-foreground">
                  {badge.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Button
              variant="default"
              size="lg"
              onClick={handleGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={20}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-caption font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Creating
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleLearnMore}
              iconName="PlayCircle"
              iconPosition="left"
              iconSize={20}
              className="px-8 py-4 text-lg font-caption font-semibold border-2 hover:bg-secondary/50 transition-all duration-200"
            >
              Learn More
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <Icon name="Lock" size={16} className="text-success" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Database" size={16} className="text-success" />
              <span>Local Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Eye" size={16} className="text-success" />
              <span>No Tracking</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2 text-muted-foreground"
        >
          <span className="text-xs font-caption">Scroll to explore</span>
          <Icon name="ChevronDown" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;