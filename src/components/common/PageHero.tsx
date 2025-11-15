import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
// import Icon from './Icon';

interface FloatingElement {
  icon: LucideIcon;
  text: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay?: number;
  duration?: number;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundType?: 'gradient' | 'solid' | 'animated';
  backgroundImage?: string; // URL to background image
  backgroundImageOpacity?: number; // 0-1, default 0.15
  floatingElements?: FloatingElement[];
  children?: ReactNode;
  className?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  description,
  backgroundType = 'gradient',
  backgroundImage,
  backgroundImageOpacity = 0.15,
  floatingElements = [],
  children,
  className = ''
}) => {
  const getBackgroundClasses = () => {
    switch (backgroundType) {
      case 'gradient':
        return 'bg-gradient-to-br from-primary to-primary-dark dark:from-background-secondary dark:to-background';
      case 'solid':
        return 'bg-primary dark:bg-background-secondary';
      case 'animated':
        return 'bg-primary dark:bg-primary';
      default:
        return 'bg-gradient-to-br from-primary to-primary-dark dark:from-background-secondary dark:to-background';
    }
  };

  return (
    <div className={`relative overflow-hidden ${getBackgroundClasses()} ${className}`}>
      {/* Background image layer (if provided) - behind everything */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: backgroundImageOpacity
          }}
        />
      )}
      
      {/* Gradient overlay for better text readability when using background images */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80 z-[1]"></div>
      )}
      
      {/* Background overlay for animated backgrounds */}
      {backgroundType === 'animated' && !backgroundImage && (
        <div className="absolute inset-0 bg-primary opacity-50 z-[1]"></div>
      )}
      
      {/* Main content container */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight break-words"
            style={{ lineHeight: '1.1', wordWrap: 'break-word', overflowWrap: 'break-word' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              className="text-base md:text-lg lg:text-xl text-white/90 mb-4 leading-relaxed"
              style={{ lineHeight: '1.3', wordWrap: 'break-word', overflowWrap: 'break-word' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}
          
          {description && (
            <motion.p 
              className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed"
              style={{ lineHeight: '1.4', wordWrap: 'break-word', overflowWrap: 'break-word' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
          
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Floating elements */}
      {floatingElements.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {floatingElements.map((element, index) => {
            const Icon = element.icon;
            const positionClasses = Object.entries(element.position)
              .map(([key, value]) => `${key}-[${value}]`)
              .join(' ');
              
            return (
              <motion.div
                key={index}
                className={`absolute ${positionClasses} bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full`}
                initial={{ opacity: 0, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  y: [-5, 5], 
                  transition: { 
                    y: { 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      duration: element.duration || 2, 
                      ease: "easeInOut" 
                    } 
                  } 
                }}
                transition={{ delay: element.delay || 0 }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-white" />
                  <span className="text-white text-sm font-medium">{element.text}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageHero;