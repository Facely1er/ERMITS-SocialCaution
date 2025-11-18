import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, Search, User, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardNav from './DashboardNav';
import Button from '../common/Button';
import Logo from '../common/Logo';
import { useAuth } from '../../components/auth/AuthContext';
import SearchModal from '../navigation/SearchModal';
import { useSearchShortcut } from '../../hooks/useKeyboardShortcut';

interface ModernDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  showHeader = true
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  // Enable Cmd+K / Ctrl+K for search
  useSearchShortcut(() => setSearchOpen(true));

  return (
    <div className="min-h-screen bg-background-secondary dark:bg-background-secondary transition-colors duration-200">
      {/* Skip to main content link for accessibility */}
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-accent focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-dark focus:ring-offset-2 font-medium"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Global Search Modal - Keyboard shortcut: Cmd+K / Ctrl+K */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {/* Top Navigation Bar */}
      <nav className="bg-primary text-white h-16 flex items-center justify-between px-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Logo size={32} light />
            <h1 className="text-lg font-semibold">SocialCaution</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="hidden md:flex items-center space-x-2 text-white hover:text-accent transition-colors text-sm"
          >
            <Home className="h-4 w-4" />
            <span>Back to Main Site</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>
      
      <div className="flex min-h-[calc(100vh-4rem)] relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={`fixed md:sticky top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-screen w-72 modern-sidebar z-50 md:z-10 transition-transform duration-300 flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-border">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Logo size={32} />
            <div>
              <h2 className="text-lg font-semibold text-text dark:text-text">SocialCaution</h2>
              <p className="text-xs text-text-secondary dark:text-text-secondary">Privacy Dashboard</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <DashboardNav />
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-x-hidden bg-background-secondary dark:bg-background-secondary min-h-[calc(100vh-4rem)] md:min-h-screen">
        {/* Header */}
        {showHeader && (
          <header className="modern-header sticky top-0 z-30">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div>
                    {title && (
                      <h1 className="text-2xl font-bold text-text dark:text-text">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="text-text-secondary dark:text-text-secondary">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Back to Main Site Link - Mobile */}
                  <Link 
                    to="/" 
                    className="md:hidden flex items-center space-x-2 text-text-secondary dark:text-text-secondary hover:text-accent transition-colors"
                    title="Back to Main Site"
                  >
                    <Home className="h-5 w-5" />
                  </Link>
                  
                  {/* Search */}
                  <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary dark:text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search dashboard..."
                      className="pl-10 pr-4 py-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                    />
                  </div>
                  
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full text-xs text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>
                  
                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden md:block">
                      {user ? (
                        <>
                          <p className="text-sm font-medium text-text dark:text-text">
                            {user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-xs text-text-secondary dark:text-text-secondary">
                            {user.email || 'user@example.com'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-text dark:text-text">
                            Guest Mode
                          </p>
                          <p className="text-xs text-text-secondary dark:text-text-secondary">
                            Sign in for enhanced features
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}
        
        {/* Page Content */}
        <main id="dashboard-main" className="p-4 md:p-6 bg-background-secondary dark:bg-background-secondary min-h-full" role="main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
      </div>
    </div>
  );
};

export default ModernDashboardLayout;