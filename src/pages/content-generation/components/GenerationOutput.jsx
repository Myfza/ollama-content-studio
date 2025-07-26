import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  Download, 
  Share2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Edit3,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

const GenerationOutput = ({ 
  content = "", 
  isGenerating = false, 
  error = null,
  onRegenerate = null,
  metadata = {},
  className = "" 
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (contentRef.current && isGenerating) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content, isGenerating]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(isEditing ? editedContent : content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log("Failed to copy text:", error);
    }
  };

  const handleDownload = () => {
    const textToDownload = isEditing ? editedContent : content;
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-content-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Content',
          text: isEditing ? editedContent : content
        });
      } catch (error) {
        handleCopy(); // Fallback to copy
      }
    } else {
      handleCopy(); // Fallback to copy
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    // Here you could trigger a callback to save the edited content
  };

  const formatContent = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const renderStats = () => {
    const stats = [];
    
    if (metadata?.model) {
      stats.push(`Model: ${metadata.model}`);
    }
    
    if (metadata?.generationTime) {
      const time = metadata.generationTime < 1000 
        ? `${metadata.generationTime}ms`
        : `${(metadata.generationTime / 1000).toFixed(1)}s`;
      stats.push(`Time: ${time}`);
    }
    
    if (content?.length) {
      stats.push(`${content.length} characters`);
      stats.push(`${content.split(' ').length} words`);
    }
    
    return stats;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Generated Content
          </h3>
          {metadata?.fallbackUsed && (
            <p className="text-xs text-warning">
              Primary model failed, used fallback: {metadata.model}
            </p>
          )}
        </div>
        
        {content && !isGenerating && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              title={showPreview ? "Hide preview" : "Show preview"}
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              title="Edit content"
            >
              <Edit3 size={16} />
            </button>
            
            <motion.button
              onClick={handleCopy}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              whileTap={{ scale: 0.95 }}
              title="Copy content"
            >
              {copied ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
            </motion.button>
            
            <button
              onClick={handleDownload}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              title="Download as text file"
            >
              <Download size={16} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
              title="Share content"
            >
              <Share2 size={16} />
            </button>
            
            {onRegenerate && (
              <motion.button
                onClick={onRegenerate}
                className="p-2 text-accent hover:text-accent/80 transition-colors rounded-lg hover:bg-accent/10"
                whileTap={{ scale: 0.95 }}
                title="Regenerate content"
              >
                <RefreshCw size={16} />
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-error/10 border border-error/20 rounded-lg p-6 text-center"
            >
              <AlertCircle className="text-error mx-auto mb-3" size={32} />
              <h4 className="text-error font-medium mb-2">Generation Failed</h4>
              <p className="text-error/80 text-sm mb-4">{error}</p>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center space-x-2 mx-auto bg-error text-white px-4 py-2 rounded-lg hover:bg-error/90 transition-colors"
                >
                  <RefreshCw size={16} />
                  <span>Try Again</span>
                </button>
              )}
            </motion.div>
          ) : isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-lg p-6 min-h-[200px]"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Loader2 className="animate-spin text-accent" size={20} />
                <span className="text-foreground font-medium">Generating content...</span>
              </div>
              
              <div
                ref={contentRef}
                className="bg-input rounded-lg p-4 min-h-[150px] text-foreground whitespace-pre-wrap overflow-y-auto max-h-96 border border-accent/20"
              >
                {content && (
                  <>
                    {formatContent(content)}
                    <motion.span
                      className="inline-block w-2 h-5 bg-accent ml-1"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </>
                )}
              </div>
            </motion.div>
          ) : content ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {isEditing ? (
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Edit Content</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center space-x-1 bg-accent text-white px-3 py-1 rounded text-sm hover:bg-accent/90 transition-colors"
                        >
                          <Save size={14} />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                    
                    <textarea
                      ref={textareaRef}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-64 bg-input border border-border rounded-lg p-4 text-foreground resize-none focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
                      placeholder="Edit your generated content..."
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {showPreview ? (
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }}
                    />
                  ) : (
                    <div className="bg-input rounded-lg p-4 text-foreground whitespace-pre-wrap overflow-y-auto max-h-96 border border-border/50">
                      {formatContent(content)}
                    </div>
                  )}
                </div>
              )}
              
              {/* Stats Footer */}
              {renderStats().length > 0 && (
                <div className="border-t border-border bg-muted/30 px-4 py-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      {renderStats().map((stat, index) => (
                        <span key={index}>{stat}</span>
                      ))}
                    </div>
                    
                    {copied && (
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-success font-medium"
                      >
                        Copied to clipboard!
                      </motion.span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-lg p-12 text-center"
            >
              <div className="text-muted-foreground mb-4">
                <Edit3 size={48} className="mx-auto opacity-50" />
              </div>
              <h4 className="text-foreground font-medium mb-2">Ready to Generate</h4>
              <p className="text-muted-foreground text-sm">
                Your AI-generated content will appear here
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GenerationOutput;