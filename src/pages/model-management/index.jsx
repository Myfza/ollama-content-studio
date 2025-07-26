import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ModelCard from './components/ModelCard';
import StorageWarning from './components/StorageWarning';
import ModelFilters from './components/ModelFilters';
import BulkActions from './components/BulkActions';
import ModelDetailsModal from './components/ModelDetailsModal';

const ModelManagement = () => {
  const [activeTab, setActiveTab] = useState('installed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedModels, setSelectedModels] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [showStorageWarning, setShowStorageWarning] = useState(true);
  const [selectedModelDetails, setSelectedModelDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data for installed models
  const installedModels = [
    {
      id: 'llama2-7b',
      name: 'Llama 2 7B',
      version: 'v2.0',
      size: 3800000000,
      type: 'language',
      lastUsed: new Date(Date.now() - 86400000),
      totalGenerations: 1247,
      performance: 87,
      storageUsed: 3200000000,
      description: `Meta's Llama 2 7B is a powerful language model optimized for conversational AI and general text generation tasks.\n\nThis model excels at understanding context and generating human-like responses across various domains.`,
      metrics: {
        responseSpeed: 85,
        accuracy: 92,
        memoryUsage: 68,
        tokenRate: 156
      }
    },
    {
      id: 'codellama-13b',name: 'Code Llama 13B',version: 'v1.5',size: 7200000000,type: 'code',
      lastUsed: new Date(Date.now() - 172800000),
      totalGenerations: 892,
      performance: 92,
      storageUsed: 6800000000,
      description: `Code Llama 13B is specialized for code generation, debugging, and programming assistance across multiple languages.\n\nBuilt on Llama 2, it provides excellent code completion and explanation capabilities.`,
      metrics: {
        responseSpeed: 78,
        accuracy: 94,
        memoryUsage: 72,
        tokenRate: 142
      }
    },
    {
      id: 'mistral-7b',name: 'Mistral 7B',version: 'v0.2',size: 4100000000,type: 'language',
      lastUsed: new Date(Date.now() - 259200000),
      totalGenerations: 634,
      performance: 89,
      storageUsed: 3900000000,
      description: `Mistral 7B offers exceptional performance for its size, providing fast and accurate text generation.\n\nOptimized for efficiency while maintaining high-quality outputs across various tasks.`,
      metrics: {
        responseSpeed: 92,
        accuracy: 89,
        memoryUsage: 65,
        tokenRate: 168
      }
    },
    {
      id: 'neural-chat-7b',name: 'Neural Chat 7B',version: 'v3.1',size: 3900000000,type: 'chat',
      lastUsed: new Date(Date.now() - 345600000),
      totalGenerations: 2156,
      performance: 84,
      storageUsed: 3500000000,
      description: `Neural Chat 7B is fine-tuned specifically for conversational AI applications.\n\nExcels at maintaining context in long conversations and providing helpful, engaging responses.`,
      metrics: {
        responseSpeed: 88,
        accuracy: 87,
        memoryUsage: 63,
        tokenRate: 152
      }
    }
  ];

  // Mock data for available models
  const availableModels = [
    {
      id: 'llama2-13b',
      name: 'Llama 2 13B',
      version: 'v2.0',
      size: 7300000000,
      type: 'language',
      downloads: 2847392,
      rating: 5,
      description: 'Larger version of Llama 2 with improved performance and capabilities for complex tasks.'
    },
    {
      id: 'vicuna-7b',
      name: 'Vicuna 7B',
      version: 'v1.5',
      size: 3600000000,
      type: 'chat',
      downloads: 1923847,
      rating: 4,
      description: 'Fine-tuned chatbot model based on Llama with excellent conversational abilities.'
    },
    {
      id: 'wizardcoder-15b',
      name: 'WizardCoder 15B',
      version: 'v1.0',
      size: 8900000000,
      type: 'code',
      downloads: 1456789,
      rating: 5,
      description: 'Advanced code generation model with superior programming assistance capabilities.'
    },
    {
      id: 'alpaca-7b',
      name: 'Alpaca 7B',
      version: 'v2.0',
      size: 3700000000,
      type: 'language',
      downloads: 3245678,
      rating: 4,
      description: 'Instruction-following model fine-tuned for following detailed user instructions.'
    },
    {
      id: 'orca-mini-3b',
      name: 'Orca Mini 3B',
      version: 'v1.0',
      size: 1800000000,
      type: 'language',
      downloads: 987654,
      rating: 3,
      description: 'Compact model optimized for resource-constrained environments while maintaining quality.'
    },
    {
      id: 'stable-beluga-7b',
      name: 'Stable Beluga 7B',
      version: 'v2.0',
      size: 4200000000,
      type: 'language',
      downloads: 1678432,
      rating: 4,
      description: 'Stable and reliable language model with consistent performance across various tasks.'
    }
  ];

  // Mock storage information
  const storageInfo = {
    total: 500000000000, // 500GB
    used: 425000000000,  // 425GB
    available: 75000000000, // 75GB
    recommendations: [
      'Remove unused models to free up 15GB of space',
      'Clear model cache files to recover 3.2GB',
      'Consider moving older models to external storage'
    ]
  };

  // Filter and sort models
  const filterModels = (models) => {
    let filtered = models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           model.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || model.type === selectedType;
      const matchesSize = selectedSize === 'all' || getSizeCategory(model.size) === selectedSize;
      
      return matchesSearch && matchesType && matchesSize;
    });

    // Sort models
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'size':
          return a.size - b.size;
        case 'size_desc':
          return b.size - a.size;
        case 'downloads':
          return (b.downloads || 0) - (a.downloads || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'recent':
          return new Date(b.lastUsed || 0) - new Date(a.lastUsed || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

  const getSizeCategory = (size) => {
    const gb = size / (1024 * 1024 * 1024);
    if (gb < 1) return 'small';
    if (gb < 5) return 'medium';
    if (gb < 15) return 'large';
    return 'xlarge';
  };

  const filteredInstalledModels = filterModels(installedModels);
  const filteredAvailableModels = filterModels(availableModels);

  // Handle model selection
  const handleModelSelect = (model, isSelected) => {
    if (isSelected) {
      setSelectedModels(prev => [...prev, model]);
    } else {
      setSelectedModels(prev => prev.filter(m => m.id !== model.id));
    }
  };

  const handleSelectAll = () => {
    const currentModels = activeTab === 'installed' ? filteredInstalledModels : filteredAvailableModels;
    setSelectedModels(currentModels);
  };

  const handleDeselectAll = () => {
    setSelectedModels([]);
  };

  // Handle model download
  const handleDownload = (model) => {
    setDownloadProgress({
      modelId: model.id,
      percentage: 0,
      speed: '0 MB/s',
      eta: 'Calculating...'
    });

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setDownloadProgress(null);
          // Add to installed models (in real app, this would be handled by the backend)
        }, 1000);
      }
      
      setDownloadProgress({
        modelId: model.id,
        percentage: Math.round(progress),
        speed: `${(Math.random() * 50 + 10).toFixed(1)} MB/s`,
        eta: `${Math.max(1, Math.round((100 - progress) / 10))} min`
      });
    }, 500);
  };

  // Handle model deletion
  const handleDelete = (modelId) => {
    // In real app, this would call the API
    console.log('Deleting model:', modelId);
  };

  // Handle bulk operations
  const handleBulkDelete = (modelIds) => {
    console.log('Bulk deleting models:', modelIds);
    setSelectedModels([]);
  };

  const handleBulkUpdate = () => {
    console.log('Bulk updating models:', selectedModels.map(m => m.id));
  };

  // Handle model details
  const handleViewDetails = (model) => {
    setSelectedModelDetails(model);
    setShowDetailsModal(true);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedSize('all');
    setSortBy('name');
  };

  // Check if all models are selected
  const currentModels = activeTab === 'installed' ? filteredInstalledModels : filteredAvailableModels;
  const isAllSelected = selectedModels.length === currentModels.length && currentModels.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="md:ml-60 min-h-screen">
        <div className="p-6 pb-20 md:pb-6">
          <Breadcrumb />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                Model Management
              </h1>
              <p className="text-muted-foreground">
                Install, monitor, and manage your local Ollama AI models
              </p>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
              >
                Refresh
              </Button>
              <Button
                variant="default"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Browse Models
              </Button>
            </div>
          </div>

          {/* Storage Warning */}
          <AnimatePresence>
            {showStorageWarning && (
              <StorageWarning
                storageInfo={storageInfo}
                onCleanup={() => console.log('Opening cleanup dialog')}
                onDismiss={() => setShowStorageWarning(false)}
              />
            )}
          </AnimatePresence>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
            <button
              onClick={() => {
                setActiveTab('installed');
                setSelectedModels([]);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                activeTab === 'installed' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Server" size={16} className="mr-2 inline" />
              Installed ({filteredInstalledModels.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('available');
                setSelectedModels([]);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                activeTab === 'available' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Download" size={16} className="mr-2 inline" />
              Available ({filteredAvailableModels.length})
            </button>
          </div>

          {/* Filters */}
          <ModelFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />

          {/* Models Grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeTab === 'installed' ? (
              filteredInstalledModels.length > 0 ? (
                filteredInstalledModels.map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ModelCard
                      model={model}
                      type="installed"
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Icon name="Server" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    No installed models found
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchQuery || selectedType !== 'all' || selectedSize !== 'all' ?'Try adjusting your filters to see more models.' :'Download models from the Available tab to get started.'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('available')}
                    iconName="Download"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Browse Available Models
                  </Button>
                </div>
              )
            ) : (
              filteredAvailableModels.length > 0 ? (
                filteredAvailableModels.map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ModelCard
                      model={model}
                      type="available"
                      onDownload={handleDownload}
                      downloadProgress={downloadProgress}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Icon name="Search" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    No models found
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Try adjusting your search or filter criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    iconName="RotateCcw"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Clear Filters
                  </Button>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedModels.length > 0 && (
          <BulkActions
            selectedModels={selectedModels}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkDelete={handleBulkDelete}
            onBulkUpdate={handleBulkUpdate}
            totalModels={currentModels.length}
            isAllSelected={isAllSelected}
          />
        )}
      </AnimatePresence>

      {/* Model Details Modal */}
      <ModelDetailsModal
        model={selectedModelDetails}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedModelDetails(null);
        }}
      />
    </div>
  );
};

export default ModelManagement;