import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import DashboardNav from '../dashboard/DashboardNav';
import Breadcrumb from '../common/Breadcrumb';
import Button from '../common/Button';
import '../../styles/dashboard.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  showBreadcrumbs?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  title,
  subtitle,
  breadcrumbs,
  showBreadcrumbs = true
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout min-h-screen bg-background-secondary dark:bg-background-secondary flex transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={`dashboard-sidebar w-56 bg-card dark:bg-card border-r border-border dark:border-border transition-colors duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:relative top-16 md:top-0 h-[calc(100vh-4rem)] md:h-screen z-50 md:z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-border md:hidden">
          <h2 className="text-lg font-semibold text-text dark:text-text">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <DashboardNav />
      </motion.aside>

      {/* Main Content */}
      <main className="dashboard-main flex-1 min-h-screen ml-0 md:ml-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-card dark:bg-card border-b border-border dark:border-border px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-text dark:text-text">Dashboard</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Desktop Breadcrumbs and Title */}
        <div className="hidden md:block">
          {(showBreadcrumbs || title) && (
            <div className="mb-4">
              {showBreadcrumbs && (
                <div className="mb-2">
                  <Breadcrumb items={breadcrumbs} />
                </div>
              )}
              {title && (
                <div>
                  <h1 className="text-2xl font-bold text-text dark:text-text mb-1 transition-colors duration-200">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-text-secondary dark:text-text-secondary transition-colors duration-200">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 md:px-6 lg:px-8 py-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;