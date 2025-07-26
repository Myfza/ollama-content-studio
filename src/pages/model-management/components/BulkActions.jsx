import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  selectedModels, 
  onSelectAll, 
  onDeselectAll, 
  onBulkDelete, 
  onBulkUpdate,
  totalModels,
  isAllSelected 
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getTotalSize = () => {
    return selectedModels.reduce((total, model) => total + model.size, 0);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) {
      onBulkDelete(selectedModels.map(model => model.id));
      setShowConfirmDelete(false);
    }
  };

  if (selectedModels.length === 0) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-card border border-border rounded-lg shadow-xl p-4 z-100"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="CheckSquare" size={16} color="white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                {selectedModels.length} Selected
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatSize(getTotalSize())} total size
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={16}
            onClick={onDeselectAll}
            className="text-muted-foreground"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            iconName={isAllSelected ? "Square" : "CheckSquare"}
            iconPosition="left"
            iconSize={14}
            className="flex-1"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkUpdate}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={14}
            className="flex-1"
          >
            Update
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowConfirmDelete(true)}
            iconName="Trash2"
            iconPosition="left"
            iconSize={14}
            className="flex-1"
          >
            Delete
          </Button>
        </div>

        {/* Progress indicator for bulk operations */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{selectedModels.length} of {totalModels} models</span>
            <span>Ready for action</span>
          </div>
        </div>
      </motion.div>

      {/* Bulk Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4"
            onClick={() => setShowConfirmDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">
                    Delete Multiple Models
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-foreground mb-3">
                  Are you sure you want to delete {selectedModels.length} selected models?
                </p>
                
                <div className="bg-muted rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total storage to free:</span>
                    <span className="font-medium text-foreground">
                      {formatSize(getTotalSize())}
                    </span>
                  </div>
                </div>

                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedModels.map((model) => (
                    <div key={model.id} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{model.name}</span>
                      <span className="text-muted-foreground">
                        {formatSize(model.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="flex-1"
                >
                  Delete All
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BulkActions;