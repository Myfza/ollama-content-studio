import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, AlertCircle, CheckCircle, Loader2, Settings, ExternalLink, RefreshCw } from "lucide-react";
import ollamaAPI from "../../../utils/ollamaService";

const OllamaStatusIndicator = ({ showDetails = true, className = "" }) => {
  const [status, setStatus] = useState({
    connected: false,
    loading: true,
    error: null,
    models: [],
    lastChecked: null
  });
  const [showModal, setShowModal] = useState(false);

  const checkOllamaStatus = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const healthResult = await ollamaAPI.checkHealth();
      const modelsResult = await ollamaAPI.getAvailableModels();
      
      setStatus({
        connected: healthResult.success,
        loading: false,
        error: healthResult.success ? null : healthResult.error,
        models: modelsResult.success ? modelsResult.models : [],
        lastChecked: new Date()
      });
    } catch (error) {
      setStatus({
        connected: false,
        loading: false,
        error: "Failed to check Ollama status",
        models: [],
        lastChecked: new Date()
      });
    }
  };

  useEffect(() => {
    checkOllamaStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkOllamaStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    if (status.loading) {
      return {
        icon: <Loader2 className="animate-spin" size={20} />,
        text: "Checking...",
        color: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/20"
      };
    }

    if (status.connected) {
      return {
        icon: <CheckCircle size={20} />,
        text: status.models.length > 0 
          ? `Connected (${status.models.length} models)` 
          : "Connected",
        color: "text-success",
        bgColor: "bg-success/10",
        borderColor: "border-success/20"
      };
    }

    return {
      icon: <AlertCircle size={20} />,
      text: "Disconnected",
      color: "text-error",
      bgColor: "bg-error/10",
      borderColor: "border-error/20"
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative ${className}`}
      >
        <div className={`flex items-center space-x-3 p-4 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
          <div className={`${statusInfo.color}`}>
            {statusInfo.icon}
          </div>
          
          {showDetails && (
            <>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${statusInfo.color}`}>
                    Ollama Status
                  </span>
                  <button
                    onClick={checkOllamaStatus}
                    disabled={status.loading}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RefreshCw size={14} className={status.loading ? "animate-spin" : ""} />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {statusInfo.text}
                </p>
                {status.lastChecked && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last checked: {status.lastChecked.toLocaleTimeString()}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {!status.connected && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-1 text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                  >
                    <Settings size={16} />
                    <span>Setup</span>
                  </motion.button>
                )}
                
                <a
                  href="http://localhost:11434"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 border border-border"
            >
              <div className="flex items-center space-x-3 mb-4">
                <WifiOff className="text-error" size={24} />
                <h3 className="text-lg font-semibold text-foreground">
                  Ollama Setup Required
                </h3>
              </div>
              
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Ollama is not running or not accessible. To use AI content generation:
                </p>
                
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    <strong>Install Ollama:</strong> Visit{" "}
                    <a 
                      href="https://ollama.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 underline"
                    >
                      ollama.com
                    </a>{" "}
                    to download and install
                  </li>
                  <li>
                    <strong>Start Ollama:</strong> Run <code className="bg-muted px-1 rounded">ollama serve</code> in your terminal
                  </li>
                  <li>
                    <strong>Pull a model:</strong> Run <code className="bg-muted px-1 rounded">ollama pull llama2</code>
                  </li>
                  <li>
                    <strong>Verify:</strong> Visit{" "}
                    <a 
                      href="http://localhost:11434" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 underline"
                    >
                      localhost:11434
                    </a>{" "}
                    in your browser
                  </li>
                </ol>
                
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mt-4">
                  <p className="text-warning font-medium">
                    💡 Benefits of local AI with Ollama:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                    <li>100% free - no API costs</li>
                    <li>Complete privacy - data stays local</li>
                    <li>Works offline</li>
                    <li>No rate limits</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    checkOllamaStatus();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Check Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OllamaStatusIndicator;