import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelCard = ({ 
  model, 
  type = 'installed', 
  onDownload, 
  onDelete, 
  onViewDetails,
  downloadProgress = null 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(model.id);
      setShowDeleteConfirm(false);
    }
  };

  if (type === 'installed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="Server" size={20} color="white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                {model.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {model.version} • {formatSize(model.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Info"
              iconSize={16}
              onClick={() => onViewDetails && onViewDetails(model)}
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              iconSize={16}
              onClick={() => setShowDeleteConfirm(true)}
              className="text-error hover:text-error"
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Performance</span>
            <span className={`text-sm font-medium ${getPerformanceColor(model.performance)}`}>
              {model.performance}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                model.performance >= 80 ? 'bg-success' :
                model.performance >= 60 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${model.performance}%` }}
            />
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Last Used</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(model.lastUsed)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Generations</p>
            <p className="text-sm font-medium text-foreground">
              {model.totalGenerations.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Storage Usage</span>
            <span className="text-xs text-foreground">
              {formatSize(model.storageUsed)} / {formatSize(model.size)}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className="h-1 bg-accent rounded-full transition-all duration-300"
              style={{ width: `${(model.storageUsed / model.size) * 100}%` }}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">
                    Delete Model
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground mb-6">
                Are you sure you want to delete <strong>{model.name}</strong>? 
                This will free up {formatSize(model.size)} of storage space.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Available model card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="Download" size={20} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">
              {model.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {model.version} • {formatSize(model.size)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon
              key={i}
              name="Star"
              size={14}
              className={i < model.rating ? 'text-warning fill-current' : 'text-muted-foreground'}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {model.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Downloads</p>
          <p className="text-sm font-medium text-foreground">
            {model.downloads.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="text-sm font-medium text-foreground">
            {model.type}
          </p>
        </div>
      </div>

      {/* Download Progress */}
      {downloadProgress && downloadProgress.modelId === model.id ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Downloading...</span>
            <span className="text-sm text-accent">
              {downloadProgress.percentage}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="h-2 bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${downloadProgress.percentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{downloadProgress.speed}</span>
            <span>ETA: {downloadProgress.eta}</span>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload && onDownload(model)}
          iconName="Download"
          iconPosition="left"
          iconSize={16}
          className="w-full"
        >
          Download Model
        </Button>
      )}
    </motion.div>
  );
};

export default ModelCard;