import { defineConfig, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// Custom plugin to handle open event timeout issues
const handleOpenEventTimeout = () => {
  return {
    name: 'handle-open-event-timeout',
    configureServer(server: ViteDevServer) {
      // Add ping endpoint for connection health checks
      server.middlewares.use('/__vite_ping', (_req, res) => {
        res.end('pong');
      });
      
      // Add error handling middleware
      server.middlewares.use((req, res, next) => {
        req.on('error', (_err) => {
          // Log server request error (commented out for production)
        });
        res.on('error', (_err) => {
          // Log server response error (commented out for production)
        });
        next();
      });
    }
  };
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      // Explicitly set React as the JSX import source
      jsxImportSource: 'react',
      // Ensure React is available for createContext and other React APIs
      babel: {
        plugins: [],
        babelrc: false,
        configFile: false,
        // Ensure React is in scope
        presets: []
      }
    }),
    handleOpenEventTimeout(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'favicon.ico'],
      manifest: {
        name: 'SocialCaution',
        short_name: 'SocialCaution',
        description: 'Protect your digital privacy',
        theme_color: '#FF6B35',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pexels-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Disable PWA in development to avoid conflicts
      }
    }),
    // Add visualizer plugin when in analyze mode
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-dom/client'
    ],
    exclude: [],
    // Ensure React is pre-bundled before app code
    esbuildOptions: {
      // Preserve React module structure
      keepNames: true,
      // Ensure proper module resolution
      platform: 'browser'
    },
    // Force React to be included in the optimized deps
    force: false
  },
  server: {
    host: true,
    strictPort: false, // Allow Vite to use alternative port if 5173 is in use
    port: 5173,
    hmr: {
      overlay: true,
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
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console in production for debugging blank page issues
        drop_debugger: true,
        pure_funcs: [], // Don't remove any functions - safer for React
        passes: 1, // Single pass is safer and faster
        unsafe: false, // Disable unsafe optimizations to prevent initialization errors
        unsafe_comps: false,
        unsafe_math: false,
        unsafe_methods: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
        // Prevent breaking React exports
        keep_fargs: true,
        keep_infinity: true,
        side_effects: false // Preserve side effects which React relies on
      },
      mangle: {
        safari10: true, // Fix Safari 10 issues
        keep_fnames: true, // Keep function names to prevent React export errors
        keep_classnames: true, // Keep class names for React components
        reserved: [
          'createContext', 'createElement', 'createRoot', 'useState', 'useEffect', 
          'useContext', 'useRef', 'useCallback', 'useMemo', 'useReducer',
          'StrictMode', 'Suspense', 'Fragment', 'Component', 'PureComponent'
        ] // Reserved React API names
      },
      format: {
        comments: false // Remove all comments
      },
      keep_classnames: true, // Keep class names for React components
      keep_fnames: true // Keep function names to prevent React errors
    },
    // Enable compression
    reportCompressedSize: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
      rollupOptions: {
      // Removed external configuration - all dependencies must be bundled
      // External dependencies cause module resolution issues and React initialization errors
      // Preserve entry signatures to prevent initialization order issues
      preserveEntrySignatures: 'exports-only',
      // Prevent circular dependency issues
      onwarn(warning, warn) {
        // Suppress circular dependency warnings for known safe cases
        if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.ids) {
          // Allow circular dependencies between auth-related modules
          if (warning.ids.some((id: string) => id.includes('auth') || id.includes('store'))) {
            return;
          }
        }
        // Use default warning handler for other warnings
        warn(warning);
      },
      output: {
        // Ensure proper module format
        format: 'es',
        // Chunk splitting for better caching and reduced bundle sizes
        // Improved chunk organization to prevent initialization order issues
        manualChunks: (id) => {
          // ============================================
          // CRITICAL: React Core - MUST stay in main bundle
          // ============================================
          // React and React-DOM must remain in the main entry bundle
          // to ensure createContext, forwardRef, and other React APIs
          // are always available when any chunk loads
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react/jsx-runtime') ||
              id.includes('node_modules/react/jsx-dev-runtime')) {
            return undefined; // Keep React in main bundle
          }
          
          // ============================================
          // CRITICAL: All React-dependent libraries - MUST stay in main bundle
          // ============================================
          // These libraries directly use React APIs (forwardRef, createContext, etc.)
          // They MUST be in the same bundle as React to ensure React is available
          // when they initialize
          if (id.includes('node_modules/lucide-react') ||      // Uses React.forwardRef
              id.includes('node_modules/react-router-dom') || // Uses React APIs
              id.includes('node_modules/framer-motion') ||   // Uses React APIs
              id.includes('node_modules/recharts') ||         // Uses React APIs
              id.includes('node_modules/zustand')) {         // May use React APIs
            return undefined; // Keep all React-dependent libs in main bundle
          }
          
          // ============================================
          // CRITICAL: Contexts and Providers - MUST stay in main bundle
          // ============================================
          // All contexts/providers use React.createContext
          // They must stay with React in the main bundle
          if (id.includes('/contexts/') ||
              id.includes('/core/providers/') ||
              id.includes('/components/auth/') ||
              id.includes('/components/common/ToastProvider')) {
            return undefined; // Keep contexts in main bundle with React
          }
          
          // ============================================
          // CRITICAL: Hooks that use contexts - MUST stay in main bundle
          // ============================================
          // Hooks that use contexts need React available
          if (id.includes('/hooks/useDashboard') ||
              id.includes('/hooks/useAuth')) {
            return undefined; // Keep hooks using contexts in main bundle
          }
          
          // ============================================
          // CRITICAL: Components that use contexts - MUST stay in main bundle
          // ============================================
          // Components that directly use contexts need React available
          if (id.includes('/components/ThemeSwitcher') ||
              id.includes('/components/dashboard/ModernDashboardLayout') ||
              id.includes('/components/dashboard/ResourceRecommendations') ||
              id.includes('/components/dashboard/DashboardNav')) {
            return undefined; // Keep context-using components in main bundle
          }
          
          // ============================================
          // CRITICAL: Pages that use contexts - MUST stay in main bundle
          // ============================================
          // Pages that use contexts or hooks that use contexts need React available
          if (id.includes('/pages/dashboard/ProfilePage') ||
              id.includes('/pages/dashboard/SettingsPage') ||
              id.includes('/pages/dashboard/NotificationsPage') ||
              id.includes('/pages/dashboard/ModernDashboardHomePage') ||
              id.includes('/pages/dashboard/DashboardHomePage')) {
            return undefined; // Keep context-using pages in main bundle
          }
          
          // ============================================
          // CRITICAL: Stores and Services - MUST stay in main bundle
          // ============================================
          // Stores/services may use contexts or need React available
          // Keeping them in main bundle prevents circular dependencies
          if (id.includes('/store/') || 
              id.includes('/services/') ||
              id.includes('/lib/')) {
            return undefined; // Keep stores/services in main bundle
          }
          
          // ============================================
          // Non-React libraries - Can be split into vendor chunks
          // ============================================
          // These libraries don't directly depend on React APIs
          // They can be safely split into separate vendor chunks
          
          // PDF generation libraries
          if (id.includes('node_modules/jspdf') || 
              id.includes('node_modules/html2canvas')) {
            return 'vendor-pdf';
          }
          
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          
          // Store and services - keep in main bundle to prevent circular dependencies
          // and ensure React is available when stores are initialized
          // Note: Some stores might use contexts, so they need React available
          if (id.includes('/store/') || 
              id.includes('/services/') ||
              id.includes('/lib/')) {
            return undefined; // Keep stores/services in main bundle to prevent circular deps
          }
          
          // Feature chunks
          // Note: Pages that use contexts (BlogPage, PersonaSelectionPage) will be
          // handled by their context imports being in main bundle, but we still split
          // the page code itself for better caching
          if (id.includes('/pages/assessment/')) {
            return 'feature-assessment';
          }
          if (id.includes('/pages/resources/') || id.includes('/pages/tools/')) {
            return 'feature-resources-tools';
          }
          // BlogPage uses ToastContext, but the context is in main bundle
          // The page itself can be split as long as React is available
          if (id.includes('/pages/blog/')) {
            return 'feature-blog';
          }
          if (id.includes('/pages/legal/')) {
            return 'feature-legal';
          }
          if (id.includes('/pages/dashboard/') || 
              id.includes('/components/dashboard/')) {
            return 'feature-dashboard';
          }
          // PersonaSelectionPage uses PersonaProvider, but the provider is in main bundle
          // The page itself can be split as long as React is available
          if (id.includes('/pages/personas/')) {
            return 'feature-personas';
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers for better optimization
    target: 'esnext'
  }
}));