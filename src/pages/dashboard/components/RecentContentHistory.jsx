import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentContentHistory = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState(null);

  const recentContent = [
    {
      id: 1,
      type: "Blog Post",
      title: "10 Tips for Better Content Marketing",
      preview: "Content marketing has evolved significantly over the past decade. Today's successful marketers understand that creating valuable, engaging content requires...",
      fullContent: `Content marketing has evolved significantly over the past decade. Today's successful marketers understand that creating valuable, engaging content requires a deep understanding of audience needs, strategic planning, and consistent execution.\n\nHere are the key strategies that top marketers use to create content that resonates with their audience and drives meaningful engagement.`,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      model: "llama2:7b",
      wordCount: 847,
      icon: "FileText",
      color: "text-blue-400"
    },
    {
      id: 2,
      type: "Social Media",
      title: "LinkedIn Post about AI Innovation",
      preview: "🚀 The future of AI is here! Just witnessed an incredible breakthrough in natural language processing that will change how we interact with technology...",
      fullContent: `🚀 The future of AI is here! Just witnessed an incredible breakthrough in natural language processing that will change how we interact with technology.\n\n✨ Key highlights:\n• 40% improvement in understanding context\n• Real-time processing capabilities\n• Privacy-first approach\n\nWhat excites you most about AI's potential? Share your thoughts below! 👇\n\n#AI #Innovation #Technology #Future`,
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      model: "mistral:7b",
      wordCount: 89,
      icon: "Share2",
      color: "text-green-400"
    },
    {
      id: 3,
      type: "Product Description",
      title: "Wireless Bluetooth Headphones",
      preview: "Experience premium sound quality with our latest wireless Bluetooth headphones. Featuring advanced noise cancellation technology and 30-hour battery life...",
      fullContent: `Experience premium sound quality with our latest wireless Bluetooth headphones. Featuring advanced noise cancellation technology and 30-hour battery life, these headphones are perfect for music lovers and professionals alike.\n\nKey Features:\n• Active Noise Cancellation (ANC)\n• 30-hour battery life\n• Quick charge: 15 minutes = 3 hours playback\n• Premium leather comfort padding\n• Crystal-clear call quality\n• Compatible with all devices\n\nElevate your audio experience today!`,
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      model: "codellama:7b",
      wordCount: 156,
      icon: "Package",
      color: "text-purple-400"
    },
    {
      id: 4,
      type: "Blog Post",
      title: "Remote Work Best Practices",
      preview: "Working from home has become the new normal for millions of professionals worldwide. While remote work offers flexibility and work-life balance...",
      fullContent: `Working from home has become the new normal for millions of professionals worldwide. While remote work offers flexibility and work-life balance, it also presents unique challenges that require thoughtful solutions.\n\nSuccessful remote workers have developed strategies to maintain productivity, stay connected with their teams, and create boundaries between work and personal life.`,
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      model: "llama2:13b",
      wordCount: 1203,
      icon: "FileText",
      color: "text-blue-400"
    }
  ];

  const handleRegenerate = (item) => {
    navigate('/content-generation', { 
      state: { 
        contentType: item.type.toLowerCase().replace(' ', '-'),
        regenerateContent: item 
      } 
    });
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const toggleExpanded = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Recent Content
        </h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="History"
          iconPosition="left"
          iconSize={16}
        >
          View All History
        </Button>
      </div>

      <div className="space-y-4">
        {recentContent.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-muted`}>
                    <Icon name={item.icon} size={20} className={item.color} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-caption font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {item.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.wordCount} words
                      </span>
                    </div>
                    <h3 className="text-sm font-heading font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRegenerate(item)}
                    iconName="RefreshCw"
                    iconSize={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(item.id)}
                    iconName={expandedItem === item.id ? "ChevronUp" : "ChevronDown"}
                    iconSize={16}
                  />
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-muted-foreground font-body line-clamp-2">
                  {item.preview}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{formatTimeAgo(item.timestamp)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Server" size={12} />
                    <span>{item.model}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Copy"
                    iconSize={14}
                    className="text-xs"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    iconSize={14}
                    className="text-xs"
                  >
                    Export
                  </Button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedItem === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-border bg-muted/30"
                >
                  <div className="p-4">
                    <div className="text-sm text-foreground font-body whitespace-pre-line">
                      {item.fullContent}
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerate(item)}
                        iconName="RefreshCw"
                        iconPosition="left"
                        iconSize={16}
                      >
                        Regenerate
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        iconName="Edit3"
                        iconPosition="left"
                        iconSize={16}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentContentHistory;