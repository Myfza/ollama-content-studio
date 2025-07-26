import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthCard from './components/AuthCard';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const Authentication = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleTabChange = (tab) => {
    if (!loading) {
      setActiveTab(tab);
      setShowForgotPassword(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setActiveTab('login');
  };

  return (
    <AuthCard>
      <AnimatePresence mode="wait">
        {showForgotPassword ? (
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ForgotPasswordForm
              onBackToLogin={handleBackToLogin}
              loading={loading}
              setLoading={setLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="auth-forms"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />
            
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <LoginForm
                  key="login"
                  onForgotPassword={handleForgotPassword}
                  loading={loading}
                  setLoading={setLoading}
                />
              ) : (
                <RegisterForm
                  key="register"
                  loading={loading}
                  setLoading={setLoading}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthCard>
  );
};

export default Authentication;