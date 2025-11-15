import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import CanvasAnimation from './CanvasAnimation';
import FloatingElements, { FloatingElementsProps } from './FloatingElements';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
  animationType?: 'privacy' | 'matrix' | 'particles' | 'help' | 'roadmap';
  floatingElements?: FloatingElementsProps['elements'];
  className?: string;
}

/**
 * Standardized hero section component for consistent styling across all pages
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  children,
  animationType = 'privacy',
  floatingElements,
  className = ''
}) => {
  return (
    <div className={`hero-section ${className}`}>
      {/* Standardized canvas animation */}
      <CanvasAnimation type={animationType} />
      
      {/* Semi-transparent overlay to ensure text readability */}
      <div className="absolute inset-0 bg-primary opacity-50 z-5"></div>
      
      <div className="hero-content">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Standardized floating elements */}
      {floatingElements && <FloatingElements elements={floatingElements} />}
    </div>
  );
};

export default HeroSection;

