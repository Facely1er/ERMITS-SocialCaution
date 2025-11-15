import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, Star, Zap, Award } from 'lucide-react';

interface SuccessAnimationProps {
  type?: 'check' | 'trophy' | 'star' | 'zap' | 'award';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  type = 'check',
  size = 'md',
  message,
  onComplete
}) => {
  const icons = {
    check: CheckCircle,
    trophy: Trophy,
    star: Star,
    zap: Zap,
    award: Award
  };

  const sizes = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const Icon = icons[type];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.6
        }}
        onAnimationComplete={onComplete}
        className="relative"
      >
        {/* Outer ring animation */}
        <motion.div
          className={`${sizes[size]} rounded-full bg-success/20 absolute inset-0 flex items-center justify-center`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Icon */}
        <motion.div
          className={`${sizes[size]} text-success flex items-center justify-center relative z-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Icon className="w-full h-full" strokeWidth={2} />
        </motion.div>

        {/* Sparkle effects */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((position, index) => (
          <motion.div
            key={index}
            className={`absolute ${position} w-2 h-2 bg-success rounded-full`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: index % 2 === 0 ? -8 : 8,
              y: index < 2 ? -8 : 8
            }}
            transition={{
              duration: 0.6,
              delay: 0.3 + (index * 0.1)
            }}
          />
        ))}
      </motion.div>

      {/* Message */}
      {message && (
        <motion.p
          className="mt-4 text-text dark:text-text font-medium text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default SuccessAnimation;
