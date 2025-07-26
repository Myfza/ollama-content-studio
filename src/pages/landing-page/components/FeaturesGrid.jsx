import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FeaturesGrid = () => {
  const features = [
    {
      id: 1,
      icon: 'Shield',
      title: 'Complete Privacy',
      description: `Your content never leaves your device. All AI processing happens locally with zero data transmission to external servers.`,
      benefits: ['No data collection', 'GDPR compliant', 'Offline processing'],
      color: 'text-accent'
    },
    {
      id: 2,
      icon: 'DollarSign',
      title: 'Zero Cost Operation',
      description: `No subscription fees, no API costs, no hidden charges. Once installed, generate unlimited content completely free.`,
      benefits: ['No monthly fees', 'No usage limits', 'One-time setup'],
      color: 'text-success'
    },
    {
      id: 3,
      icon: 'Zap',
      title: 'Lightning Fast',
      description: `Local processing means instant responses without network delays. Generate content at the speed of your hardware.`,
      benefits: ['Sub-second response', 'No network dependency', 'Optimized performance'],
      color: 'text-warning'
    },
    {
      id: 4,
      icon: 'Cpu',
      title: 'Multiple AI Models',
      description: `Choose from 50+ open-source models including Llama, Mistral, and CodeLlama for different content types.`,
      benefits: ['Model variety', 'Specialized models', 'Regular updates'],
      color: 'text-accent'
    },
    {
      id: 5,
      icon: 'FileText',
      title: 'Content Variety',
      description: `Generate blog posts, social media content, product descriptions, emails, and more with specialized templates.`,
      benefits: ['Multiple formats', 'Custom templates', 'SEO optimized'],
      color: 'text-success'
    },
    {
      id: 6,
      icon: 'Smartphone',
      title: 'Cross-Platform',
      description: `Works seamlessly across desktop, tablet, and mobile devices with responsive design and touch optimization.`,
      benefits: ['Mobile responsive', 'Touch friendly', 'Sync across devices'],
      color: 'text-warning'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="features" className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Why Choose Ollama Content Studio?
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
            Experience the future of content creation with privacy-first AI technology that puts you in complete control.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-card border border-border rounded-xl p-8 group hover:shadow-xl hover:border-accent/20 transition-all duration-300 relative overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-secondary rounded-xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Icon 
                    name={feature.icon} 
                    size={32} 
                    className={`${feature.color} group-hover:animate-pulse`}
                  />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl lg:text-2xl font-heading font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground font-body leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits list */}
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                        <span className="font-caption">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-secondary/30 backdrop-blur-sm border border-border rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-4">
              Ready to Transform Your Content Creation?
            </h3>
            <p className="text-muted-foreground font-body mb-6 max-w-2xl mx-auto">
              Join thousands of creators who've discovered the power of private, local AI content generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} className="text-success" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Download" size={16} className="text-success" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="text-success" />
                <span>100% private</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;