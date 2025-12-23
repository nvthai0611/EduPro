import { useEffect, useRef } from 'react';

/**
 * Hook to monitor page loading performance
 * Helps track if optimizations are working effectively
 */
export const usePerformanceMonitor = (pageName) => {
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    const loadTime = Date.now() - startTime.current;
    
    // Log performance metrics in development
    if (import.meta.env.DEV) {
      console.log(`🏁 ${pageName} loaded in ${loadTime}ms`);
      
      // Performance benchmarks
      if (loadTime < 500) {
        console.log('🚀 Excellent performance!');
      } else if (loadTime < 1000) {
        console.log('✅ Good performance');
      } else if (loadTime < 2000) {
        console.log('⚠️ Fair performance');
      } else {
        console.log('🐌 Poor performance - needs optimization');
      }
    }
    
    // In production, you could send metrics to analytics
    if (import.meta.env.PROD) {
      // Analytics tracking could go here
      // Example: analytics.track('page_load_time', { page: pageName, time: loadTime });
    }
  }, [pageName]);
  
  return {
    loadTime: Date.now() - startTime.current,
    startTime: startTime.current
  };
};

/**
 * Hook to track OAuth authentication performance
 * Monitors how fast login redirects work
 */
export const useAuthPerformanceMonitor = () => {
  const authStartTime = useRef(null);
  
  const startAuthTimer = () => {
    authStartTime.current = Date.now();
  };
  
  const endAuthTimer = () => {
    if (authStartTime.current) {
      const authTime = Date.now() - authStartTime.current;
      
      if (import.meta.env.DEV) {
        console.log(`🔐 OAuth completed in ${authTime}ms`);
        
        if (authTime < 200) {
          console.log('🚀 Lightning fast auth!');
        } else if (authTime < 500) {
          console.log('✅ Fast auth');
        } else {
          console.log('⚠️ Slow auth - check optimization');
        }
      }
      
      authStartTime.current = null;
      return authTime;
    }
    return 0;
  };
  
  return {
    startAuthTimer,
    endAuthTimer
  };
};