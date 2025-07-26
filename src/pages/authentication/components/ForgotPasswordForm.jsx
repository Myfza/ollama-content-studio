import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ForgotPasswordForm = ({ onBackToLogin, loading, setLoading }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setLoading(true);
    
    try {
      // Mock password reset request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      setErrors({
        submit: 'Failed to send reset email. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="Mail" size={32} className="text-success" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Check your email
          </h3>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to
          </p>
          <p className="text-sm font-medium text-foreground">
            {email}
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            variant="outline"
            fullWidth
            onClick={onBackToLogin}
          >
            Back to Sign In
          </Button>
          
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
            className="text-sm text-accent hover:text-accent/80 transition-colors duration-150"
          >
            Didn't receive the email? Try again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Reset your password
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => handleInputChange(e.target.value)}
          error={errors.email}
          required
          disabled={loading}
        />

        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-error/10 border border-error/20 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error">{errors.submit}</span>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
            className="bg-gradient-to-r from-accent to-purple-600 hover:from-accent/90 hover:to-purple-600/90"
          >
            Send Reset Link
          </Button>

          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={onBackToLogin}
            disabled={loading}
          >
            Back to Sign In
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordForm;