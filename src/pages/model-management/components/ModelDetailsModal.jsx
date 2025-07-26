import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelDetailsModal = ({ model, isOpen, onClose }) => {
  if (!model) return null;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const performanceMetrics = [
    { label: 'Response Speed', value: model.metrics?.responseSpeed || 85, unit: 'ms avg' },
    { label: 'Accuracy', value: model.metrics?.accuracy || 92, unit: '%' },
    { label: 'Memory Usage', value: model.metrics?.memoryUsage || 68, unit: '% peak' },
    { label: 'Token Rate', value: model.metrics?.tokenRate || 156, unit: 'tokens/sec' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="Server" size={24} color="white" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-foreground">
                    {model.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {model.version} • {model.type} Model
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={20}
                onClick={onClose}
                className="text-muted-foreground"
              />
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-3">
                  Model Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Size</label>
                      <p className="font-medium text-foreground">{formatSize(model.size)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Downloads</label>
                      <p className="font-medium text-foreground">
                        {model.downloads?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Rating</label>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={16}
                            className={i < (model.rating || 0) ? 'text-warning fill-current' : 'text-muted-foreground'}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          ({model.rating || 0}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Last Used</label>
                      <p className="font-medium text-foreground">
                        {formatDate(model.lastUsed)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Total Generations</label>
                      <p className="font-medium text-foreground">
                        {model.totalGenerations?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm text-foreground">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {model.description && (
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-3">
                    Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {model.description}
                  </p>
                </div>
              )}

              {/* Performance Metrics */}
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-3">
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="bg-muted rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className={`text-sm font-medium ${getPerformanceColor(metric.value)}`}>
                          {metric.value}{metric.unit}
                        </span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            metric.value >= 80 ? 'bg-success' :
                            metric.value >= 60 ? 'bg-warning' : 'bg-error'
                          }`}
                          style={{ width: `${Math.min(metric.value, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Statistics */}
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-3">
                  Usage Statistics
                </h3>
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {model.totalGenerations?.toLocaleString() || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Generations</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {Math.round((model.totalGenerations || 0) / 30)}
                      </p>
                      <p className="text-sm text-muted-foreground">Daily Average</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {model.performance || 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Performance Score</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage Information */}
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-3">
                  Storage Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Model Size</span>
                    <span className="font-medium text-foreground">
                      {formatSize(model.size)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cache Size</span>
                    <span className="font-medium text-foreground">
                      {formatSize(model.storageUsed || 0)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 bg-accent rounded-full transition-all duration-300"
                      style={{ width: `${((model.storageUsed || 0) / model.size) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
              >
                Delete Model
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModelDetailsModal;