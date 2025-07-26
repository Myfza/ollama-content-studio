import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StorageWarning = ({ storageInfo, onCleanup, onDismiss }) => {
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getWarningLevel = () => {
    const usagePercentage = (storageInfo.used / storageInfo.total) * 100;
    if (usagePercentage >= 90) return 'critical';
    if (usagePercentage >= 80) return 'warning';
    return 'info';
  };

  const warningLevel = getWarningLevel();
  const usagePercentage = (storageInfo.used / storageInfo.total) * 100;

  const getWarningConfig = () => {
    switch (warningLevel) {
      case 'critical':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          title: 'Critical Storage Warning',
          message: 'Storage is critically low. Consider removing unused models to free up space.',
          actionText: 'Clean Up Now'
        };
      case 'warning':
        return {
          icon: 'AlertCircle',
          iconColor: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          title: 'Storage Warning',
          message: 'Storage space is running low. You may want to clean up unused models.',
          actionText: 'Manage Storage'
        };
      default:
        return {
          icon: 'Info',
          iconColor: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent/20',
          title: 'Storage Information',
          message: 'Monitor your storage usage to ensure optimal performance.',
          actionText: 'View Details'
        };
    }
  };

  const config = getWarningConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6`}
    >
      <div className="flex items-start space-x-3">
        <div className={`${config.iconColor} mt-0.5`}>
          <Icon name={config.icon} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-semibold text-foreground">
              {config.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={16}
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground"
            />
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {config.message}
          </p>

          {/* Storage Usage Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Storage Usage</span>
              <span className="text-foreground font-medium">
                {formatSize(storageInfo.used)} / {formatSize(storageInfo.total)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full transition-all duration-500 ${
                  warningLevel === 'critical' ? 'bg-error' :
                  warningLevel === 'warning' ? 'bg-warning' : 'bg-accent'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${usagePercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{usagePercentage.toFixed(1)}% used</span>
              <span>{formatSize(storageInfo.available)} available</span>
            </div>
          </div>

          {/* Recommendations */}
          {storageInfo.recommendations && storageInfo.recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Recommendations:
              </h4>
              <ul className="space-y-1">
                {storageInfo.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                    <Icon name="ChevronRight" size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onCleanup}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
            >
              {config.actionText}
            </Button>
            {warningLevel === 'critical' && (
              <Button
                variant="ghost"
                size="sm"
                iconName="ExternalLink"
                iconPosition="right"
                iconSize={14}
                className="text-muted-foreground"
              >
                Storage Settings
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StorageWarning;