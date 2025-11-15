// Performance optimization utilities

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    // Monitor navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.set('loadTime', navEntry.loadEventEnd - navEntry.loadEventStart);
            this.metrics.set('domContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Monitor paint timing
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.set('firstContentfulPaint', entry.startTime);
          }
          if (entry.name === 'largest-contentful-paint') {
            this.metrics.set('largestContentfulPaint', entry.startTime);
          }
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);

      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((_entry) => {
          // Log long task detection (commented out for production)
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    }
  }

  public startTiming(name: string): void {
    this.metrics.set(`${name}_start`, performance.now());
  }

  public endTiming(name: string): number {
    const startTime = this.metrics.get(`${name}_start`);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.set(name, duration);
      this.metrics.delete(`${name}_start`);
      return duration;
    }
    return 0;
  }

  public getMetrics(): PerformanceMetrics {
    return {
      loadTime: this.metrics.get('loadTime') || 0,
      renderTime: this.metrics.get('renderTime') || 0,
      memoryUsage: this.getMemoryUsage(),
      bundleSize: this.getBundleSize(),
      cacheHitRate: this.getCacheHitRate()
    };
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    return 0;
  }

  private getBundleSize(): number {
    // This would be calculated based on actual bundle analysis
    return 0;
  }

  private getCacheHitRate(): number {
    // This would be calculated based on cache statistics
    return 0;
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading utility
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
}

// Image lazy loading
export function lazyLoadImage(img: HTMLImageElement, src: string): void {
  const observer = createIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  img.classList.add('lazy');
  observer.observe(img);
}

// Virtual scrolling utility
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function createVirtualScroll(
  items: any[],
  options: VirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;

  return {
    getVisibleItems: (scrollTop: number) => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + visibleCount + overscan,
        items.length - 1
      );
      
      const visibleStartIndex = Math.max(0, startIndex - overscan);
      
      return {
        items: items.slice(visibleStartIndex, endIndex + 1),
        startIndex: visibleStartIndex,
        endIndex,
        totalHeight,
        offsetY: visibleStartIndex * itemHeight
      };
    }
  };
}

// Memory management
export class MemoryManager {
  private static instance: MemoryManager;
  private cache = new Map<string, any>();
  private maxCacheSize = 100;

  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  public set(key: string, value: any): void {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  public get(key: string): any {
    return this.cache.get(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public getSize(): number {
    return this.cache.size;
  }
}

// Bundle splitting utility
export function createAsyncComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

// Service Worker utilities
export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;

  public static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  public async register(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        // Service Worker registered successfully (commented out for production)
        return this.registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }

  public async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
    }
  }

  public getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// Preloading utilities
export function preloadResource(href: string, as: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

export function prefetchResource(href: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Critical resource hints
export function addResourceHints(): void {
  // Preconnect to external domains
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Performance budget monitoring
export class PerformanceBudget {
  private static instance: PerformanceBudget;
  private budgets: Map<string, number> = new Map();

  public static getInstance(): PerformanceBudget {
    if (!PerformanceBudget.instance) {
      PerformanceBudget.instance = new PerformanceBudget();
    }
    return PerformanceBudget.instance;
  }

  public setBudget(metric: string, limit: number): void {
    this.budgets.set(metric, limit);
  }

  public checkBudget(metric: string, value: number): boolean {
    const limit = this.budgets.get(metric);
    if (limit && value > limit) {
      console.warn(`Performance budget exceeded for ${metric}: ${value}ms > ${limit}ms`);
      return false;
    }
    return true;
  }

  public getBudgets(): Map<string, number> {
    return new Map(this.budgets);
  }
}

// Initialize performance monitoring
export function initializePerformanceMonitoring(): void {
  const monitor = PerformanceMonitor.getInstance();
  const memoryManager = MemoryManager.getInstance();
  const swManager = ServiceWorkerManager.getInstance();

  // Set up performance budgets
  const budget = PerformanceBudget.getInstance();
  budget.setBudget('loadTime', 3000);
  budget.setBudget('firstContentfulPaint', 1500);
  budget.setBudget('largestContentfulPaint', 2500);

  // Register service worker
  swManager.register();

  // Add resource hints
  addResourceHints();

  // Monitor performance metrics
  monitor.startTiming('app-initialization');
  
  // Report performance metrics
  window.addEventListener('load', () => {
    monitor.endTiming('app-initialization');
    // const metrics = monitor.getMetrics();
    // Log performance metrics (commented out for production)
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    monitor.cleanup();
    memoryManager.clear();
  });
}