import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  enabled?: boolean;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  className = '',
  enabled = true
}) => {
  const { containerRef, isPulling, isRefreshing, pullDistance, progress } = usePullToRefresh({
    onRefresh,
    threshold,
    enabled
  });

  const rotation = progress * 360;
  const opacity = Math.min(progress, 1);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        // Add pull distance as padding to create the pull effect
        paddingTop: isPulling || isRefreshing ? `${pullDistance}px` : 0,
        transition: isPulling ? 'none' : 'padding-top 0.3s ease-out'
      }}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && (
          <motion.div
            className="absolute top-0 left-0 right-0 flex items-center justify-center"
            style={{
              height: `${pullDistance}px`,
              opacity
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  rotate: isRefreshing ? [0, 360] : rotation,
                  scale: progress > 0.8 ? [1, 1.1, 1] : 1
                }}
                transition={{
                  rotate: isRefreshing
                    ? { duration: 1, repeat: Infinity, ease: "linear" }
                    : { duration: 0 },
                  scale: { duration: 0.2 }
                }}
              >
                <RefreshCw
                  className={`h-6 w-6 ${
                    isRefreshing
                      ? 'text-accent'
                      : progress >= 1
                      ? 'text-success'
                      : 'text-text-secondary'
                  }`}
                />
              </motion.div>

              {progress >= 1 && !isRefreshing && (
                <motion.p
                  className="text-xs font-medium text-text-secondary"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Release to refresh
                </motion.p>
              )}

              {isRefreshing && (
                <motion.p
                  className="text-xs font-medium text-accent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Refreshing...
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {children}
    </div>
  );
};

export default PullToRefresh;
