import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationEvent {
  path: string;
  timestamp: number;
  duration?: number;
  source?: string;
  userAgent?: string;
  screenSize?: string;
}

interface NavigationAnalyticsProps {
  children: React.ReactNode;
}

const NavigationAnalytics: React.FC<NavigationAnalyticsProps> = ({ children }) => {
  const location = useLocation();
  const [navigationEvents, setNavigationEvents] = useState<NavigationEvent[]>([]);
  const [sessionStart] = useState<number>(Date.now());

  // Track page view
  const trackPageView = useCallback((path: string) => {
    // Send analytics data to your analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: document.title
      });
    }

    // Track custom navigation metrics
    const sessionDuration = Date.now() - sessionStart;
    const navigationCount = navigationEvents.length;
    
    // Store navigation data in localStorage for analysis
    const navigationData = {
      path,
      timestamp: Date.now(),
      sessionDuration,
      navigationCount,
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`
    };

    try {
      const existingData = JSON.parse(localStorage.getItem('navigationAnalytics') || '[]');
      existingData.push(navigationData);
      
      // Keep only last 100 navigation events
      const trimmedData = existingData.slice(-100);
      localStorage.setItem('navigationAnalytics', JSON.stringify(trimmedData));
    } catch (error) {
      console.warn('Failed to store navigation analytics:', error);
    }
  }, [sessionStart, navigationEvents]);

  // Track navigation events
  useEffect(() => {
    const navigationEvent: NavigationEvent = {
      path: location.pathname,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      source: document.referrer || 'direct'
    };

    setNavigationEvents(prev => {
      const newEvents = [...prev];
      
      // Calculate duration for previous page
      if (newEvents.length > 0) {
        const lastEvent = newEvents[newEvents.length - 1];
        lastEvent.duration = navigationEvent.timestamp - lastEvent.timestamp;
      }
      
      newEvents.push(navigationEvent);
      
      // Keep only last 50 navigation events
      return newEvents.slice(-50);
    });

    // Track page view analytics
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  // Track user interactions
  useEffect(() => {
    const trackInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Track clicks on navigation elements
      if (target.closest('nav') || target.closest('[data-navigation]')) {
        // const interactionData = {
        //   type: 'navigation_click',
        //   element: target.tagName,
        //   path: location.pathname,
        //   timestamp: Date.now()
        // };
        
        // Send interaction data
        // Track navigation interaction (commented out for production)
      }
    };

    document.addEventListener('click', trackInteraction);
    
    return () => {
      document.removeEventListener('click', trackInteraction);
    };
  }, [location.pathname]);

  // Track performance metrics
  useEffect(() => {
    const trackPerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const performanceData = {
            path: location.pathname,
            timestamp: Date.now(),
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
          };
          
          // Store performance data
          try {
            const existingData = JSON.parse(localStorage.getItem('performanceAnalytics') || '[]');
            existingData.push(performanceData);
            localStorage.setItem('performanceAnalytics', JSON.stringify(existingData.slice(-50)));
          } catch (error) {
            console.warn('Failed to store performance analytics:', error);
          }
        }
      }
    };

    // Track performance after page load
    const timer = setTimeout(trackPerformance, 1000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Track user engagement
  useEffect(() => {
    let engagementTimer: NodeJS.Timeout;
    let isEngaged = false;

    const trackEngagement = () => {
      if (!isEngaged) {
        isEngaged = true;
        
        // const engagementData = {
        //   path: location.pathname,
        //   timestamp: Date.now(),
        //   type: 'user_engagement'
        // };
        
        // Track user engagement (commented out for production)
      }
    };

    const resetEngagement = () => {
      isEngaged = false;
    };

    // Track engagement on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, trackEngagement, { once: true });
    });

    // Reset engagement after 30 seconds of inactivity
    engagementTimer = setTimeout(resetEngagement, 30000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackEngagement);
      });
      clearTimeout(engagementTimer);
    };
  }, [location.pathname]);

  // Track navigation patterns
  useEffect(() => {
    // Navigation pattern tracking (currently unused but kept for future analytics)
    // const navigationPattern = {
    //   path: location.pathname,
    //   timestamp: Date.now(),
    //   referrer: document.referrer,
    //   navigationHistory: navigationEvents.map(e => e.path)
    // };

    // Analyze navigation patterns
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const section = pathSegments[0] || 'home';
    
    // Track section popularity
    try {
      const sectionData = JSON.parse(localStorage.getItem('sectionAnalytics') || '{}');
      sectionData[section] = (sectionData[section] || 0) + 1;
      localStorage.setItem('sectionAnalytics', JSON.stringify(sectionData));
    } catch (error) {
      console.warn('Failed to store section analytics:', error);
    }

    // Track common navigation paths
    if (navigationEvents.length > 1) {
      const lastPath = navigationEvents[navigationEvents.length - 2]?.path;
      if (lastPath) {
        const pathTransition = `${lastPath} -> ${location.pathname}`;
        
        try {
          const transitionData = JSON.parse(localStorage.getItem('transitionAnalytics') || '{}');
          transitionData[pathTransition] = (transitionData[pathTransition] || 0) + 1;
          localStorage.setItem('transitionAnalytics', JSON.stringify(transitionData));
        } catch (error) {
          console.warn('Failed to store transition analytics:', error);
        }
      }
    }
  }, [location.pathname, navigationEvents]);

  return <>{children}</>;
};

export default NavigationAnalytics;