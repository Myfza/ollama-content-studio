import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GenerationQueue = ({ queue, onCancelGeneration, onRetryGeneration }) => {
  if (!queue || queue.length === 0) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'generating':
        return 'Loader';
      case 'completed':
        return 'CheckCircle';
      case 'failed':
        return 'XCircle';
      case 'queued':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'generating':
        return 'text-accent';
      case 'completed':
        return 'text-success';
      case 'failed':
        return 'text-error';
      case 'queued':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeEstimate = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Generation Queue
        </h2>
        <div className="text-sm text-muted-foreground">
          {queue.filter(item => item.status === 'queued' || item.status === 'generating').length} active
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {queue.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    item.status === 'generating' ? 'bg-accent/10' : 'bg-secondary'
                  }`}>
                    <Icon 
                      name={getStatusIcon(item.status)} 
                      size={20} 
                      className={`${getStatusColor(item.status)} ${
                        item.status === 'generating' ? 'animate-spin' : ''
                      }`}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-heading font-medium text-foreground">
                        {item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1)} Content
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {item.model}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {item.prompt}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Status: {item.status}</span>
                      {item.progress && (
                        <span>Progress: {item.progress}%</span>
                      )}
                      {item.estimatedTime && (
                        <span>ETA: {formatTimeEstimate(item.estimatedTime)}</span>
                      )}
                      {item.completedAt && (
                        <span>Completed: {new Date(item.completedAt).toLocaleTimeString()}</span>
                      )}
                    </div>

                    {/* Progress Bar for Active Generations */}
                    {item.status === 'generating' && item.progress && (
                      <div className="mt-2">
                        <div className="w-full bg-secondary rounded-full h-1">
                          <motion.div 
                            className="bg-accent h-1 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {item.status === 'generating' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCancelGeneration(item.id)}
                      iconName="X"
                      iconSize={16}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      Cancel
                    </Button>
                  )}
                  
                  {item.status === 'failed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRetryGeneration(item.id)}
                      iconName="RefreshCw"
                      iconSize={16}
                      className="text-accent hover:text-accent hover:bg-accent/10"
                    >
                      Retry
                    </Button>
                  )}
                  
                  {item.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ExternalLink"
                      iconSize={16}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      View
                    </Button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {item.status === 'failed' && item.error && (
                <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-error">Generation Failed</p>
                      <p className="text-xs text-error/80 mt-1">{item.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GenerationQueue;