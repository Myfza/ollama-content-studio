import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import ContentTypeSelector from './components/ContentTypeSelector';
import ModelSelector from './components/ModelSelector';
import PromptInput from './components/PromptInput';
import GenerationOutput from './components/GenerationOutput';
import GenerationQueue from './components/GenerationQueue';
import ConnectionStatus from './components/ConnectionStatus';

const ContentGeneration = () => {
  // Core state
  const [selectedContentType, setSelectedContentType] = useState('blog');
  const [selectedModel, setSelectedModel] = useState('llama2');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  // Advanced settings
  const [advancedSettings, setAdvancedSettings] = useState({
    temperature: 0.7,
    maxTokens: 1000,
    topP: 0.9,
    repeatPenalty: 1.1
  });

  // Generation queue
  const [generationQueue, setGenerationQueue] = useState([
    {
      id: '1',
      contentType: 'blog',
      model: 'llama2',
      prompt: 'Write about sustainable living practices',
      status: 'completed',
      progress: 100,
      completedAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: '2',
      contentType: 'social',
      model: 'mistral',
      prompt: 'Create a post about remote work benefits',
      status: 'generating',
      progress: 45,
      estimatedTime: 120
    },
    {
      id: '3',
      contentType: 'product',
      model: 'neural-chat',
      prompt: 'Describe wireless headphones',
      status: 'failed',
      error: 'Model not available'
    }
  ]);

  // Simulate connection status changes
  useEffect(() => {
    const checkConnection = () => {
      const statuses = ['connected', 'connecting', 'disconnected'];
      const weights = [0.7, 0.2, 0.1]; // Higher chance of being connected
      const random = Math.random();
      let cumulativeWeight = 0;
      
      for (let i = 0; i < statuses.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
          setConnectionStatus(statuses[i]);
          break;
        }
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  // Simulate streaming generation
  const simulateStreaming = (content) => {
    const words = content.split(' ');
    let currentIndex = 0;
    setStreamingText('');
    setGenerationProgress(0);

    const streamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        const currentText = words.slice(0, currentIndex + 1).join(' ');
        setStreamingText(currentText);
        setGenerationProgress(Math.round((currentIndex / words.length) * 100));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setGeneratedContent(streamingText);
        setStreamingText('');
        setIsGenerating(false);
        setGenerationProgress(100);
      }
    }, 100);

    return streamInterval;
  };

  const handleGenerate = () => {
    if (!prompt.trim() || connectionStatus !== 'connected') return;

    setIsGenerating(true);
    setGeneratedContent('');
    setGenerationProgress(0);

    // Mock generated content based on content type
    const mockContent = {
      blog: `# Sustainable Living: A Comprehensive Guide to Reducing Your Carbon Footprint\n\nSustainable living has become more than just a trend—it's a necessity for our planet's future. As climate change continues to impact our world, individuals are seeking practical ways to reduce their environmental impact while maintaining a comfortable lifestyle.\n\n## Understanding Your Carbon Footprint\n\nYour carbon footprint represents the total amount of greenhouse gases produced directly and indirectly by your activities. The average American generates about 16 tons of CO2 annually, significantly higher than the global average of 4 tons per person.\n\n## Simple Changes, Big Impact\n\n### Energy Consumption\n- Switch to LED bulbs, which use 75% less energy than incandescent bulbs\n- Unplug electronics when not in use to eliminate phantom energy draw\n- Consider renewable energy sources like solar panels for long-term savings\n\n### Transportation Choices\n- Walk, bike, or use public transportation when possible\n- Combine errands into single trips to reduce fuel consumption\n- Consider electric or hybrid vehicles for your next car purchase\n\n### Sustainable Food Practices\n- Reduce meat consumption, particularly beef, which has a high carbon footprint\n- Buy local and seasonal produce to minimize transportation emissions\n- Start a home garden to grow your own vegetables and herbs\n\n## The Ripple Effect\n\nWhen you adopt sustainable practices, you inspire others to do the same. Share your journey on social media, discuss your experiences with friends and family, and lead by example. Small individual actions, when multiplied across communities, create significant environmental impact.\n\nRemember, sustainable living isn't about perfection—it's about making conscious choices that collectively contribute to a healthier planet for future generations.`,
      
      social: `🌱 Making small changes for a BIG environmental impact! 🌍\n\nJust switched to LED bulbs throughout my home and I'm amazed by the difference! Not only are they using 75% less energy, but my electricity bill has already started dropping. 💡✨\n\nHere are 3 simple swaps I've made this month:\n✅ LED bulbs (saving $75/year!)\n✅ Reusable water bottles (goodbye plastic waste!)\n✅ Biking to work twice a week (hello endorphins!)\n\nWhat sustainable swaps have you made recently? Drop them in the comments! 👇\n\n#SustainableLiving #EcoFriendly #ClimateAction #GreenLiving #Sustainability #EnvironmentallyFriendly #EcoTips #GoGreen #SustainableLifestyle #ClimateChange`,
      
      product: `**Premium Wireless Noise-Canceling Headphones - Experience Audio Like Never Before**\n\nImmerse yourself in crystal-clear sound with our flagship wireless headphones, engineered for audiophiles and everyday listeners alike. Featuring industry-leading active noise cancellation technology, these headphones create your personal sound sanctuary wherever you go.\n\n**Key Features:**\n• **30-Hour Battery Life** - All-day listening with quick 15-minute charge for 3 hours of playback\n• **Advanced Noise Cancellation** - Block out distractions with adaptive ANC technology\n• **Premium Audio Quality** - Custom 40mm drivers deliver rich bass and crisp highs\n• **Comfortable Design** - Memory foam ear cushions and adjustable headband for extended wear\n• **Smart Controls** - Touch-sensitive controls and voice assistant integration\n• **Multi-Device Connectivity** - Seamlessly switch between phone, laptop, and tablet\n\n**Perfect For:**\n- Commuters seeking peace during travel\n- Remote workers needing focus\n- Music enthusiasts demanding quality\n- Frequent travelers requiring comfort\n\n**What's Included:**\n- Premium wireless headphones\n- USB-C charging cable\n- 3.5mm audio cable\n- Protective carrying case\n- Quick start guide\n\n**30-Day Money-Back Guarantee** - Experience the difference risk-free. If you're not completely satisfied, return for a full refund.\n\nTransform your audio experience today. Your ears will thank you.`
    };

    const content = mockContent[selectedContentType] || mockContent.blog;
    
    // Add to queue
    const newQueueItem = {
      id: Date.now().toString(),
      contentType: selectedContentType,
      model: selectedModel,
      prompt: prompt,
      status: 'generating',
      progress: 0,
      estimatedTime: Math.floor(content.split(' ').length / 10) // Rough estimate
    };

    setGenerationQueue(prev => [newQueueItem, ...prev]);

    // Start streaming simulation
    setTimeout(() => {
      simulateStreaming(content);
    }, 1000);
  };

  const handleRegenerate = () => {
    if (generatedContent || streamingText) {
      handleGenerate();
    }
  };

  const handleSave = () => {
    const contentToSave = streamingText || generatedContent;
    if (contentToSave) {
      // Mock save functionality
      console.log('Saving content:', contentToSave);
      // In a real app, this would save to a database or local storage
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text:', err);
      return false;
    }
  };

  const handleRetryConnection = () => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus(Math.random() > 0.3 ? 'connected' : 'disconnected');
    }, 2000);
  };

  const handleOpenTroubleshooting = () => {
    // Mock opening troubleshooting modal or guide
    console.log('Opening troubleshooting guide...');
  };

  const handleCancelGeneration = (queueId) => {
    setGenerationQueue(prev => 
      prev.map(item => 
        item.id === queueId 
          ? { ...item, status: 'cancelled' }
          : item
      )
    );
    
    if (isGenerating) {
      setIsGenerating(false);
      setStreamingText('');
      setGenerationProgress(0);
    }
  };

  const handleRetryGeneration = (queueId) => {
    setGenerationQueue(prev => 
      prev.map(item => 
        item.id === queueId 
          ? { ...item, status: 'queued', progress: 0 }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="md:ml-60 pt-16 pb-20 md:pb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumb />
            
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Content Generation
              </h1>
              <p className="text-muted-foreground">
                Create AI-powered content with local Ollama models - completely private and free
              </p>
            </div>

            <ConnectionStatus 
              status={connectionStatus}
              onRetryConnection={handleRetryConnection}
              onOpenTroubleshooting={handleOpenTroubleshooting}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ContentTypeSelector 
                  selectedType={selectedContentType}
                  onTypeSelect={setSelectedContentType}
                />

                <ModelSelector 
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                  connectionStatus={connectionStatus}
                />

                <PromptInput 
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  contentType={selectedContentType}
                  isGenerating={isGenerating}
                  onGenerate={handleGenerate}
                  advancedSettings={advancedSettings}
                  onAdvancedSettingsChange={setAdvancedSettings}
                />
              </div>

              <div className="lg:col-span-1">
                <GenerationQueue 
                  queue={generationQueue}
                  onCancelGeneration={handleCancelGeneration}
                  onRetryGeneration={handleRetryGeneration}
                />
              </div>
            </div>

            <GenerationOutput 
              generatedContent={generatedContent}
              isGenerating={isGenerating}
              onRegenerate={handleRegenerate}
              onSave={handleSave}
              onCopy={handleCopy}
              streamingText={streamingText}
              generationProgress={generationProgress}
            />
          </motion.div>
        </div>
      </main>

      <QuickActionButton 
        onAction={handleGenerate}
        loading={isGenerating}
        disabled={!prompt.trim() || connectionStatus !== 'connected'}
      />
    </div>
  );
};

export default ContentGeneration;