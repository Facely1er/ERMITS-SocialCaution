import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FloatingElementProps {
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

/**
 * Standardized floating element component for consistent positioning and animation
 */
export const FloatingElement: React.FC<FloatingElementProps> = ({
  icon: Icon,
  text,
  position,
  delay = 0,
  duration = 2
}) => {
  const positionClasses = Object.entries(position)
    .map(([key, value]) => `${key}-[${value}]`)
    .join(' ');

  return (
    <motion.div
      className={`absolute ${positionClasses} bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full`}
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: 1, 
        y: [-5, 5], 
        transition: { 
          y: { 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration, 
            ease: "easeInOut" 
          },
          delay 
        } 
      }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-white" />
        <span className="text-white text-sm font-medium">{text}</span>
      </div>
    </motion.div>
  );
};

interface FloatingElementsProps {
  elements: Array<{
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
  }>;
}

/**
 * Container for multiple floating elements with consistent positioning
 */
export const FloatingElements: React.FC<FloatingElementsProps> = ({ elements }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {elements.map((element, index) => (
        <FloatingElement
          key={index}
          icon={element.icon}
          text={element.text}
          position={element.position}
          delay={element.delay || index * 0.2}
          duration={element.duration || 2 + index * 0.3}
        />
      ))}
    </div>
  );
};

export default FloatingElement;
