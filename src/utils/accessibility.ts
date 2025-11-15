// Accessibility utilities and helpers

export interface AccessibilityOptions {
  announceChanges?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  screenReader?: boolean;
}

export const getAccessibilityPreferences = (): AccessibilityOptions => {
  const stored = localStorage.getItem('accessibility-preferences');
  if (stored) {
    return JSON.parse(stored);
  }

  // Default preferences based on system settings
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

  return {
    announceChanges: true,
    highContrast: prefersHighContrast,
    reducedMotion: prefersReducedMotion,
    fontSize: 'medium',
    screenReader: false
  };
};

export const saveAccessibilityPreferences = (preferences: AccessibilityOptions): void => {
  localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
};

export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const focusElement = (selector: string): void => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.focus();
  }
};

export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

export const generateAriaLabel = (element: string, context?: string): string => {
  const labels: Record<string, string> = {
    'close': 'Close',
    'menu': 'Menu',
    'search': 'Search',
    'filter': 'Filter',
    'sort': 'Sort',
    'export': 'Export',
    'share': 'Share',
    'like': 'Like',
    'comment': 'Comment',
    'edit': 'Edit',
    'delete': 'Delete',
    'save': 'Save',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'next': 'Next',
    'previous': 'Previous',
    'expand': 'Expand',
    'collapse': 'Collapse',
    'play': 'Play',
    'pause': 'Pause',
    'stop': 'Stop',
    'volume': 'Volume',
    'mute': 'Mute',
    'unmute': 'Unmute',
    'fullscreen': 'Fullscreen',
    'exit-fullscreen': 'Exit fullscreen'
  };

  const baseLabel = labels[element] || element;
  return context ? `${baseLabel} ${context}` : baseLabel;
};

export const getColorContrast = (color1: string, color2: string): number => {
  // Simple contrast ratio calculation
  // In a real implementation, you'd want to use a proper color contrast library
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      const val = parseInt(c) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const isHighContrastMode = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

export const isReducedMotionMode = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getPreferredColorScheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Keyboard navigation helpers
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  options: {
    onEnter?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onSpace?: () => void;
  }
): void => {
  switch (event.key) {
    case 'Enter':
      options.onEnter?.();
      break;
    case 'Escape':
      options.onEscape?.();
      break;
    case 'ArrowUp':
      options.onArrowUp?.();
      break;
    case 'ArrowDown':
      options.onArrowDown?.();
      break;
    case 'ArrowLeft':
      options.onArrowLeft?.();
      break;
    case 'ArrowRight':
      options.onArrowRight?.();
      break;
    case ' ':
      event.preventDefault();
      options.onSpace?.();
      break;
  }
};

// Focus management
export const createFocusRing = (element: HTMLElement): void => {
  element.style.outline = '2px solid #3b82f6';
  element.style.outlineOffset = '2px';
};

export const removeFocusRing = (element: HTMLElement): void => {
  element.style.outline = '';
  element.style.outlineOffset = '';
};

// Screen reader text
export const createScreenReaderText = (text: string): HTMLElement => {
  const element = document.createElement('span');
  element.className = 'sr-only';
  element.textContent = text;
  return element;
};

// ARIA live region for dynamic content
export const createLiveRegion = (): HTMLElement => {
  const element = document.createElement('div');
  element.setAttribute('aria-live', 'polite');
  element.setAttribute('aria-atomic', 'true');
  element.className = 'sr-only';
  return element;
};