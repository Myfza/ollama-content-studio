import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Content Marketing Manager',
      company: 'TechStart Inc.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: `Ollama Content Studio has revolutionized our content creation process. The privacy aspect is crucial for our enterprise clients, and the quality of generated content is exceptional.`,
      rating: 5,
      highlight: 'Privacy-first approach'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Freelance Writer',
      company: 'Independent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: `As a freelancer, the zero-cost model is a game-changer. I can generate unlimited content without worrying about API costs eating into my profits. The local processing is incredibly fast.`,
      rating: 5,
      highlight: 'Zero cost operation'
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'Digital Marketing Director',
      company: 'Creative Agency',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: `The variety of AI models available is impressive. We use different models for different content types - blog posts, social media, product descriptions. Each one delivers exactly what we need.`,
      rating: 5,
      highlight: 'Multiple AI models'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Small Business Owner',
      company: 'Local Retail',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: `Perfect for small businesses like mine. No monthly subscriptions, works offline, and generates professional content that rivals expensive copywriting services.`,
      rating: 5,
      highlight: 'Small business friendly'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'Privacy Advocate',
      company: 'Non-Profit',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      content: `Finally, an AI tool that respects user privacy. No data collection, no cloud processing, complete control over our content. This is how AI should be done.`,
      rating: 5,
      highlight: 'Privacy focused'
    },
    {
      id: 6,
      name: 'Alex Johnson',
      role: 'Tech Blogger',
      company: 'Independent',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
      content: `The setup was surprisingly easy, and the performance is outstanding. I can generate blog posts, social media content, and even technical documentation without any internet dependency.`,
      rating: 5,
      highlight: 'Easy setup'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <section className="py-16 lg:py-24 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Loved by Content Creators
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
            See what our users are saying about their experience with privacy-first AI content generation.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-card border border-border rounded-xl p-6 group hover:shadow-xl hover:border-accent/20 transition-all duration-300 relative overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground font-body leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Highlight badge */}
                <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-caption font-medium">
                  <Icon name="Star" size={12} />
                  <span>{testimonial.highlight}</span>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-4 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-caption font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Icon name="Quote" size={24} className="text-accent" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-heading font-bold text-accent">4.9/5</div>
                <div className="text-sm text-muted-foreground font-caption">Average Rating</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-heading font-bold text-success">98%</div>
                <div className="text-sm text-muted-foreground font-caption">Satisfaction Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-heading font-bold text-warning">25K+</div>
                <div className="text-sm text-muted-foreground font-caption">Happy Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-heading font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground font-caption">Privacy Guaranteed</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;