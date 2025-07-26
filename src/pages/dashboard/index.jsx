import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import WelcomeSection from './components/WelcomeSection';
import StatsCards from './components/StatsCards';
import OllamaStatusIndicator from './components/OllamaStatusIndicator';
import QuickActionCards from './components/QuickActionCards';
import RecentContentHistory from './components/RecentContentHistory';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Simulate getting user data from localStorage or context
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserName(userData.name || 'User');
    } else {
      // Mock user data
      setUserName('Alex Chen');
    }
  }, []);

  const handleQuickAction = () => {
    navigate('/content-generation');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="md:ml-60 pt-16 pb-20 md:pb-6">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb />
          
          {/* Page Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Ollama Status Indicator */}
            <OllamaStatusIndicator />
            
            {/* Welcome Section */}
            <WelcomeSection userName={userName} />
            
            {/* Stats Cards */}
            <StatsCards />
            
            {/* Quick Action Cards */}
            <QuickActionCards />
            
            {/* Recent Content History */}
            <RecentContentHistory />
          </motion.div>
        </div>
      </main>
      
      {/* Quick Action Button */}
      <QuickActionButton onAction={handleQuickAction} />
    </div>
  );
};

export default Dashboard;