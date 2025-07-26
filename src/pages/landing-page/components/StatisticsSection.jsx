import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const StatisticsSection = () => {
  const statistics = [
    {
      id: 1,
      icon: 'Users',
      value: '25,000+',
      label: 'Active Users',
      description: 'Content creators trust our platform',
      color: 'text-accent'
    },
    {
      id: 2,
      icon: 'FileText',
      value: '1.2M+',
      label: 'Content Generated',
      description: 'Blog posts, social media, and more',
      color: 'text-success'
    },
    {
      id: 3,
      icon: 'Shield',
      value: '100%',
      label: 'Privacy Score',
      description: 'Zero data sharing guarantee',
      color: 'text-warning'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Trusted by Content Creators Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Join thousands of users who've discovered the power of private, local AI content generation.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {statistics.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="bg-card border border-border rounded-xl p-8 text-center group hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon 
                    name={stat.icon} 
                    size={32} 
                    className={`${stat.color} group-hover:animate-pulse`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl lg:text-5xl font-heading font-bold text-foreground"
                >
                  {stat.value}
                </motion.div>
                
                <h3 className="text-xl font-caption font-semibold text-foreground">
                  {stat.label}
                </h3>
                
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="mt-6 h-1 w-12 bg-gradient-to-r from-accent to-secondary mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional metrics row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: '99.9%', label: 'Uptime' },
            { value: '< 2s', label: 'Response Time' },
            { value: '50+', label: 'AI Models' },
            { value: '24/7', label: 'Local Processing' }
          ].map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="text-2xl font-heading font-bold text-accent">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground font-caption">
                {metric.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection;