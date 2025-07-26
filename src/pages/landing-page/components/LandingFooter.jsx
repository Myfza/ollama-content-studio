import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LandingFooter = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Content Generation', path: '/content-generation' },
        { label: 'Model Management', path: '/model-management' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Contact', href: '#contact' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#docs' },
        { label: 'API Reference', href: '#api' },
        { label: 'Community', href: '#community' },
        { label: 'Support', href: '#support' },
      ]
    },
    {
      title: 'Connect',
      links: [
        { label: 'GitHub', href: 'https://github.com', external: true },
        { label: 'Discord', href: 'https://discord.com', external: true },
        { label: 'Twitter', href: 'https://twitter.com', external: true },
        { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
      ]
    }
  ];

  const handleLinkClick = (link) => {
    if (link.external) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
    } else if (link.path) {
      navigate(link.path);
    } else if (link.href) {
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand section */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={handleLogoClick}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-xl shadow-lg">
                  <Icon name="Zap" size={28} color="white" />
                </div>
                <div>
                  <span className="font-heading font-bold text-2xl text-foreground">
                    Ollama Content Studio
                  </span>
                  <div className="text-sm text-muted-foreground font-caption">
                    Privacy-First AI Content Generation
                  </div>
                </div>
              </motion.div>

              <p className="text-muted-foreground font-body leading-relaxed max-w-md">
                Create unlimited content with local AI models. No subscriptions, no data sharing, 
                complete privacy control. The future of content creation is private and free.
              </p>

              {/* Key features */}
              <div className="space-y-3">
                {[
                  { icon: 'Shield', text: '100% Private Processing' },
                  { icon: 'DollarSign', text: 'Zero Cost Operation' },
                  { icon: 'Wifi', text: 'Works Offline' }
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center space-x-3">
                    <Icon name={feature.icon} size={16} className="text-accent" />
                    <span className="text-sm text-muted-foreground font-caption">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer links */}
            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {footerSections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="font-heading font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <button
                          onClick={() => handleLinkClick(link)}
                          className="text-muted-foreground hover:text-accent transition-colors duration-200 font-caption text-sm flex items-center space-x-1 group"
                        >
                          <span>{link.label}</span>
                          {link.external && (
                            <Icon 
                              name="ExternalLink" 
                              size={12} 
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                            />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground font-caption">
              © {currentYear} Ollama Content Studio. All rights reserved.
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              {[
                { name: 'GitHub', icon: 'Github' },
                { name: 'Discord', icon: 'MessageCircle' },
                { name: 'Twitter', icon: 'Twitter' },
                { name: 'LinkedIn', icon: 'Linkedin' }
              ].map((social) => (
                <motion.button
                  key={social.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-secondary hover:bg-accent rounded-lg flex items-center justify-center transition-colors duration-200 group"
                  title={social.name}
                >
                  <Icon 
                    name={social.icon} 
                    size={18} 
                    className="text-muted-foreground group-hover:text-accent-foreground transition-colors duration-200" 
                  />
                </motion.button>
              ))}
            </div>

            {/* Privacy badges */}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={12} className="text-success" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={12} className="text-success" />
                <span>Privacy First</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;