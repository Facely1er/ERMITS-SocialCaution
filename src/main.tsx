import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import logger from './utils/logger';

// Global error handlers for debugging blank page issues
if (typeof window !== 'undefined') {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection:', event.reason);
    logger.error('Promise rejection details:', {
      reason: event.reason,
      promise: event.promise
    });
  });

  // Catch uncaught errors
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error:', event.error);
    logger.error('Error details:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  // Page load handlers (removed console.log for production)
  window.addEventListener('load', () => {
    // Page fully loaded
  });

  // DOM ready handlers (removed console.log for production)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // DOM content loaded
    });
  }
}

// Get root element and render app
const rootElement = document.getElementById('root');
if (!rootElement) {
  // Show error message in the page if root element is missing
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; padding: 20px; text-align: center;">
      <div>
        <h1 style="color: #dc2626; margin-bottom: 16px;">Application Error</h1>
        <p style="color: #6b7280; margin-bottom: 8px;">Root element not found. Please check the HTML structure.</p>
        <p style="color: #9ca3af; font-size: 14px;">Expected element: &lt;div id="root"&gt;&lt;/div&gt;</p>
      </div>
    </div>
  `;
  throw new Error('Root element not found');
}

// Render app with error boundary
try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  // If React rendering fails, show error message
  logger.error('CRITICAL: Failed to render React app:', error);
  logger.error('Error details:', {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    name: error instanceof Error ? error.name : undefined
  });
  
  // Show error UI immediately
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; padding: 20px; text-align: center; background: #f9fafb;">
      <div style="max-width: 600px;">
        <h1 style="color: #dc2626; margin-bottom: 16px; font-size: 24px;">Application Failed to Load</h1>
        <p style="color: #6b7280; margin-bottom: 16px;">We're sorry, but the application encountered an error during initialization.</p>
        <p style="color: #9ca3af; margin-bottom: 8px; font-size: 14px;">Error: ${error instanceof Error ? error.message : String(error)}</p>
        <p style="color: #9ca3af; margin-bottom: 24px; font-size: 14px;">Please check the browser console for more details.</p>
        <button onclick="window.location.reload()" style="background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500;">
          Refresh Page
        </button>
      </div>
    </div>
  `;
  
  // Re-throw to ensure it's logged
  throw error;
}