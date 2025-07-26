import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ContentTypeSelector = ({ selectedType, onTypeSelect }) => {
  const contentTypes = [
    {
      id: 'blog',
      name: 'Blog Post',
      description: 'Create engaging blog articles with SEO optimization',
      icon: 'FileText',
      color: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Generate posts for Twitter, LinkedIn, and Instagram',
      icon: 'Share2',
      color: 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      id: 'product',
      name: 'Product Description',
      description: 'Compelling product descriptions for e-commerce',
      icon: 'Package',
      color: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20',
      iconColor: 'text-purple-400'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
        Content Type
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contentTypes.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onTypeSelect(type.id)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedType === type.id
                ? 'border-accent bg-accent/10 shadow-lg'
                : type.color
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${selectedType === type.id ? 'bg-accent text-accent-foreground' : 'bg-secondary'}`}>
                <Icon 
                  name={type.icon} 
                  size={24} 
                  className={selectedType === type.id ? 'text-accent-foreground' : type.iconColor}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  {type.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ContentTypeSelector;