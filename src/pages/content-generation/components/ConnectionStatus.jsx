import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectionStatus = ({ status, onRetryConnection, onOpenTroubleshooting }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10 border-success/20',
          title: 'Ollama Connected',
          description: 'All models are available for content generation',
          showActions: false
        };
      case 'connecting':
        return {
          icon: 'Loader',
          color: 'text-warning',
          bgColor: 'bg-warning/10 border-warning/20',
          title: 'Connecting to Ollama',
          description: 'Establishing connection to local AI service...',
          showActions: true
        };
      case 'disconnected':
        return {
          icon: 'XCircle',
          color: 'text-error',
          bgColor: 'bg-error/10 border-error/20',
          title: 'Ollama Disconnected',
          description: 'Unable to connect to Ollama service',
          showActions: true
        };
      default:
        return {
          icon: 'Circle',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted border-border',
          title: 'Unknown Status',
          description: 'Connection status unknown',
          showActions: true
        };
    }
  };

  const config = getStatusConfig();

  const troubleshootingSteps = [
    {
      step: 1,
      title: 'Check Ollama Installation',
      description: 'Ensure Ollama is installed on your system',
      command: 'ollama --version'
    },
    {
      step: 2,
      title: 'Start Ollama Service',
      description: 'Make sure the Ollama service is running',
      command: 'ollama serve'
    },
    {
      step: 3,
      title: 'Verify Connection',
      description: 'Test the connection to Ollama API',
      command: 'curl http://localhost:11434/api/tags'
    },
    {
      step: 4,
      title: 'Check Firewall',
      description: 'Ensure port 11434 is not blocked by firewall'
    }
  ];

  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-4 ${config.bgColor}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon 
              name={config.icon} 
              size={20} 
              className={`${config.color} ${status === 'connecting' ? 'animate-spin' : ''}`}
            />
            <div>
              <h3 className="font-heading font-medium text-foreground">
                {config.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {config.showActions && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRetryConnection}
                  iconName="RefreshCw"
                  iconSize={16}
                  disabled={status === 'connecting'}
                >
                  Retry
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                  iconSize={16}
                >
                  Help
                </Button>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-border/50"
            >
              <h4 className="font-heading font-medium text-foreground mb-3">
                Troubleshooting Steps
              </h4>
              
              <div className="space-y-3">
                {troubleshootingSteps.map((step) => (
                  <div key={step.step} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-foreground">
                        {step.step}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground text-sm">
                        {step.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mb-1">
                        {step.description}
                      </p>
                      {step.command && (
                        <code className="text-xs bg-secondary px-2 py-1 rounded font-mono text-foreground">
                          {step.command}
                        </code>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Need more help?
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Visit the Ollama documentation or check our troubleshooting guide for detailed setup instructions.
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onOpenTroubleshooting}
                        iconName="ExternalLink"
                        iconSize={14}
                        className="text-xs"
                      >
                        Open Guide
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ConnectionStatus;