// Production utilities and configuration
export class ProductionManager {
  private isProduction: boolean;
  private config: ReturnType<typeof this.getProductionConfig>;

  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.config = this.getProductionConfig();
  }

  private getProductionConfig() {
    return {
      // Performance configuration
      performance: {
        enableServiceWorker: true,
        enableOfflineSupport: true,
        enableResourceCaching: true,
        bundleSizeLimit: 500 * 1024, // 500KB
        chunkSizeLimit: 250 * 1024,  // 250KB
      },

      // Security configuration
      security: {
        enableCSP: true,
        enableSecureHeaders: true,
        enableInputSanitization: true,
        enableXSSProtection: true,
      },

      // Analytics configuration
      analytics: {
        enableWebVitals: true,
        enableErrorTracking: true,
        enableBusinessMetrics: true,
        anonymizeIP: true,
      },

      // Feature flags
      features: {
        enableBetaFeatures: false,
        enableAdvancedAnalytics: false,
        enableUserFeedback: true,
        enablePerformanceMode: true,
      }
    };
  }

  // Initialize production features
  async initializeProduction() {
    try {
      // Register service worker
      if (this.config.performance.enableServiceWorker) {
        await this.registerServiceWorker();
      }

      // Initialize monitoring
      await this.initializeMonitoring();

      // Setup error handling
      this.setupGlobalErrorHandling();

      // Initialize security measures
      this.initializeSecurity();

      // Setup performance optimization
      this.optimizePerformance();

      // Production initialization complete
    } catch (error) {
      if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
        console.error('Production initialization failed:', error);
      }
      // Log to error monitoring service
      if (import.meta.env.PROD && (window as any).Sentry?.captureException) {
        (window as any).Sentry.captureException(error);
      }
    }
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator && this.isProduction) {
      try {
        // Check if service worker file exists before registering
        const swPath = '/sw.js';
        const response = await fetch(swPath, { method: 'HEAD' });
        
        if (!response.ok) {
          // Service worker file doesn't exist, skip registration
          if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
            console.warn('Service Worker file not found, skipping registration');
          }
          return;
        }

        const registration = await navigator.serviceWorker.register(swPath, {
          scope: '/'
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Show update notification
                this.showUpdateNotification();
              }
            });
          }
        });

        // Service Worker registered successfully
        return registration;
      } catch (error) {
        // Silently handle service worker registration failures - app should still work
        if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
          console.warn('Service Worker registration failed (non-critical):', error);
        }
        // Log to error monitoring service in production (non-blocking)
        if (import.meta.env.PROD && (window as any).Sentry?.captureException) {
          try {
            (window as any).Sentry.captureException(error);
          } catch (sentryError) {
            // Ignore Sentry errors
          }
        }
        // Don't throw - service worker is optional
        return;
      }
    }
  }

  private async initializeMonitoring() {
    // Note: Sentry initialization is handled by MonitoringService.init()
    // This method is kept for consistency but monitoring is handled separately
    
    // Initialize performance monitoring
    if (this.config.analytics.enableWebVitals) {
      await this.initializeWebVitals();
    }
  }

  private async initializeWebVitals() {
    try {
      // @ts-expect-error - Optional dependency, may not be installed
      const { getCLS, getFID, getFCP, getLCP, getTTFB }: any = await import('web-vitals');
      
      const sendToAnalytics = (metric: any) => {
        if (typeof (window as any).gtag !== 'undefined') {
          (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_label: metric.id,
            non_interaction: true
          });
        }
      };

      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    } catch (error) {
      console.warn('Failed to initialize Web Vitals:', error);
    }
  }

  private setupGlobalErrorHandling() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename || '',
        lineno: event.lineno || 0,
        colno: event.colno || 0,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      });
    });
  }

  private handleError(errorData: any) {
    // Log to console in development
    if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
      console.error('Application Error:', errorData);
    }

    // Send to monitoring service in production
    if (this.isProduction && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'error_occurred', {
        event_category: 'error',
        error_type: errorData.type,
        error_message: errorData.message?.substring(0, 100),
        non_interaction: true
      });
    }
  }

  private initializeSecurity() {
    // Input sanitization for forms
    this.setupInputSanitization();
    
    // Content Security Policy monitoring
    this.monitorCSPViolations();
  }

  private setupInputSanitization() {
    // NOTE: Global input sanitization can interfere with React's controlled components
    // Consider removing this if using React's built-in input handling
    // Uncomment only if you need to sanitize non-React form inputs
    // Input sanitization is handled by React's built-in mechanisms
  }

  private monitorCSPViolations() {
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleError({
        type: 'csp_violation',
        message: `CSP violation: ${(event as any).violatedDirective}`,
        blockedURI: (event as any).blockedURI,
        documentURI: (event as any).documentURI,
        timestamp: Date.now()
      });
    });
  }

  private optimizePerformance() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize images
    this.setupImageOptimization();
    
    // Setup resource hints
    this.setupResourceHints();
  }

  private preloadCriticalResources() {
    const criticalResources = [
      { href: '/socialcaution.png', as: 'image' },
      // Add other critical resources
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });
  }

  private setupImageOptimization() {
    // Lazy loading with intersection observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  private setupResourceHints() {
    // DNS prefetch for external domains
    const externalDomains = [
      'https://www.google-analytics.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  private showUpdateNotification() {
    // Show user-friendly update notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="mr-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div>
          <p class="font-medium">New version available</p>
          <button onclick="window.location.reload()" class="text-sm underline">Refresh to update</button>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }

  // Health check for production monitoring
  async performHealthCheck() {
    const checks = {
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: this.testLocalStorage(),
      performance: 'performance' in window,
      intersection: 'IntersectionObserver' in window,
      fetch: 'fetch' in window
    };

    const healthyChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;

    return {
      healthy: healthyChecks === totalChecks,
      score: healthyChecks / totalChecks,
      checks,
      timestamp: new Date().toISOString()
    };
  }

  private testLocalStorage(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton
export const productionManager = new ProductionManager();
export default productionManager;

