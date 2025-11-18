import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail, ArrowLeft } from 'lucide-react';
import logger from '../../utils/logger';

interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showRetry?: boolean;
  showGoBack?: boolean;
  fallbackComponent?: string;
}

interface EnhancedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  lastRetryTime: number | null;
}

class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, EnhancedErrorBoundaryState> {
  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      lastRetryTime: null
    };
  }

  static getDerivedStateFromError(): Partial<EnhancedErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    this.setState({
      error,
      errorInfo,
      errorId,
      lastRetryTime: Date.now()
    });

    // Enhanced error logging
    const errorData = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount,
      component: this.props.fallbackComponent || 'unknown'
    };

    // Log error using logger utility
    logger.error('Enhanced Error Boundary:', errorData);

    // Send to monitoring service if available
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'error_boundary_triggered', {
        event_category: 'error',
        error_component: errorData.component,
        error_id: errorId,
        retry_count: this.state.retryCount,
        non_interaction: true
      });
    }

    // Store error for potential user feedback
    try {
      localStorage.setItem('last_error', JSON.stringify(errorData));
    } catch (e) {
      logger.warn('Could not store error data:', e);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1,
      lastRetryTime: Date.now()
    }));
  };

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  handleReportError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      component: this.props.fallbackComponent,
      timestamp: new Date().toISOString()
    };

    const emailBody = encodeURIComponent(
      `Error Report\n\nError ID: ${errorReport.errorId}\nMessage: ${errorReport.message}\nComponent: ${errorReport.component}\nTimestamp: ${errorReport.timestamp}\n\nPlease describe what you were doing when this error occurred:`
    );

    window.location.href = `mailto:support@socialcaution.com?subject=Error Report ${errorReport.errorId}&body=${emailBody}`;
  };

  render() {
    if (this.state.hasError) {
      const { title, description, showRetry = true, showGoBack = true } = this.props;

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4" role="alert" aria-live="assertive">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" aria-hidden="true" />
              </div>
              
              {/* Error Title */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {title || 'Something went wrong'}
              </h1>
              
              {/* Error Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {description || "We've encountered an unexpected error. Our team has been notified and is working on a fix."}
              </p>

              {/* Error ID */}
              {this.state.errorId && (
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 mb-6">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Error ID: <code className="font-mono font-medium">{this.state.errorId}</code>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {showRetry && this.state.retryCount < 3 && (
                  <button
                    onClick={this.handleRetry}
                    className="w-full px-4 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Retry the action that caused the error"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                    Try Again
                    {this.state.retryCount > 0 && (
                      <span className="ml-2 text-sm opacity-75">
                        (Attempt {this.state.retryCount + 1})
                      </span>
                    )}
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  {showGoBack && (
                    <button
                      onClick={this.handleGoBack}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      aria-label="Go back to the previous page"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                      Go Back
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    aria-label="Go to Social Caution homepage"
                  >
                    <Home className="w-4 h-4 mr-1" aria-hidden="true" />
                    Home
                  </button>
                </div>

                {/* Report Error Button */}
                <button
                  onClick={this.handleReportError}
                  className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center justify-center text-sm"
                  aria-label="Report this error to our support team"
                >
                  <Mail className="w-3 h-3 mr-1" aria-hidden="true" />
                  Report Error
                </button>
              </div>

              {/* Error Details - Show in production for debugging */}
              {this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                    Error Details
                  </summary>
                  <pre className="mt-3 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg text-xs text-gray-800 dark:text-gray-200 overflow-auto whitespace-pre-wrap max-h-40">
                    <strong>Error:</strong> {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack && (
                      <>
                        <br /><br />
                        <strong>Component Stack:</strong>
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default EnhancedErrorBoundary;

