/* eslint-disable react-refresh/only-export-components */
import React, { createContext, type FC, type ReactNode } from 'react';
import ToastContainer from './Toast';
import { useToast } from '../../hooks/useToast';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => string;
  closeToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastProvider: FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right' 
}) => {
  const { toasts, showToast, closeToast, success, error, info, warning } = useToast();

  return (
    <ToastContext.Provider value={{ showToast, closeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onClose={closeToast} position={position} />
    </ToastContext.Provider>
  );
};

