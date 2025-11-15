import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Trash2, Archive, Check, X } from 'lucide-react';

type SwipeAction = 'delete' | 'archive' | 'approve' | 'reject' | 'custom';

interface ActionConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  label: string;
  threshold?: number;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: SwipeAction | ActionConfig;
  rightAction?: SwipeAction | ActionConfig;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

const defaultActions: Record<SwipeAction, ActionConfig> = {
  delete: {
    icon: <Trash2 className="h-6 w-6" />,
    color: 'text-white',
    bgColor: 'bg-red-600',
    label: 'Delete',
    threshold: 100
  },
  archive: {
    icon: <Archive className="h-6 w-6" />,
    color: 'text-white',
    bgColor: 'bg-blue-600',
    label: 'Archive',
    threshold: 100
  },
  approve: {
    icon: <Check className="h-6 w-6" />,
    color: 'text-white',
    bgColor: 'bg-green-600',
    label: 'Approve',
    threshold: 100
  },
  reject: {
    icon: <X className="h-6 w-6" />,
    color: 'text-white',
    bgColor: 'bg-red-600',
    label: 'Reject',
    threshold: 100
  },
  custom: {
    icon: <></>,
    color: 'text-white',
    bgColor: 'bg-gray-600',
    label: 'Action',
    threshold: 100
  }
};

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = 'delete',
  rightAction = 'archive',
  threshold = 100,
  disabled = false,
  className = ''
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const x = useMotionValue(0);

  const leftConfig = typeof leftAction === 'string' ? defaultActions[leftAction] : leftAction;
  const rightConfig = typeof rightAction === 'string' ? defaultActions[rightAction] : rightAction;

  const leftThreshold = leftConfig.threshold || threshold;
  const rightThreshold = rightConfig.threshold || threshold;

  // Transform for left action background
  const leftBgOpacity = useTransform(
    x,
    [-leftThreshold * 1.5, -leftThreshold, 0],
    [1, 0.8, 0]
  );

  const leftScale = useTransform(
    x,
    [-leftThreshold * 1.5, -leftThreshold, 0],
    [1.1, 1, 0.8]
  );

  // Transform for right action background
  const rightBgOpacity = useTransform(
    x,
    [0, rightThreshold, rightThreshold * 1.5],
    [0, 0.8, 1]
  );

  const rightScale = useTransform(
    x,
    [0, rightThreshold, rightThreshold * 1.5],
    [0.8, 1, 1.1]
  );

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (disabled) return;

    const offset = info.offset.x;

    // Swipe left (negative)
    if (offset < -leftThreshold && onSwipeLeft) {
      setIsRemoving(true);
      onSwipeLeft();
    }
    // Swipe right (positive)
    else if (offset > rightThreshold && onSwipeRight) {
      setIsRemoving(true);
      onSwipeRight();
    }
  };

  if (isRemoving) {
    return null; // Or show a removal animation
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left action background */}
      {onSwipeLeft && (
        <motion.div
          className={`absolute inset-y-0 right-0 flex items-center justify-end px-6 ${leftConfig.bgColor} ${leftConfig.color}`}
          style={{ opacity: leftBgOpacity }}
        >
          <motion.div
            className="flex items-center gap-2"
            style={{ scale: leftScale }}
          >
            {leftConfig.icon}
            <span className="font-medium">{leftConfig.label}</span>
          </motion.div>
        </motion.div>
      )}

      {/* Right action background */}
      {onSwipeRight && (
        <motion.div
          className={`absolute inset-y-0 left-0 flex items-center justify-start px-6 ${rightConfig.bgColor} ${rightConfig.color}`}
          style={{ opacity: rightBgOpacity }}
        >
          <motion.div
            className="flex items-center gap-2"
            style={{ scale: rightScale }}
          >
            {rightConfig.icon}
            <span className="font-medium">{rightConfig.label}</span>
          </motion.div>
        </motion.div>
      )}

      {/* Card content */}
      <motion.div
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative bg-card dark:bg-card cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeableCard;

// Simple variant for list items
interface SwipeableListItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onArchive?: () => void;
  className?: string;
}

export const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  children,
  onDelete,
  onArchive,
  className = ''
}) => {
  return (
    <SwipeableCard
      leftAction="delete"
      rightAction="archive"
      onSwipeLeft={onDelete}
      onSwipeRight={onArchive}
      className={className}
    >
      <div className="p-4 border-b border-border dark:border-border">
        {children}
      </div>
    </SwipeableCard>
  );
};
