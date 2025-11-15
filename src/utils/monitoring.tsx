// Production monitoring and error tracking utilities
import React from 'react';

export const MonitoringService = {
  // Initialize monitoring services
  init: () => {
    if (import.meta.env.PROD) {
      // Initialize Sentry for error tracking (dynamic import to avoid errors if not installed)
      if (import.meta.env.VITE_REACT_APP_SENTRY_DSN) {
        // Use dynamic import to avoid blocking if Sentry is not installed
        // Check if Sentry is available at runtime only
        Promise.resolve().then(() => {
          try {
            // @ts-expect-error - Optional dependency, may not be installed
            return import('@sentry/react');
          } catch {
            return null;
          }
        }).then((Sentry: any) => {
          if (!Sentry) return;
          
          Promise.resolve().then(() => {
            try {
              // Optional dependency, may not be installed
              return import('@sentry/tracing');
            } catch {
              return null;
            }
          }).then((tracing: any) => {
            if (!tracing) return;
            const { BrowserTracing } = tracing;
            try {
              Sentry.init({
                dsn: import.meta.env.VITE_REACT_APP_SENTRY_DSN,
                environment: import.meta.env.VITE_REACT_APP_ENVIRONMENT || 'production',
                tracesSampleRate: parseFloat(import.meta.env.VITE_REACT_APP_PERFORMANCE_SAMPLE_RATE || '0.1'),
                beforeSend(event: any) {
                  // Filter out non-critical errors
                  if (event.exception) {
                    const error = event.exception.values?.[0];
                    if (error && error.type === 'ChunkLoadError') {
                      return null; // Ignore chunk load errors
                    }
                  }
                  return event;
                },
                integrations: [
                  new BrowserTracing({
                    // Performance monitoring for key user actions
                    tracingOrigins: [typeof window !== 'undefined' ? window.location.hostname : 'localhost'],
                  }),
                ],
              });
              } catch (error) {
                if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
                  console.warn('Failed to initialize Sentry:', error);
                }
            }
          }).catch(() => {
            // Sentry tracing not available - silently fail
          });
        }).catch(() => {
          // Sentry not available - silently fail
        });
      }

      // Initialize performance monitoring (non-blocking)
      MonitoringService.initPerformanceMonitoring();
    }
  },

  // Performance monitoring
  initPerformanceMonitoring: () => {
    // Web Vitals monitoring (non-blocking)
    // @ts-expect-error - Optional dependency, may not be installed
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }: any) => {
      getCLS(MonitoringService.sendToAnalytics);
      getFID(MonitoringService.sendToAnalytics);
      getFCP(MonitoringService.sendToAnalytics);
      getLCP(MonitoringService.sendToAnalytics);
      getTTFB(MonitoringService.sendToAnalytics);
    }).catch(() => {
      // Web Vitals not available - silently fail
    });

    // Memory usage monitoring
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        MonitoringService.sendToAnalytics({
          name: 'memory_usage',
          value: memory.usedJSHeapSize,
          delta: memory.usedJSHeapSize - memory.totalJSHeapSize,
          id: 'memory'
        });
      }, 30000); // Every 30 seconds
    }
  },

  // Send metrics to analytics
  sendToAnalytics: (metric: any) => {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
  },

  // Log business metrics
  logBusinessMetric: (metricName: string, value: number, dimensions: Record<string, any> = {}) => {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'business_metric', {
        event_category: 'Business',
        metric_name: metricName,
        metric_value: value,
        ...dimensions
      });
    }

    // Also send to Sentry for tracking (if available)
    if (import.meta.env.PROD && typeof (window as any).Sentry !== 'undefined') {
      try {
        (window as any).Sentry.addBreadcrumb({
          category: 'business_metric',
          message: metricName,
          data: { value, ...dimensions }
        });
      } catch (error) {
        // Silently fail if Sentry is not properly initialized
      }
    }
  },

  // User journey tracking
  trackUserJourney: (step: string, metadata: Record<string, any> = {}) => {
    MonitoringService.logBusinessMetric('user_journey_step', 1, {
      journey_step: step,
      timestamp: Date.now(),
      ...metadata
    });
  },

  // Conversion tracking
  trackConversion: (conversionType: string, value = 1) => {
    MonitoringService.logBusinessMetric('conversion', value, {
      conversion_type: conversionType,
      timestamp: Date.now()
    });
  },

  // Error boundary wrapper (only if Sentry is available)
  // Note: This is a synchronous wrapper that returns the component
  // For Sentry error boundaries, use EnhancedErrorBoundary component instead
  withErrorBoundary: (Component: React.ComponentType<any>, _errorFallback?: React.ComponentType<any>) => {
    // If Sentry is not available, return component as-is
    // The EnhancedErrorBoundary component should be used for error handling
    return Component;
  }
};

// Health check utilities
export const HealthCheck = {
  // Perform application health checks
  runHealthChecks: async () => {
    const checks = {
      localStorage: HealthCheck.checkLocalStorage(),
      performance: HealthCheck.checkPerformance(),
      connectivity: await HealthCheck.checkConnectivity(),
      features: HealthCheck.checkFeatures()
    };

    const healthScore = Object.values(checks).filter((check: any) => check.healthy).length / Object.keys(checks).length;

    return {
      healthy: healthScore >= 0.75,
      score: healthScore,
      checks,
      timestamp: new Date().toISOString()
    };
  },

  checkLocalStorage: () => {
    try {
      const test = 'health_check_test';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return { healthy: true, message: 'localStorage is functional' };
    } catch (error: any) {
      return { healthy: false, message: 'localStorage is not available', error: error.message };
    }
  },

  checkPerformance: () => {
    const memory = (performance as any).memory;
    const healthyMemoryThreshold = 50 * 1024 * 1024; // 50MB
    
    if (memory) {
      const isHealthy = memory.usedJSHeapSize < healthyMemoryThreshold;
      return {
        healthy: isHealthy,
        message: isHealthy ? 'Memory usage is normal' : 'High memory usage detected',
        memoryUsed: memory.usedJSHeapSize,
        memoryLimit: memory.jsHeapSizeLimit
      };
    }

    return { healthy: true, message: 'Performance API not available' };
  },

  checkConnectivity: async () => {
    try {
      const response = await fetch('/health-check', { method: 'HEAD', cache: 'no-cache' });
      return { 
        healthy: response.ok, 
        message: response.ok ? 'Connectivity is good' : 'Connectivity issues detected',
        status: response.status 
      };
    } catch (error: any) {
      return { healthy: false, message: 'Network connectivity failed', error: error.message };
    }
  },

  checkFeatures: () => {
    const requiredFeatures = {
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      intersectionObserver: typeof IntersectionObserver !== 'undefined'
    };

    const healthyFeatures = Object.values(requiredFeatures).filter(Boolean).length;
    const totalFeatures = Object.keys(requiredFeatures).length;

    return {
      healthy: healthyFeatures === totalFeatures,
      message: `${healthyFeatures}/${totalFeatures} required features available`,
      features: requiredFeatures
    };
  }
};

