import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  className = '',
  showLabel = false 
}) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 
        text-white hover:text-white dark:text-white dark:hover:text-white
        transition-all duration-200 
        p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/10
        ${className}
      `}
      aria-label="Toggle theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4 text-accent" />
        ) : (
          <Moon className="h-4 w-4 text-accent" />
        )}
      </motion.div>
      {showLabel && (
        <span className="text-sm font-medium">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </motion.button>
  );
};

export default ThemeSwitcher;