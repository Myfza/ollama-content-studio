import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Clock, 
  TrendingUp, 
  Zap,
  BarChart3,
  Calendar
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import contentService from "../../../utils/contentService";

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalGenerations: 0,
    completedGenerations: 0,
    averageTime: 0,
    contentTypeBreakdown: {},
    loading: true
  });
  const [timeframe, setTimeframe] = useState('30d');
  
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user?.id, timeframe]);

  const loadStats = async () => {
    setStats(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await contentService.getGenerationStats(user.id, timeframe);
      
      if (result.success) {
        setStats({
          ...result.data,
          loading: false
        });
      } else {
        setStats(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.log('Error loading stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getSuccessRate = () => {
    const total = stats.totalGenerations;
    if (total === 0) return 0;
    return Math.round((stats.completedGenerations / total) * 100);
  };

  const getMostUsedContentType = () => {
    const breakdown = stats.contentTypeBreakdown || {};
    const entries = Object.entries(breakdown);
    if (entries.length === 0) return 'None';
    
    const max = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return max[0].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const statsCards = [
    {
      title: "Total Generations",
      value: stats.loading ? "..." : stats.totalGenerations.toLocaleString(),
      icon: <FileText size={24} />,
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Content pieces created"
    },
    {
      title: "Success Rate",
      value: stats.loading ? "..." : `${getSuccessRate()}%`,
      icon: <TrendingUp size={24} />,
      color: "text-success",
      bgColor: "bg-success/10",
      description: "Successful generations"
    },
    {
      title: "Average Time",
      value: stats.loading ? "..." : formatTime(stats.averageTime),
      icon: <Clock size={24} />,
      color: "text-warning",
      bgColor: "bg-warning/10",
      description: "Per generation"
    },
    {
      title: "Most Used Type",
      value: stats.loading ? "..." : getMostUsedContentType(),
      icon: <BarChart3 size={24} />,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      description: "Content category"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with timeframe selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Generation Statistics
          </h3>
          <p className="text-sm text-muted-foreground">
            Your AI content generation metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-muted-foreground" />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-foreground font-heading mb-1">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
              
              <div className={`${card.bgColor} ${card.color} p-3 rounded-lg`}>
                {card.icon}
              </div>
            </div>

            {/* Loading indicator */}
            {stats.loading && (
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-1">
                  <motion.div
                    className="bg-accent h-1 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Performance indicator */}
      {!stats.loading && stats.totalGenerations > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-accent/10 to-purple-600/10 border border-accent/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <Zap className="text-accent" size={20} />
            <div>
              <p className="text-sm font-medium text-foreground">
                Performance Summary
              </p>
              <p className="text-xs text-muted-foreground">
                You have generated {stats.totalGenerations} pieces of content with a {getSuccessRate()}% success rate. 
                {stats.averageTime < 5000 && " Lightning fast performance! ⚡"}
                {stats.averageTime >= 5000 && stats.averageTime < 15000 && " Good performance! 👍"}
                {stats.averageTime >= 15000 && " Consider using a smaller model for faster results. 🐌"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!stats.loading && stats.totalGenerations === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12 bg-card border border-border rounded-lg"
        >
          <FileText size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground font-heading mb-2">
            No Content Generated Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start creating AI-powered content to see your statistics here.
          </p>
          <motion.a
            href="/content-generation"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            <Zap size={20} />
            <span>Generate Content</span>
          </motion.a>
        </motion.div>
      )}
    </div>
  );
};

export default StatsCards;