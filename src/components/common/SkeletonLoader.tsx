import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'list';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
  animated?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  lines = 1,
  animated = true
}) => {
  const baseClasses = `bg-gray-200 dark:bg-gray-700 ${animated ? 'animate-pulse' : ''}`;
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-lg',
    list: 'rounded'
  };

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${variantClasses.card} ${className}`} style={{ width, height }}>
        <div className="p-6 space-y-4">
          <div className={`${baseClasses} h-6 w-3/4 rounded`} />
          <div className={`${baseClasses} h-4 w-full rounded`} />
          <div className={`${baseClasses} h-4 w-5/6 rounded`} />
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className={`${baseClasses} ${variantClasses.list} h-4`} style={{ width: width || '100%' }} />
        ))}
      </div>
    );
  }

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-label="Loading..."
      role="status"
      aria-live="polite"
    />
  );
};

export default SkeletonLoader;

