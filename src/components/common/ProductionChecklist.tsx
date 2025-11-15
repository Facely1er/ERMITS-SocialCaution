import { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle, X, Shield, Eye } from 'lucide-react';
import styles from './ProductionChecklist.module.css';

interface CheckResult {
  status: 'pass' | 'warning' | 'fail';
  issues: string[];
  score: number;
}

interface ProductionChecklistProps {
  onClose?: () => void;
}

const ProductionChecklist = ({ onClose }: ProductionChecklistProps) => {
  const [checks, setChecks] = useState<Record<string, CheckResult>>({});
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runChecks = async () => {
      const results: Record<string, CheckResult> = {
        accessibility: await checkAccessibility(),
        performance: await checkPerformance(), 
        security: await checkSecurity(),
        seo: await checkSEO(),
        browser: await checkBrowserCompat(),
        mobile: await checkMobileReadiness()
      };
      
      setChecks(results);
    };

    runChecks();
  }, []);

  const checkAccessibility = async (): Promise<CheckResult> => {
    const issues: string[] = [];
    
    // Check for alt text on images
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) issues.push(`${images.length} images missing alt text`);
    
    // Check for heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) issues.push('No heading structure found');
    
    // Check for proper labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    const unlabeledInputs = Array.from(inputs).filter(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      return !label && !input.closest('label');
    });
    if (unlabeledInputs.length > 0) issues.push(`${unlabeledInputs.length} inputs missing labels`);

    return {
      status: issues.length === 0 ? 'pass' : 'warning',
      issues,
      score: Math.max(0, 100 - (issues.length * 20))
    };
  };

  const checkPerformance = async (): Promise<CheckResult> => {
    const issues: string[] = [];
    
    // Memory usage check
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      if (memoryUsage > 80) issues.push(`High memory usage: ${Math.round(memoryUsage)}%`);
    }
    
    // Loading performance
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      if (loadTime > 3000) issues.push(`Slow load time: ${Math.round(loadTime)}ms`);
    }

    return {
      status: issues.length === 0 ? 'pass' : issues.length <= 2 ? 'warning' : 'fail',
      issues,
      score: Math.max(0, 100 - (issues.length * 25))
    };
  };

  const checkSecurity = async (): Promise<CheckResult> => {
    const issues: string[] = [];
    
    // Check HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      issues.push('Site not served over HTTPS');
    }
    
    // Check for CSP headers via meta tags
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const cspConfigured = document.querySelector('meta[name="csp-configured"]');
    
    if (!cspMeta && !cspConfigured) {
      issues.push('Content Security Policy not configured');
    }

    return {
      status: issues.length === 0 ? 'pass' : 'warning',
      issues,
      score: Math.max(0, 100 - (issues.length * 30))
    };
  };

  const checkSEO = async (): Promise<CheckResult> => {
    const issues: string[] = [];
    
    // Check meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc || (metaDesc as HTMLMetaElement).content.length < 120) {
      issues.push('Meta description missing or too short');
    }
    
    // Check structured data
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (!structuredData) issues.push('No structured data found');
    
    // Check canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) issues.push('No canonical URL set');

    return {
      status: issues.length === 0 ? 'pass' : 'warning',
      issues,
      score: Math.max(0, 100 - (issues.length * 25))
    };
  };

  const checkBrowserCompat = async (): Promise<CheckResult> => {
    const issues: string[] = [];
    
    // Check for modern features
    if (!window.IntersectionObserver) issues.push('IntersectionObserver not supported');
    if (!window.fetch) issues.push('Fetch API not supported');
    if (!window.localStorage) issues.push('localStorage not supported');
    
    return {
      status: issues.length === 0 ? 'pass' : 'warning',
      issues,
      score: Math.max(0, 100 - (issues.length * 30))
    };
  };

  const checkMobileReadiness = async (): Promise<CheckResult> => {
    const issues: string[] = [];
    
    // Check viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      issues.push('Viewport meta tag missing');
    } else if (!(viewport as HTMLMetaElement).content.includes('width=device-width')) {
      issues.push('Viewport not set to device width');
    }
    
    // Check touch target sizes
    const interactiveElements = document.querySelectorAll('button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])');
    let smallTargets = 0;
    
    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const minHeight = parseInt(style.minHeight) || 0;
      const minWidth = parseInt(style.minWidth) || 0;
      
      const effectiveHeight = Math.max(rect.height, minHeight);
      const effectiveWidth = Math.max(rect.width, minWidth);
      
      if (rect.width > 0 && rect.height > 0 && (effectiveWidth < 44 || effectiveHeight < 44)) {
        const hasClickableParent = el.closest('button, a, [role="button"]') !== el;
        if (!hasClickableParent) {
          smallTargets++;
        }
      }
    });
    
    if (smallTargets > 0) {
      issues.push(`${smallTargets} touch targets below 44px minimum (may include intentionally small elements)`);
    }

    return {
      status: issues.length === 0 ? 'pass' : 'warning',
      issues,
      score: Math.max(0, 100 - (issues.length * 25))
    };
  };

  const getOverallScore = (): number => {
    const scores = Object.values(checks).map(check => check.score || 0);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  };

  const overallScore = getOverallScore();

  useEffect(() => {
    if (containerRef.current) {
      // Set CSS variable for dynamic width - necessary for runtime calculation
      (containerRef.current as any).style.setProperty('--progress-width', `${overallScore}%`);
    }
  }, [overallScore]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'fail': return <X className="w-4 h-4 text-red-500" />;
      default: return <Eye className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isVisible || import.meta.env.PROD) return null;

  return (
    <div ref={containerRef} className="fixed top-4 left-4 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl p-4 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
          <Shield className="w-4 h-4 mr-2 text-blue-500" />
          Production Readiness
        </h3>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close production checklist"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</span>
          <span className={`text-lg font-bold ${
            overallScore >= 80 ? 'text-green-500' : 
            overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {overallScore}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`${styles.progressBarFill} h-2 rounded-full transition-all duration-300 ${
              overallScore >= 80 ? 'bg-green-500' : 
              overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          />
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(checks).map(([category, check]) => (
          <div key={category} className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(check.status)}
              <span className="text-sm text-gray-700 dark:text-gray-300 ml-2 capitalize">
                {category.replace(/([A-Z])/g, ' $1')}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {check.score}%
            </span>
          </div>
        ))}
      </div>

      {Object.values(checks).some(check => check.issues?.length > 0) && (
        <details className="mt-4">
          <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex items-center">
            View Issues
          </summary>
          <div className="mt-2 space-y-1">
            {Object.entries(checks).map(([category, check]) =>
              check.issues?.map((issue, index) => (
                <div key={`${category}-${index}`} className="text-xs text-red-600 dark:text-red-400">
                  • {issue}
                </div>
              ))
            )}
          </div>
        </details>
      )}
    </div>
  );
};

export default ProductionChecklist;

