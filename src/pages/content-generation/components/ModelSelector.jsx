import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Brain, Zap, Download, AlertCircle, Loader2 } from "lucide-react";
import ollamaAPI from "../../../utils/ollamaService";

const ModelSelector = ({ 
  selectedModel, 
  onModelSelect, 
  className = "",
  showDetails = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ollamaAPI.getAvailableModels();
      
      if (result.success && result.models.length > 0) {
        setModels(result.models);
        
        // Auto-select first model if none selected
        if (!selectedModel && result.models.length > 0) {
          onModelSelect(result.models[0].name);
        }
      } else {
        setError("No models found. Please install Ollama models first.");
      }
    } catch (error) {
      setError("Failed to load models");
      console.log("Error loading models:", error);
    } finally {
      setLoading(false);
    }
  };

  const getModelInfo = (modelName) => {
    const model = models.find(m => m.name === modelName);
    if (!model) return null;

    const sizeInGB = (model.size / (1024 * 1024 * 1024)).toFixed(1);
    
    // Determine model characteristics based on name
    const getModelChar = (name) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('code')) return { type: 'Code', icon: '💻', speed: 'Medium' };
      if (lowerName.includes('chat') || lowerName.includes('neural')) return { type: 'Chat', icon: '💬', speed: 'Fast' };
      if (lowerName.includes('llama2:13b') || lowerName.includes('13b')) return { type: 'Large', icon: '🧠', speed: 'Slow' };
      if (lowerName.includes('mistral')) return { type: 'General', icon: '⚡', speed: 'Fast' };
      if (lowerName.includes('mini') || lowerName.includes('3b')) return { type: 'Compact', icon: '🚀', speed: 'Ultra Fast' };
      return { type: 'General', icon: '🤖', speed: 'Medium' };
    };

    const characteristics = getModelChar(modelName);
    
    return {
      ...model,
      sizeGB: sizeInGB,
      ...characteristics
    };
  };

  const selectedModelInfo = getModelInfo(selectedModel);

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-foreground">
          AI Model
        </label>
        <div className="flex items-center space-x-3 p-3 bg-input border border-border rounded-lg">
          <Loader2 className="animate-spin text-muted-foreground" size={20} />
          <span className="text-muted-foreground">Loading models...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-foreground">
          AI Model
        </label>
        <div className="flex items-center justify-between p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-error" size={20} />
            <div>
              <span className="text-error font-medium">No Models Available</span>
              <p className="text-xs text-error/80 mt-1">
                Install Ollama and pull models to get started
              </p>
            </div>
          </div>
          <button
            onClick={loadModels}
            className="text-accent hover:text-accent/80 font-medium text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-foreground">
        AI Model
      </label>
      
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-input border border-border rounded-lg hover:border-accent/50 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-colors"
          whileTap={{ scale: 0.995 }}
        >
          <div className="flex items-center space-x-3">
            {selectedModelInfo ? (
              <>
                <span className="text-lg">{selectedModelInfo.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-foreground">
                    {selectedModel}
                  </div>
                  {showDetails && (
                    <div className="text-xs text-muted-foreground">
                      {selectedModelInfo.type} • {selectedModelInfo.sizeGB}GB • {selectedModelInfo.speed}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Brain className="text-muted-foreground" size={20} />
                <span className="text-muted-foreground">Select a model</span>
              </>
            )}
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-muted-foreground" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto"
              >
                <div className="p-2">
                  {models.map((model) => {
                    const modelInfo = getModelInfo(model.name);
                    const isSelected = selectedModel === model.name;
                    
                    return (
                      <motion.button
                        key={model.name}
                        type="button"
                        onClick={() => {
                          onModelSelect(model.name);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{modelInfo?.icon}</span>
                          <div className="text-left">
                            <div className={`font-medium ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                              {model.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {modelInfo?.type} • {modelInfo?.sizeGB}GB
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1 text-xs">
                                <Zap size={12} />
                                <span className={`
                                  ${modelInfo?.speed === 'Ultra Fast' ? 'text-success' : 
                                    modelInfo?.speed === 'Fast'? 'text-warning' : 'text-muted-foreground'}
                                `}>
                                  {modelInfo?.speed}
                                </span>
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {new Date(model.modified_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isSelected && (
                            <Check size={16} className="text-accent" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                
                {models.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    <Download size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No models installed</p>
                    <p className="text-xs mt-1">
                      Run <code className="bg-muted px-1 rounded">ollama pull llama2</code> to get started
                    </p>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Model recommendation */}
      {selectedModelInfo && showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 border border-border/50"
        >
          <div className="flex items-start space-x-2">
            <span className="text-accent">💡</span>
            <div>
              <p className="font-medium text-foreground mb-1">Model Info:</p>
              <p>
                This {selectedModelInfo.type.toLowerCase()} model is optimized for {
                  selectedModelInfo.type === 'Code' ? 'programming tasks and code generation' :
                  selectedModelInfo.type === 'Chat' ? 'conversational AI and dialogue' :
                  selectedModelInfo.type === 'Large' ? 'complex reasoning and detailed responses' :
                  selectedModelInfo.type === 'Compact'? 'fast responses with lower resource usage' : 'general-purpose content creation'
                }.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ModelSelector;