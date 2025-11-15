import { useState, useCallback } from 'react';

interface LoadingState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

interface UseLoadingStateReturn<T> extends LoadingState<T> {
  execute: (promise: Promise<T>) => Promise<T>;
  reset: () => void;
  setData: (data: T) => void;
}

/**
 * Custom hook for managing loading states with async operations
 * Provides loading, success, error states and data management
 */
export const useLoadingState = <T = any>(initialData: T | null = null): UseLoadingStateReturn<T> => {
  const [state, setState] = useState<LoadingState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    isSuccess: false
  });

  const execute = useCallback(async (promise: Promise<T>): Promise<T> => {
    setState({
      data: null,
      isLoading: true,
      error: null,
      isSuccess: false
    });

    try {
      const result = await promise;
      setState({
        data: result,
        isLoading: false,
        error: null,
        isSuccess: true
      });
      return result;
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error as Error,
        isSuccess: false
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
      isSuccess: false
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      isSuccess: true
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData
  };
};

/**
 * Hook for showing success state for a limited time
 */
export const useTemporarySuccess = (duration = 3000) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const triggerSuccess = useCallback(() => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), duration);
  }, [duration]);

  return { showSuccess, triggerSuccess };
};
