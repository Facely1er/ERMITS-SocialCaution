import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppSimplified from './AppSimplified.tsx';
import './index.css';

// Global error handlers for debugging
if (typeof window !== 'undefined') {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });

  // Catch uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
  });
}

// Get root element and render app
const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-center; min-height: 100vh; font-family: system-ui, sans-serif; padding: 20px; text-align: center;">
      <div>
        <h1 style="color: #dc2626; margin-bottom: 16px;">Application Error</h1>
        <p style="color: #6b7280; margin-bottom: 8px;">Root element not found. Please check the HTML structure.</p>
        <p style="color: #9ca3af; font-size: 14px;">Expected element: &lt;div id="root"&gt;&lt;/div&gt;</p>
      </div>
    </div>
  `;
  throw new Error('Root element not found');
}

// Render simplified MVP app
try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <AppSimplified />
    </StrictMode>
  );
} catch (error) {
  console.error('CRITICAL: Failed to render React app:', error);

  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-center; min-height: 100vh; font-family: system-ui, sans-serif; padding: 20px; text-align: center; background: #f9fafb;">
      <div style="max-width: 600px;">
        <h1 style="color: #dc2626; margin-bottom: 16px; font-size: 24px;">Application Failed to Load</h1>
        <p style="color: #6b7280; margin-bottom: 16px;">We're sorry, but the application encountered an error during initialization.</p>
        <p style="color: #9ca3af; margin-bottom: 8px; font-size: 14px;">Error: ${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="window.location.reload()" style="background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500;">
          Refresh Page
        </button>
      </div>
    </div>
  `;

  throw error;
}
