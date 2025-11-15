import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string | React.ReactNode;
  position?: TooltipPosition;
  children: React.ReactElement;
  delay?: number;
  disabled?: boolean;
  className?: string;
  maxWidth?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  delay = 200,
  disabled = false,
  className = '',
  maxWidth = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  const showTooltip = () => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = maxWidth;
    const tooltipHeight = 40; // Approximate height
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - gap;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + gap;
        break;
    }

    // Ensure tooltip stays within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }
    if (top < padding) top = padding;

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTransformOrigin = () => {
    switch (position) {
      case 'top':
        return 'bottom center';
      case 'bottom':
        return 'top center';
      case 'left':
        return 'right center';
      case 'right':
        return 'left center';
      default:
        return 'bottom center';
    }
  };

  const getTranslateClass = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return '-translate-x-1/2';
      case 'left':
      case 'right':
        return '-translate-y-1/2';
      default:
        return '-translate-x-1/2';
    }
  };

  const getArrowPosition = () => {
    switch (position) {
      case 'top':
        return 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100';
      case 'bottom':
        return 'top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100';
      case 'left':
        return 'right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100';
      case 'right':
        return 'left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100';
      default:
        return '';
    }
  };

  const childWithRef = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      children.props.onBlur?.(e);
    },
    'aria-describedby': isVisible ? tooltipId.current : undefined,
  });

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && createPortal(
        <motion.div
          id={tooltipId.current}
          role="tooltip"
          className={`fixed z-[9999] px-3 py-2 text-sm font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg ${getTranslateClass()} ${className}`}
          style={{
            top: coords.top,
            left: coords.left,
            maxWidth,
            transformOrigin: getTransformOrigin()
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          {content}

          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-[6px] border-transparent ${getArrowPosition()}`}
            aria-hidden="true"
          />
        </motion.div>,
        document.body
      )}
    </AnimatePresence>
  );

  return (
    <>
      {childWithRef}
      {tooltipContent}
    </>
  );
};

export default Tooltip;
