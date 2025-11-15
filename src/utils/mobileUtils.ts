/**
 * Mobile utility functions for better mobile experience
 */

import React from 'react';

// Detect if device is mobile
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Detect if device is iOS
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Detect if device is Android
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// Get screen size category
export const getScreenSize = (): 'sm' | 'md' | 'lg' | 'xl' => {
  if (typeof window === 'undefined') return 'lg';

  const width = window.innerWidth;

  if (width < 640) return 'sm';  // Mobile
  if (width < 768) return 'md';  // Large mobile / small tablet
  if (width < 1024) return 'lg'; // Tablet
  return 'xl';                   // Desktop
};

// Check if viewport width is below a breakpoint
export const isMobileViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768; // md breakpoint
};

// Add haptic feedback (vibration) for mobile interactions
export const hapticFeedback = (pattern: number | number[] = 10): void => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// Haptic patterns
export const HapticPatterns = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  error: [20, 100, 20, 100, 20],
  warning: [30, 50, 30]
} as const;

// Prevent zoom on double tap (for buttons)
export const preventDoubleTapZoom = (element: HTMLElement): void => {
  let lastTouchEnd = 0;

  element.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
};

// Lock body scroll (for modals, drawers)
export const lockBodyScroll = (): void => {
  if (typeof document === 'undefined') return;

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;

  // For iOS
  if (isIOS()) {
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }
};

// Unlock body scroll
export const unlockBodyScroll = (): void => {
  if (typeof document === 'undefined') return;

  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  if (isIOS()) {
    document.body.style.position = '';
    document.body.style.width = '';
  }
};

// Safe area insets for notched devices
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };

  const style = getComputedStyle(document.documentElement);

  return {
    top: parseInt(style.getPropertyValue('--sat') || '0'),
    right: parseInt(style.getPropertyValue('--sar') || '0'),
    bottom: parseInt(style.getPropertyValue('--sab') || '0'),
    left: parseInt(style.getPropertyValue('--sal') || '0')
  };
};

// Check if device supports touch
export const supportsTouch = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get device pixel ratio (for retina displays)
export const getDevicePixelRatio = (): number => {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
};

// Check if in standalone mode (PWA)
export const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;

  // iOS
  if ('standalone' in window.navigator) {
    return (window.navigator as any).standalone === true;
  }

  // Android
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
};

// Add iOS-specific styles to accommodate safe areas
export const addIOSSafeAreaStyles = (): void => {
  if (!isIOS()) return;

  const style = document.createElement('style');
  style.textContent = `
    :root {
      --sat: env(safe-area-inset-top);
      --sar: env(safe-area-inset-right);
      --sab: env(safe-area-inset-bottom);
      --sal: env(safe-area-inset-left);
    }

    .safe-area-inset-top {
      padding-top: env(safe-area-inset-top);
    }

    .safe-area-inset-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }

    .safe-area-inset-left {
      padding-left: env(safe-area-inset-left);
    }

    .safe-area-inset-right {
      padding-right: env(safe-area-inset-right);
    }

    .pb-safe {
      padding-bottom: max(env(safe-area-inset-bottom), 0.5rem);
    }
  `;
  document.head.appendChild(style);
};

// Initialize mobile utilities
export const initMobileUtils = (): void => {
  if (typeof window === 'undefined') return;

  // Add safe area styles for iOS
  addIOSSafeAreaStyles();

  // Add viewport meta tag for better mobile experience
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';
    document.head.appendChild(meta);
  }

  // Add theme-color meta tag
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (!themeColor) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#FF6B35'; // Accent color
    document.head.appendChild(meta);
  }

  // Disable pull-to-refresh in some browsers
  document.body.style.overscrollBehavior = 'contain';
};

// React hook for mobile detection
export const useMobileDetection = () => {
  const [mobile, setMobile] = React.useState(false);
  const [ios, setIos] = React.useState(false);
  const [android, setAndroid] = React.useState(false);

  React.useEffect(() => {
    setMobile(isMobile());
    setIos(isIOS());
    setAndroid(isAndroid());
  }, []);

  return { isMobile: mobile, isIOS: ios, isAndroid: android };
};

export const useMobile = (): boolean => {
  const [mobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setMobile(isMobileViewport());

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return mobile;
};
