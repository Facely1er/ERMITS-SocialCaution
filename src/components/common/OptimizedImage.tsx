import React, { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string;
  alt: string;
  lazy?: boolean;
  placeholder?: string;
  aspectRatio?: string;
}

/**
 * Optimized Image component with lazy loading and responsive images
 * Supports native lazy loading with IntersectionObserver fallback
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  lazy = true,
  placeholder,
  aspectRatio,
  className = '',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy || !imgRef.current) {
      setImageSrc(src);
      return;
    }

    // Use native lazy loading if supported
    if ('loading' in HTMLImageElement.prototype) {
      setImageSrc(src);
      return;
    }

    // Fallback to IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  const imageClasses = `
    ${className}
    ${!isLoaded && placeholder ? 'opacity-50' : ''}
    ${error ? 'bg-gray-200 dark:bg-gray-700' : ''}
    transition-opacity duration-300
  `.trim();

  const containerClasses = `
    relative overflow-hidden
    ${aspectRatio ? `[aspect-ratio:${aspectRatio}]` : ''}
  `.trim();

  return (
    <div className={containerClasses}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
      <img
        ref={imgRef}
        src={imageSrc || placeholder}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={imageClasses}
        decoding="async"
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;

