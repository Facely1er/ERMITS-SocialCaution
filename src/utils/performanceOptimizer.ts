// Performance optimization utilities
export class PerformanceOptimizer {
  private static imageObserver: IntersectionObserver | null = null;
  private static loadedImages = new Set<string>();

  // Initialize performance optimizations
  static init() {
    if (typeof window === 'undefined') return;

    // Lazy load images
    this.setupImageLazyLoading();

    // Preload critical resources
    this.preloadCriticalResources();

    // Optimize scroll performance
    this.optimizeScrollPerformance();

    // Setup resource hints
    this.setupResourceHints();
  }

  // Lazy load images with Intersection Observer
  private static setupImageLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      this.loadAllImages();
      return;
    }

    this.imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src || img.getAttribute('data-src');
            
            if (src && !this.loadedImages.has(src)) {
              img.src = src;
              img.removeAttribute('data-src');
              this.loadedImages.add(src);
              this.imageObserver?.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach((img) => {
      this.imageObserver?.observe(img);
    });
  }

  // Fallback: Load all images immediately
  private static loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach((img) => {
      const src = (img as HTMLImageElement).dataset.src;
      if (src) {
        (img as HTMLImageElement).src = src;
        (img as HTMLImageElement).removeAttribute('data-src');
      }
    });
  }

  // Preload critical resources
  private static preloadCriticalResources() {
    const criticalResources = [
      '/favicon.svg',
      '/socialcaution.png'
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.svg') || resource.endsWith('.png') ? 'image' : 'fetch';
      document.head.appendChild(link);
    });
  }

  // Optimize scroll performance
  private static optimizeScrollPerformance() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Scroll handling logic here
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive event listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Setup resource hints
  private static setupResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: 'https://*.supabase.co' },
      { rel: 'dns-prefetch', href: 'https://*.supabase.in' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ];

    hints.forEach((hint) => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossorigin) {
        link.setAttribute('crossorigin', 'anonymous');
      }
      document.head.appendChild(link);
    });
  }

  // Measure and report Core Web Vitals
  static measureWebVitals() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Measure Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry) {
          const lcp = lastEntry.renderTime || lastEntry.loadTime;
          if (lcp) {
            this.reportMetric('LCP', lcp);
          }
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP not supported
    }

    // Measure First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            this.reportMetric('FID', fid);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // FID not supported
    }

    // Measure Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.reportMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // CLS not supported
    }
  }

  // Report metric to analytics
  private static reportMetric(name: string, value: number) {
    // Send to analytics if available
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        non_interaction: true
      });
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`Web Vital: ${name} = ${value.toFixed(2)}`);
    }
  }

  // Cleanup
  static cleanup() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
      this.imageObserver = null;
    }
    this.loadedImages.clear();
  }
}

// Initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PerformanceOptimizer.init();
      PerformanceOptimizer.measureWebVitals();
    });
  } else {
    PerformanceOptimizer.init();
    PerformanceOptimizer.measureWebVitals();
  }
}

