# React createContext Error Fix

## Issue
```
Uncaught TypeError: Cannot read properties of undefined (reading 'createContext')
at chunk-Cwa_tY14.js:1:23250
```

This error occurred when React's `createContext` method was called before React was properly loaded or when aggressive minification mangled React's exports.

## Root Cause
The error was caused by **overly aggressive Terser minification settings** in the Vite build configuration that were:
1. Mangling React's function names (`keep_fnames: false`)
2. Mangling React's class names (`keep_classnames: false`)
3. Not reserving critical React API names from being mangled
4. Missing the React import in App.tsx (using automatic JSX runtime but contexts need explicit React)

## Solutions Applied

### 1. Fixed Terser Minification Options (`vite.config.ts`)

**Before:**
```javascript
mangle: {
  safari10: true,
  keep_fnames: false, // This was breaking React exports!
  reserved: []
},
keep_classnames: false,
keep_fnames: false
```

**After:**
```javascript
compress: {
  // ... existing options ...
  keep_fargs: true  // Added: Preserve function arguments
},
mangle: {
  safari10: true,
  keep_fnames: true,  // Changed: Keep function names for React
  reserved: ['createContext', 'createElement', 'createRoot', 'useState', 'useEffect', 'useContext'] // Added: Reserved React API names
},
keep_classnames: true,  // Changed: Keep class names for React components
keep_fnames: true       // Changed: Keep function names
```

### 2. Improved Chunk Configuration

Added explicit module format and improved React chunk detection:

```javascript
output: {
  format: 'es',  // Added: Ensure proper ES module format
  manualChunks: (id) => {
    const isReact = id.includes('node_modules/react/') ||
        id.includes('node_modules/react-dom/') ||
        id.includes('node_modules/scheduler/') ||
        id.includes('react/jsx-runtime');  // Added: Include jsx-runtime
    
    if (isReact) {
      return 'vendor-react';
    }
    // ... context providers chunk ...
  }
}
```

### 3. Added Explicit React Import in App.tsx

**Before:**
```javascript
import { Suspense, lazy } from 'react';
```

**After:**
```javascript
import React, { Suspense, lazy } from 'react';
```

While the automatic JSX runtime handles JSX transformation, context providers need explicit React imports.

### 4. Cleared Build Artifacts

Removed cached and outdated build files:
- `rm -rf node_modules/.vite` - Cleared Vite cache
- `rm -rf dist` - Cleared old build output

## Why This Fix Works

1. **Preserving Function Names**: React's API relies on function names for proper exports. When Terser mangles these names, React becomes `undefined` when imported.

2. **Reserved React APIs**: By explicitly reserving critical React API names like `createContext`, we ensure they're never mangled during minification.

3. **Class Name Preservation**: React components need their class names preserved for proper initialization and debugging.

4. **Explicit React Import**: While JSX transformation works with automatic runtime, React context APIs need the React object to be explicitly imported.

5. **Proper Module Format**: Setting `format: 'es'` ensures proper ES module handling and prevents module resolution issues.

## Verification

Build completed successfully with proper chunk structure:
```bash
✓ built in 13.80s

PWA v1.1.0
mode      generateSW
precache  44 entries (3205.07 KiB)
```

## Files Modified

1. `/workspace/vite.config.ts` - Updated Terser options and chunk configuration
2. `/workspace/src/App.tsx` - Added explicit React import

## Prevention

To prevent this issue in the future:
- Always preserve React function and class names during minification
- Reserve critical React API names from mangling
- Test production builds locally before deployment
- Clear Vite cache when encountering mysterious build issues
- Use explicit React imports when using React APIs directly (contexts, refs, etc.)

## Testing

After applying these fixes:
1. Clear cache: `rm -rf node_modules/.vite dist`
2. Rebuild: `npm run build`
3. Preview: `npm run preview`
4. Test the production build in the browser

The application should now load without the createContext error.
