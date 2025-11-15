// Design System Configuration
// Consistent design tokens for the ERMITS Social Caution MVP

export const designSystem = {
  // Container widths
  container: {
    maxWidth: 'max-w-7xl',
    padding: 'px-4 sm:px-6 lg:px-8',
  },

  // Spacing scale
  spacing: {
    page: 'py-8',
    section: 'mb-8',
    card: 'p-6',
    cardSmall: 'p-4',
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
    h1: 'text-3xl font-bold text-gray-900',
    h2: 'text-2xl font-bold text-gray-900',
    h3: 'text-xl font-semibold text-gray-900',
    h4: 'text-lg font-semibold text-gray-900',
    body: 'text-base text-gray-600',
    bodySmall: 'text-sm text-gray-600',
    caption: 'text-xs text-gray-500',
  },

  // Border radius
  borderRadius: {
    card: 'rounded-xl',
    button: 'rounded-lg',
    badge: 'rounded-full',
    input: 'rounded-lg',
  },

  // Shadows
  shadow: {
    card: 'shadow-sm',
    cardHover: 'shadow-md',
    large: 'shadow-lg',
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
  },

  // Buttons
  buttons: {
    primary: 'px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md',
    secondary: 'px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors',
    outline: 'px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium',
    ghost: 'px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors',
  },

  // Grid layouts
  grid: {
    personas: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    stats: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    categories: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4',
    filters: 'grid grid-cols-1 md:grid-cols-4 gap-4',
  },

  // Transitions
  transitions: {
    default: 'transition-all duration-200',
    slow: 'transition-all duration-300',
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
