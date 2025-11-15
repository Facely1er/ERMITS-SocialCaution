import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationOptimizerProps {
  children: React.ReactNode;
}

const NavigationOptimizer: React.FC<NavigationOptimizerProps> = ({ children }) => {
  const location = useLocation();
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState({
    preferredSections: [] as string[],
    frequentPaths: [] as string[],
    lastVisited: null as string | null
  });

  // Track navigation patterns
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Update navigation history
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      if (newHistory[newHistory.length - 1] !== currentPath) {
        newHistory.push(currentPath);
        // Keep only last 10 navigation steps
        return newHistory.slice(-10);
      }
      return newHistory;
    });

    // Update user preferences based on navigation patterns
    setUserPreferences(prev => {
      const section = currentPath.split('/')[1] || 'home';
      const updatedPreferences = { ...prev };
      
      // Track frequent paths
      const pathCount = updatedPreferences.frequentPaths.filter(p => p === currentPath).length;
      if (pathCount === 0) {
        updatedPreferences.frequentPaths.push(currentPath);
      }
      
      // Track preferred sections
      if (!updatedPreferences.preferredSections.includes(section)) {
        updatedPreferences.preferredSections.push(section);
      }
      
      // Update last visited
      updatedPreferences.lastVisited = currentPath;
      
      return updatedPreferences;
    });

    // Preload likely next pages
    preloadLikelyPages(currentPath);
  }, [location.pathname]);

  // Preload likely next pages based on current location
  const preloadLikelyPages = (currentPath: string) => {
    const likelyPages: { [key: string]: string[] } = {
      '/': ['/assessment', '/personas', '/dashboard'],
      '/assessment': ['/assessment/exposure', '/assessment/rights', '/dashboard'],
      '/personas': ['/personas/cautious-parent', '/personas/privacy-advocate', '/assessment'],
      '/dashboard': ['/dashboard/action-plan', '/dashboard/history', '/resources'],
      '/resources': ['/resources/tools', '/resources/guides', '/blog']
    };

    const pagesToPreload = likelyPages[currentPath] || [];
    
    // Preload pages using link prefetching
    pagesToPreload.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  };

  // Optimize scroll behavior
  useEffect(() => {
    // Smooth scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Restore scroll position for back navigation
    const handlePopState = () => {
      const scrollPosition = sessionStorage.getItem(`scroll-${location.pathname}`);
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  // Optimize images and resources
  useEffect(() => {
    // Lazy load images that are not in viewport
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    return () => {
      imageObserver.disconnect();
    };
  }, [location.pathname]);

  // Provide navigation analytics to parent components
  useEffect(() => {
    // Dispatch custom event with navigation data
    const navigationEvent = new CustomEvent('navigationAnalytics', {
      detail: {
        currentPath: location.pathname,
        navigationHistory,
        userPreferences,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(navigationEvent);
  }, [location.pathname, navigationHistory, userPreferences]);

  return <>{children}</>;
};

export default NavigationOptimizer;