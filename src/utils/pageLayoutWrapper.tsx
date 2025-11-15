import React from 'react';
import PageLayout from '../components/layout/PageLayout';

interface PageWrapperProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  showBreadcrumbs?: boolean;
  heroBackground?: boolean;
  centered?: boolean;
  children: React.ReactNode;
}

export const wrapWithPageLayout = (
  Component: React.ComponentType,
  options: Omit<PageWrapperProps, 'children'>
) => {
  return (props: any) => (
    <PageLayout {...options}>
      <Component {...props} />
    </PageLayout>
  );
};

// Helper function to generate breadcrumbs from path
export const generateBreadcrumbsFromPath = (path: string, labels?: Record<string, string>) => {
  const segments = path.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const currentPath = '/' + segments.slice(0, index + 1).join('/');
    const label = labels?.[segment] || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return { label, path: currentPath };
  });
};