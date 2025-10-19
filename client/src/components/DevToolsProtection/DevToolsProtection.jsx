import { useEffect, useRef } from 'react';

const DevToolsProtection = () => {
  const detectionRef = useRef(null);

  useEffect(() => {
    // Only apply protection in production
    if (import.meta.env.VITE_PROD === "development") {
      return;
    }

    // Enhanced dev tools detection
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // Dev tools detected - take action
        document.body.style.display = 'none';
        window.showDevToolsAlert();
        return true;
      }
      return false;
    };

    // Check periodically
    const interval = setInterval(detectDevTools, 1000);

    // Additional protection - monitor for console methods
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    };

    // Override console methods
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};

    // Detect if someone tries to restore console
    Object.defineProperty(window, 'console', {
      get: () => ({
        log: () => {},
        warn: () => {},
        error: () => {},
        info: () => {},
        debug: () => {}
      }),
      set: () => {}
    });

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
        window.showDevToolsAlert();
        return false;
      }
    };

    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      window.showDevToolsAlert();
      return false;
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      
      // Restore console methods only in development
      if (!import.meta.env.PROD) {
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        console.info = originalConsole.info;
        console.debug = originalConsole.debug;
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default DevToolsProtection; 