import React from 'react';
import { LucideIcon } from 'lucide-react';
import { getIconClasses, IconSize } from '../../utils/iconUtils';

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Standardized Icon component that ensures consistent sizing and styling
 * across the application using Lucide React icons.
 */
const Icon: React.FC<IconProps> = ({ 
  icon: IconComponent, 
  size = 'md', 
  color, 
  className = '', 
  'aria-label': ariaLabel 
}) => {
  const iconClasses = getIconClasses(size, color);
  const combinedClasses = `${iconClasses} ${className}`.trim();

  // Convert size to numeric values for Lucide icons
  const sizeMap: Record<IconSize, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48
  };

  const sizeValue = sizeMap[size];

  // Pass size as a number to avoid SVG attribute errors
  // Lucide icons expect numeric size prop, not string values
  return (
    <IconComponent 
      size={sizeValue}
      className={combinedClasses}
      aria-label={ariaLabel}
    />
  );
};

export default Icon;