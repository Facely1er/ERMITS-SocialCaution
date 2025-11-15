import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import StandardPageHeader from '../common/StandardPageHeader';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  showBreadcrumbs?: boolean;
  className?: string;
  heroBackground?: boolean;
  heroType?: 'standard' | 'animated' | 'minimal';
  backgroundType?: 'particles' | 'matrix' | 'network' | 'privacy' | 'pricing' | 'resources' | 'toolkit' | 'blog' | 
                   'assessment' | 'personas' | 'tools' | 'contact' | 'about' | 'features' | 'help' | 'legal';
  backgroundImage?: string; // URL to background image
  backgroundImageOpacity?: number; // 0-1, default 0.15
  centered?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  description,
  breadcrumbs,
  showBreadcrumbs = false,
  className = '',
  heroBackground = false,
  heroType = 'standard',
  backgroundType = 'particles',
  backgroundImage,
  backgroundImageOpacity = 0.15,
}) => {
  return (
    <div className="min-h-screen bg-background dark:bg-background transition-colors duration-200">
      {/* Standardized Page Header */}
      {(title || showBreadcrumbs) && (
        <StandardPageHeader
          title={title || ''}
          subtitle={subtitle}
          description={description}
          breadcrumbs={breadcrumbs}
          showBreadcrumbs={showBreadcrumbs}
          heroType={heroBackground ? heroType : 'minimal'}
          heroBackground={heroBackground}
          backgroundType={backgroundType}
          backgroundImage={backgroundImage}
          backgroundImageOpacity={backgroundImageOpacity}
        />
      )}
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`flex-grow ${className} page-layout-main`}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default PageLayout;