// Design System Configuration
// Comprehensive design tokens for the ERMITS Social Caution MVP

export const designSystem = {
  // Container widths
  container: {
    maxWidth: 'max-w-7xl',
    padding: 'px-3 sm:px-4 lg:px-6', // Reduced side padding for more content space
    paddingFull: 'px-0', // For full-bleed sections
    paddingStandard: 'px-4 sm:px-6 lg:px-8', // Original padding (if needed)
  },

  // Comprehensive spacing scale
  spacing: {
    // Vertical spacing
    page: 'py-8',
    section: 'mb-8',
    sectionSmall: 'mb-4',
    sectionLarge: 'mb-12',

    // Padding
    card: 'p-6',
    cardSmall: 'p-4',
    cardLarge: 'p-8',
    cardCompact: 'p-3',

    // Margins
    margin: {
      xs: 'mb-1',
      sm: 'mb-2',
      md: 'mb-3',
      lg: 'mb-4',
      xl: 'mb-6',
      '2xl': 'mb-8',
      '3xl': 'mb-12',
    },

    // Gaps
    gap: {
      xs: 'gap-2',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },

  // Typography
  typography: {
    // Headings
    h1: 'text-3xl font-bold text-gray-900',
    h2: 'text-2xl font-bold text-gray-900',
    h3: 'text-xl font-semibold text-gray-900',
    h4: 'text-lg font-semibold text-gray-900',
    h5: 'text-base font-semibold text-gray-900',

    // Body text
    body: 'text-base text-gray-600',
    bodySmall: 'text-sm text-gray-600',
    bodyLarge: 'text-lg text-gray-600',
    caption: 'text-xs text-gray-500',

    // Responsive headings
    heroTitle: 'text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900',
    pageTitle: 'text-3xl md:text-4xl font-bold text-gray-900',
    sectionTitle: 'text-2xl md:text-3xl font-bold text-gray-900',
  },

  // Comprehensive color system
  colors: {
    // Primary brand colors
    primary: {
      50: 'bg-indigo-50',
      100: 'bg-indigo-100',
      200: 'bg-indigo-200',
      500: 'bg-indigo-500',
      600: 'bg-indigo-600',
      700: 'bg-indigo-700',
      textLight: 'text-indigo-100',
      text: 'text-indigo-600',
      textDark: 'text-indigo-700',
    },

    // Neutral colors
    gray: {
      50: 'bg-gray-50',
      100: 'bg-gray-100',
      200: 'bg-gray-200',
      300: 'bg-gray-300',
      400: 'bg-gray-400',
      500: 'bg-gray-500',
      600: 'bg-gray-600',
      700: 'bg-gray-700',
      800: 'bg-gray-800',
      900: 'bg-gray-900',
      textLight: 'text-gray-400',
      text: 'text-gray-600',
      textDark: 'text-gray-700',
      textDarker: 'text-gray-900',
    },

    // Semantic colors
    success: {
      bg: 'bg-green-50',
      bgStrong: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    error: {
      bg: 'bg-red-50',
      bgStrong: 'bg-red-100',
      text: 'text-red-700',
      textDark: 'text-red-800',
      border: 'border-red-200',
      borderStrong: 'border-red-500',
    },
    warning: {
      bg: 'bg-orange-50',
      bgStrong: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },
    info: {
      bg: 'bg-blue-50',
      bgStrong: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
  },

  // Border radius
  borderRadius: {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    card: 'rounded-xl',
    button: 'rounded-lg',
    badge: 'rounded-full',
    input: 'rounded-lg',
    full: 'rounded-full',
  },

  // Comprehensive shadow system
  shadow: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    card: 'shadow-sm',
    cardHover: 'shadow-md',
    cardActive: 'shadow-lg',
    large: 'shadow-lg',
    prominent: 'shadow-xl',
  },

  // Colors - severity levels
  severity: {
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-500',
      dot: 'bg-red-500',
      icon: '🚨',
      label: 'Critical',
    },
    high: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-500',
      dot: 'bg-orange-500',
      icon: '⚠️',
      label: 'High',
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-500',
      dot: 'bg-yellow-500',
      icon: '⚡',
      label: 'Medium',
    },
    low: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-500',
      dot: 'bg-blue-500',
      icon: 'ℹ️',
      label: 'Low',
    },
  },

  // Gradients
  gradients: {
    header: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    page: 'bg-gray-50',
    card: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    primaryButton: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    heroBackground: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50',
  },

  // Comprehensive button system
  buttons: {
    // Size variants
    sizes: {
      xs: 'px-3 py-1.5 text-xs',
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    },

    // Style variants
    primary: 'px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-none',
    primaryGradient: 'px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-lg font-medium transition-all shadow-sm hover:shadow-md focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-none',
    secondary: 'px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none',
    outline: 'px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-gray-700 focus-visible:ring-4 focus-visible:ring-gray-200 focus-visible:outline-none',
    ghost: 'px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none',
    danger: 'px-6 py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md focus-visible:ring-4 focus-visible:ring-red-200 focus-visible:outline-none',
    success: 'px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md focus-visible:ring-4 focus-visible:ring-green-200 focus-visible:outline-none',
  },

  // Grid layouts
  grid: {
    personas: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    stats: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    categories: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4',
    filters: 'grid grid-cols-1 md:grid-cols-4 gap-4',
    twoColumn: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    threeColumn: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    fourColumn: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  },

  // Comprehensive animation system
  animations: {
    // Transition durations
    duration: {
      fast: 'duration-150',
      normal: 'duration-200',
      slow: 'duration-300',
    },

    // Hover scale values
    scale: {
      subtle: 'hover:scale-[1.01]',
      medium: 'hover:scale-[1.03]',
      prominent: 'hover:scale-[1.05]',
      large: 'hover:scale-[1.08]',
    },

    // Stagger delays (for sequential animations)
    stagger: {
      fast: '0.05', // 50ms
      normal: '0.1', // 100ms
      slow: '0.2', // 200ms
    },

    // Common animation patterns
    fadeIn: 'transition-opacity duration-200',
    slideUp: 'transition-transform duration-300',
    scaleIn: 'transition-transform duration-200',
  },

  // Transitions
  transitions: {
    default: 'transition-all duration-200',
    fast: 'transition-all duration-150',
    slow: 'transition-all duration-300',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-200',
    shadow: 'transition-shadow duration-200',
  },

  // Focus states system
  focus: {
    // Ring styles
    ring: {
      sm: 'focus-visible:ring-2',
      md: 'focus-visible:ring-4',
      lg: 'focus-visible:ring-8',
    },

    // Ring colors
    ringColor: {
      primary: 'focus-visible:ring-indigo-200',
      white: 'focus-visible:ring-white/30',
      gray: 'focus-visible:ring-gray-200',
      success: 'focus-visible:ring-green-200',
      error: 'focus-visible:ring-red-200',
    },

    // Common focus states
    primary: 'focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-none',
    secondary: 'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none',
    input: 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none',
    card: 'focus-visible:ring-4 focus-visible:ring-indigo-100 focus-visible:outline-none',
  },

  // Form elements
  forms: {
    input: 'w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors font-medium text-gray-700',
    select: 'w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors font-medium text-gray-700 bg-white',
    textarea: 'w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors font-medium text-gray-700 resize-vertical',
    label: 'block text-sm font-semibold text-gray-700 mb-2',
    error: 'text-sm text-red-600 mt-1',
    hint: 'text-sm text-gray-500 mt-1',
  },

  // Badge styles
  badges: {
    default: 'px-3 py-1 rounded-full text-xs font-semibold',
    primary: 'px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-200',
    success: 'px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200',
    warning: 'px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold border border-orange-200',
    error: 'px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200',
    neutral: 'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-200',
  },

  // Loading states
  loading: {
    spinner: {
      sm: 'animate-spin rounded-full h-8 w-8 border-2 border-indigo-200 border-t-indigo-600',
      md: 'animate-spin rounded-full h-12 w-12 border-3 border-indigo-200 border-t-indigo-600',
      lg: 'animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600',
      xl: 'animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600',
    },
    text: 'text-lg font-medium text-gray-700',
  },
};

// Utility function to get severity config
export function getSeverityConfig(severity: 'critical' | 'high' | 'medium' | 'low') {
  return designSystem.severity[severity];
}

// Utility function to combine classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Utility function to get button with size
export function getButton(variant: keyof typeof designSystem.buttons, size?: keyof typeof designSystem.buttons.sizes): string {
  const baseButton = designSystem.buttons[variant];
  if (!size || variant === 'sizes') return baseButton;

  // Extract padding from base button and replace with size padding
  const sizeClasses = designSystem.buttons.sizes[size];
  const baseWithoutPadding = baseButton.replace(/px-\d+\s+py-\d+(\.\d+)?\s+/, '');
  return `${sizeClasses} ${baseWithoutPadding}`;
}

// Utility function to get animation delay for stagger
export function getStaggerDelay(index: number, speed: keyof typeof designSystem.animations.stagger = 'normal'): number {
  return index * parseFloat(designSystem.animations.stagger[speed]);
}
