/**
 * Production-safe logger utility
 * Only logs in development mode or when explicitly enabled
 */

const isDevelopment = import.meta.env.DEV;
const isErrorLoggingEnabled = import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true';

class Logger {
  private shouldLog(level: 'log' | 'warn' | 'error' | 'info' | 'debug'): boolean {
    if (level === 'error') {
      return isDevelopment || isErrorLoggingEnabled;
    }
    return isDevelopment;
  }

  log(...args: any[]): void {
    if (this.shouldLog('log')) {
      console.log(...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(...args);
    }
    // In production, send to error tracking service
    if (import.meta.env.PROD && typeof (window as any).Sentry?.captureException === 'function') {
      try {
        (window as any).Sentry.captureException(args[0] instanceof Error ? args[0] : new Error(String(args[0])));
      } catch (e) {
        // Ignore Sentry errors
      }
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(...args);
    }
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...args);
    }
  }
}

export const logger = new Logger();
export default logger;

