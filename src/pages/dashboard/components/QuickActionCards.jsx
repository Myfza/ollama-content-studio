import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCards = () => {
  const navigate = useNavigate();

  const actionCards = [
    {
      id: 1,
      title: "Blog Posts",
      description: "Create engaging articles and blog content",
      icon: "FileText",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
      generationCount: 23,
      lastUsed: "2 hours ago"
    },
    {
      id: 2,
      title: "Social Media",
      description: "Generate posts for Twitter, LinkedIn, and more",
      icon: "Share2",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
      generationCount: 15,
      lastUsed: "1 day ago"
    },
    {
      id: 3,
      title: "Product Descriptions",
      description: "Craft compelling product copy and descriptions",
      icon: "Package",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
      generationCount: 9,
      lastUsed: "3 days ago"
    }
  ];

  const handleCardClick = (cardType) => {
    navigate('/content-generation', { state: { contentType: cardType } });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Quick Actions
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/content-generation')}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actionCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`bg-card rounded-lg p-6 border ${card.borderColor} ${card.bgColor} cursor-pointer hover:shadow-lg transition-all duration-300`}
            onClick={() => handleCardClick(card.title.toLowerCase().replace(' ', '-'))}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${card.bgColor} border ${card.borderColor}`}>
                <Icon name={card.icon} size={24} className={card.color} />
              </div>
              <div className="text-right">
                <div className="text-sm font-caption font-semibold text-foreground">
                  {card.generationCount}
                </div>
                <div className="text-xs text-muted-foreground">
                  generated
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body">
                {card.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Last used: {card.lastUsed}
              </span>
              <div className="flex items-center space-x-1">
                <Icon name="ArrowRight" size={16} className={card.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCards;