/**
 * Icon utility functions for consistent icon sizing and styling across the application
 */

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const iconSizes: Record<IconSize, string> = {
  xs: 'h-3 w-3',    // 12px - Very small icons (badges, indicators)
  sm: 'h-4 w-4',    // 16px - Small icons (navigation, buttons)
  md: 'h-5 w-5',    // 20px - Medium icons (default, most UI elements)
  lg: 'h-6 w-6',    // 24px - Large icons (feature highlights, cards)
  xl: 'h-8 w-8',    // 32px - Extra large icons (hero sections, empty states)
  '2xl': 'h-12 w-12' // 48px - Very large icons (landing page features)
};

/**
 * Get consistent icon size classes
 * @param size - The icon size variant
 * @returns Tailwind CSS classes for icon sizing
 */
export const getIconSize = (size: IconSize = 'md'): string => {
  return iconSizes[size];
};

/**
 * Get consistent icon classes with size and color
 * @param size - The icon size variant
 * @param color - Optional color class
 * @returns Complete Tailwind CSS classes for icons
 */
export const getIconClasses = (size: IconSize = 'md', color?: string): string => {
  const sizeClass = getIconSize(size);
  return color ? `${sizeClass} ${color}` : sizeClass;
};

/**
 * Standard icon sizes for different use cases
 */
export const iconSizeUsage = {
  // Navigation and small UI elements
  navigation: 'sm' as IconSize,
  button: 'sm' as IconSize,
  badge: 'xs' as IconSize,
  
  // Default UI elements
  default: 'md' as IconSize,
  card: 'md' as IconSize,
  list: 'md' as IconSize,
  
  // Feature highlights and important elements
  feature: 'lg' as IconSize,
  highlight: 'lg' as IconSize,
  
  // Hero sections and large displays
  hero: 'xl' as IconSize,
  empty: 'xl' as IconSize,
  
  // Landing page and marketing
  landing: '2xl' as IconSize,
  marketing: '2xl' as IconSize
} as const;