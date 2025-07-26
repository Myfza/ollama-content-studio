import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ userName = "User" }) => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-lg p-6 border border-border mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-muted-foreground font-body">
            Ready to create amazing content with AI? Your local models are standing by.
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full">
          <Icon name="Sparkles" size={32} className="text-accent" />
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;