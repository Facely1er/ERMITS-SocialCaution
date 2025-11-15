import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Don't expose sensitive error details to users
      const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
      const errorMessage = isDevelopment 
        ? (this.state.error?.message || 'An unexpected error occurred')
        : 'An unexpected error occurred. Please try refreshing the page.';

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-danger mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              {errorMessage}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;