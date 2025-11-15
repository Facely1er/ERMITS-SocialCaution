# Quick Fix Reference: React createContext Error

## Problem
**Error:** `Cannot read properties of undefined (reading 'createContext')`

## Quick Fix Steps

### Step 1: Update vite.config.ts Terser Options
```javascript
terserOptions: {
  compress: {
    keep_fargs: true
  },
  mangle: {
    keep_fnames: true,
    reserved: ['createContext', 'createElement', 'createRoot', 'useState', 'useEffect', 'useContext']
  },
  keep_classnames: true,
  keep_fnames: true
}
```

### Step 2: Add Explicit React Import
In files using React APIs (contexts, refs), add:
```javascript
import React from 'react';
// or
import React, { createContext } from 'react';
```

### Step 3: Clear Cache and Rebuild
```bash
rm -rf node_modules/.vite dist
npm run build
```

## Verification
Check if createContext is preserved:
```bash
cd dist/assets && grep -c "createContext" *.js
```

If the command returns counts > 0, the fix worked! ✅

## Root Cause
Aggressive minification was mangling React's function names, making React APIs undefined at runtime.

## Files to Check
- `vite.config.ts` - Terser configuration
- `src/App.tsx` - React imports
- Context files in `src/contexts/` and `src/core/providers/`

## Related Documentation
See `REACT_CONTEXT_FIX.md` for detailed explanation.
