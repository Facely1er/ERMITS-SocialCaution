# HMR Timeout Fix Documentation

## Issue Description
The application was experiencing "Restarting because open event was not received in time..." errors, which caused the development server to restart repeatedly. This is typically related to Vite's Hot Module Replacement (HMR) WebSocket connection timing out.

## Root Cause
The issue was caused by:
1. Vite's HMR WebSocket connection timing out due to network or configuration issues
2. PWA plugin potentially interfering with HMR in development mode
3. Missing error handling for HMR connection issues

## Solutions Implemented

### 1. Vite Configuration Updates (`vite.config.ts`)
- **HMR Configuration**: Added explicit HMR port and client port configuration
- **CORS Headers**: Added proper CORS headers to prevent connection issues
- **PWA Plugin**: Disabled PWA in development mode to prevent conflicts
- **File System**: Relaxed file system restrictions
- **Custom Plugin**: Added error handling middleware for server requests/responses

### 2. Client-Side Monitoring (`src/utils/hmrMonitor.ts`)
- **HMR Error Tracking**: Monitors and logs HMR errors
- **Restart Limiting**: Prevents excessive restarts within a time window
- **User Notifications**: Shows user-friendly notifications when issues persist
- **Statistics**: Provides restart count and timing information

### 3. HTML Integration (`index.html`)
- **HMR Event Listeners**: Added client-side HMR event monitoring
- **Error Logging**: Enhanced error logging for debugging

## Key Configuration Changes

```typescript
// vite.config.ts
server: {
  host: true,
  strictPort: true,
  port: 5173,
  hmr: {
    port: 5173,
    overlay: true,
    clientPort: 5173
  },
  cors: true,
  headers: {
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Cross-Origin-Opener-Policy': 'same-origin'
  },
  fs: {
    strict: false
  }
}
```

## Monitoring

The HMR monitor provides the following statistics:
- `restartCount`: Number of HMR restarts in the current window
- `lastRestartTime`: Timestamp of the last restart
- `timeSinceLastRestart`: Time elapsed since the last restart

## Testing

To test the fix:
1. Start the development server: `npm run dev`
2. Monitor the console for HMR-related messages
3. Check for the absence of "open event was not received in time" errors
4. Verify that the application loads without repeated restarts

## Troubleshooting

If the issue persists:
1. Check the browser console for HMR error messages
2. Verify network connectivity to the development server
3. Try clearing browser cache and reloading
4. Check if any browser extensions are interfering with WebSocket connections
5. Monitor the HMR statistics using the `hmrMonitor.getStats()` method

## Prevention

The implemented solution includes:
- Better error handling and logging
- Connection health monitoring
- User notifications for persistent issues
- Graceful degradation when HMR fails