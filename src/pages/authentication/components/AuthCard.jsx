import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const AuthCard = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background ambient-pattern">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          type: "spring", 
          stiffness: 100, 
          damping: 15 
        }}
        className="w-full max-w-md"
      >
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-xl shadow-lg">
              <Icon name="Zap" size={24} color="white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-heading font-bold text-foreground">
                Ollama Studio
              </h1>
              <p className="text-sm text-muted-foreground">
                Privacy-First AI Content
              </p>
            </div>
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-card border border-border rounded-2xl shadow-xl p-8"
        >
          {children}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-muted-foreground">
            Secure • Private • Local AI Processing
          </p>
          <div className="flex items-center justify-center space-x-4 mt-3">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} className="text-success" />
              <span className="text-xs text-muted-foreground">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Lock" size={12} className="text-success" />
              <span className="text-xs text-muted-foreground">End-to-End Encrypted</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthCard;