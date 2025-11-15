import { motion } from 'framer-motion';

export function PersonaCardSkeleton() {
  return (
    <div className="rounded-xl p-6 border-2 border-gray-200 bg-white">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function CautionItemSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="animate-pulse flex gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex gap-2 mb-2">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg className="w-full h-full" viewBox="0 0 50 50">
        <circle
          className="text-gray-200"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          stroke="currentColor"
        />
        <circle
          className="text-indigo-600"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          stroke="currentColor"
          strokeDasharray="80, 200"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
