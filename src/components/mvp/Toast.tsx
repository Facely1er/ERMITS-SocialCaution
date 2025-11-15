import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-green-50 border-green-200',
    iconClass: 'text-green-600',
    textClass: 'text-green-900'
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-red-50 border-red-200',
    iconClass: 'text-red-600',
    textClass: 'text-red-900'
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-yellow-50 border-yellow-200',
    iconClass: 'text-yellow-600',
    textClass: 'text-yellow-900'
  },
  info: {
    icon: Info,
    bgClass: 'bg-blue-50 border-blue-200',
    iconClass: 'text-blue-600',
    textClass: 'text-blue-900'
  }
};

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${config.bgClass} max-w-md`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconClass}`} />
      <p className={`flex-1 text-sm font-medium ${config.textClass}`}>{message}</p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors ${config.iconClass}`}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
