import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import StatisticsSection from './components/StatisticsSection';
import FeaturesGrid from './components/FeaturesGrid';
import TestimonialsSection from './components/TestimonialsSection';
import FinalCTASection from './components/FinalCTASection';
import LandingHeader from './components/LandingHeader';
import LandingFooter from './components/LandingFooter';

const LandingPage = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = 'Ollama Content Studio - Privacy-First AI Content Generation';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Generate unlimited content with local AI models. No API costs, no data sharing, complete privacy control. The future of content creation is private and free.');
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
    >
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* Statistics Section */}
        <StatisticsSection />

        {/* Features Grid */}
        <FeaturesGrid />

        {/* Testimonials Section */}
        <div id="testimonials">
          <TestimonialsSection />
        </div>

        {/* Final CTA Section */}
        <div id="pricing">
          <FinalCTASection />
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-100 w-12 h-12 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        style={{
          display: 'none'
        }}
        onLoad={(e) => {
          const button = e.target;
          const handleScroll = () => {
            if (window.scrollY > 500) {
              button.style.display = 'flex';
            } else {
              button.style.display = 'none';
            }
          };
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default LandingPage;