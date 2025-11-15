import { useContext } from 'react';
import { ToastContext } from '../components/common/ToastProvider';

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

