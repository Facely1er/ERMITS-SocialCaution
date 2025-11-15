import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface PerformanceMonitorProps {
  enabled?: boolean;
  showInDev?: boolean;
}

interface PerformanceData {
  loadTime: number;
  domContentLoaded: number;
  memoryUsed: number;
  memoryLimit: number;
  timestamp: number;
}

const PerformanceMonitor = ({ enabled = true, showInDev = false }: PerformanceMonitorProps) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    if (!enabled || (import.meta.env.PROD && !showInDev)) return;

    const monitorPerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      
      const data: PerformanceData = {
        loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0,
        domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart) : 0,
        memoryUsed: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        memoryLimit: memory ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024) : 0,
        timestamp: Date.now()
      };

      setPerformanceData(data);
    };

    // Initial monitoring
    if (document.readyState === 'complete') {
      monitorPerformance();
    } else {
      window.addEventListener('load', monitorPerformance);
    }

    // Periodic updates
    const interval = setInterval(monitorPerformance, 30000);

    return () => {
      window.removeEventListener('load', monitorPerformance);
      clearInterval(interval);
    };
  }, [enabled, showInDev]);

  if (!enabled || (import.meta.env.PROD && !showInDev) || !performanceData) return null;

  const getHealthStatus = () => {
    const { loadTime, memoryUsed, memoryLimit } = performanceData;
    const memoryUsage = memoryLimit > 0 ? (memoryUsed / memoryLimit) * 100 : 0;
    
    if (loadTime > 3000 || memoryUsage > 80) {
      return { status: 'warning', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
    }
    if (loadTime > 5000 || memoryUsage > 90) {
      return { status: 'error', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' };
    }
    return { status: 'good', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' };
  };

  const health = getHealthStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowMonitor(!showMonitor)}
        className={`p-3 rounded-lg ${health.bg} ${health.color} shadow-lg hover:shadow-xl transition-all min-h-[48px] min-w-[48px] flex items-center justify-center`}
        title="Performance Monitor"
        aria-label="Toggle performance monitor"
      >
        <Activity className="w-4 h-4" />
      </button>

      {showMonitor && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl p-4 min-w-64">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Performance Monitor
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Load Time:</span>
              <span className={`font-medium ${performanceData.loadTime > 3000 ? 'text-red-500' : 'text-green-500'}`}>
                {performanceData.loadTime}ms
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">DOM Ready:</span>
              <span className={`font-medium ${performanceData.domContentLoaded > 2000 ? 'text-yellow-500' : 'text-green-500'}`}>
                {performanceData.domContentLoaded}ms
              </span>
            </div>
            
            {performanceData.memoryUsed > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                <span className={`font-medium ${(performanceData.memoryUsed / performanceData.memoryLimit) > 0.8 ? 'text-red-500' : 'text-green-500'}`}>
                  {performanceData.memoryUsed}MB
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;

