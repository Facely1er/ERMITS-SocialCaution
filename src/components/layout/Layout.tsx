import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../utils/ScrollToTop';
import SmartBreadcrumb from '../navigation/SmartBreadcrumb';
import NavigationAnalytics from '../navigation/NavigationAnalytics';
import NavigationOptimizer from '../navigation/NavigationOptimizer';
import MetaTagManager from '../common/MetaTagManager';
import ContextualNav from '../navigation/ContextualNav';
import SearchModal from '../navigation/SearchModal';
import BottomNav from '../navigation/BottomNav';
import { useSearchShortcut } from '../../hooks/useKeyboardShortcut';

const Layout: React.FC = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  // Enable Cmd+K / Ctrl+K for search
  useSearchShortcut(() => setSearchOpen(true));

  // Check if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // Show breadcrumbs and progress on specific pages
  const showBreadcrumbs = !location.pathname.includes('/dashboard') && 
                         location.pathname !== '/' && 
                         !location.pathname.includes('/resources/tools');
  const showProgress = ['/assessment', '/personas', '/dashboard', '/resources'].some(path =>
    location.pathname.startsWith(path)
  );
  
  // Show contextual nav on relevant pages (not on home, dashboard, or tool pages)
  const showContextualNav = !isDashboardRoute && 
                           location.pathname !== '/' && 
                           !location.pathname.includes('/resources/tools') &&
                           !location.pathname.includes('/blog') &&
                           !location.pathname.includes('/legal');

  // For dashboard routes, render without the main layout structure
  if (isDashboardRoute) {
    return (
      <NavigationAnalytics>
        <NavigationOptimizer>
          <MetaTagManager />
          <ScrollToTop />
          <Outlet />
        </NavigationOptimizer>
      </NavigationAnalytics>
    );
  }

  return (
    <NavigationAnalytics>
      <NavigationOptimizer>
        <MetaTagManager />
        <div className="flex flex-col min-h-screen bg-background transition-colors duration-200">
          <ScrollToTop />
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Skip to main content"
          >
            Skip to main content
          </a>

          {/* Global Search Modal - Keyboard shortcut: Cmd+K / Ctrl+K */}
          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

          <Navbar />

          {/* Unified Breadcrumbs and Progress Navigation Bar */}
          {(showBreadcrumbs || showProgress) && (
            <div className="sticky top-16 z-40 bg-white dark:bg-card border-b border-border px-4 py-2 shadow-sm">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center h-8">
                  <SmartBreadcrumb
                    showBackButton={true}
                    showProgress={showProgress}
                  />
                </div>
              </div>
            </div>
          )}

          <main id="main-content" className={`flex-grow flex flex-col ${(showBreadcrumbs || showProgress) ? 'with-breadcrumbs' : ''} pb-16 md:pb-0`} role="main">
            <Outlet />
          </main>
          {showContextualNav && <ContextualNav />}
          <Footer className="hidden md:block" />

          {/* Mobile Bottom Navigation */}
          <BottomNav />
        </div>
      </NavigationOptimizer>
    </NavigationAnalytics>
  );
};

export default Layout;