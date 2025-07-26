import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FinalCTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/authentication');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  const features = [
    { icon: 'Shield', text: 'Complete Privacy' },
    { icon: 'DollarSign', text: 'Zero Cost' },
    { icon: 'Zap', text: 'Instant Setup' },
    { icon: 'Clock', text: '24/7 Availability' }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-accent/10 via-background to-secondary/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-accent/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/20 rounded-full blur-xl"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Main heading */}
          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-heading font-bold text-foreground leading-tight"
            >
              Start Creating Content
              <span className="block text-accent">The Private Way</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed"
            >
              Join thousands of content creators who've discovered the power of local AI processing. 
              No subscriptions, no data sharing, unlimited creativity.
            </motion.p>
          </div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 lg:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm border border-border px-4 py-3 rounded-full"
              >
                <Icon name={feature.icon} size={18} className="text-accent" />
                <span className="font-caption font-medium text-foreground">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Button
              variant="default"
              size="xl"
              onClick={handleGetStarted}
              iconName="ArrowRight"
              iconPosition="right"
              iconSize={24}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-xl font-caption font-bold shadow-2xl hover:shadow-accent/25 transform hover:scale-105 transition-all duration-300"
            >
              Get Started Free
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              onClick={handleViewDashboard}
              iconName="Eye"
              iconPosition="left"
              iconSize={24}
              className="px-12 py-6 text-xl font-caption font-bold border-2 hover:bg-secondary/50 hover:border-accent transition-all duration-300"
            >
              View Demo
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="pt-12 space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-success" />
                <span>Setup in under 5 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Download" size={16} className="text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span>100% privacy guaranteed</span>
              </div>
            </div>

            {/* Final stats */}
            <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl lg:text-3xl font-heading font-bold text-accent">
                    25,000+
                  </div>
                  <div className="text-sm text-muted-foreground font-caption">
                    Active Users
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl lg:text-3xl font-heading font-bold text-success">
                    1.2M+
                  </div>
                  <div className="text-sm text-muted-foreground font-caption">
                    Content Generated
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl lg:text-3xl font-heading font-bold text-warning">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground font-caption">
                    Privacy Score
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default FinalCTASection;