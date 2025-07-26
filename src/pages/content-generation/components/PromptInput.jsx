import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../../../components/ui/Button';

const PromptInput = ({ 
  prompt, 
  onPromptChange, 
  contentType, 
  isGenerating, 
  onGenerate,
  advancedSettings,
  onAdvancedSettingsChange 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getPlaceholderText = () => {
    switch (contentType) {
      case 'blog':
        return "Write a comprehensive blog post about sustainable living practices that can help reduce carbon footprint...";
      case 'social':
        return "Create an engaging social media post about the benefits of remote work for both employees and companies...";
      case 'product':
        return "Write a compelling product description for a wireless noise-canceling headphone with 30-hour battery life...";
      default:
        return "Enter your content prompt here...";
    }
  };

  const maxLength = 2000;
  const characterCount = prompt.length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Content Prompt
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          iconSize={16}
        >
          Advanced
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={getPlaceholderText()}
            disabled={isGenerating}
            className="w-full h-32 md:h-40 p-4 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            maxLength={maxLength}
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            {characterCount}/{maxLength}
          </div>
        </div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-lg p-4 space-y-4"
            >
              <h3 className="font-heading font-medium text-foreground mb-3">
                Advanced Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Temperature: {advancedSettings.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={advancedSettings.temperature}
                    onChange={(e) => onAdvancedSettingsChange({
                      ...advancedSettings,
                      temperature: parseFloat(e.target.value)
                    })}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Tokens: {advancedSettings.maxTokens}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={advancedSettings.maxTokens}
                    onChange={(e) => onAdvancedSettingsChange({
                      ...advancedSettings,
                      maxTokens: parseInt(e.target.value)
                    })}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Short</span>
                    <span>Long</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Top P: {advancedSettings.topP}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={advancedSettings.topP}
                    onChange={(e) => onAdvancedSettingsChange({
                      ...advancedSettings,
                      topP: parseFloat(e.target.value)
                    })}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Repeat Penalty: {advancedSettings.repeatPenalty}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={advancedSettings.repeatPenalty}
                    onChange={(e) => onAdvancedSettingsChange({
                      ...advancedSettings,
                      repeatPenalty: parseFloat(e.target.value)
                    })}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPromptChange('')}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
              disabled={!prompt || isGenerating}
            >
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Lightbulb"
              iconPosition="left"
              iconSize={16}
            >
              Suggestions
            </Button>
          </div>

          <Button
            variant="default"
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            loading={isGenerating}
            iconName="Zap"
            iconPosition="left"
            iconSize={16}
            className="bg-accent hover:bg-accent/90"
          >
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;