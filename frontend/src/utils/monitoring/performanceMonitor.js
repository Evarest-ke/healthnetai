export const performanceMonitor = {
  trackPageLoad: (pageName) => {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    
    // Send to analytics
    console.log(`Page ${pageName} loaded in ${pageLoadTime}ms`);
  },

  trackApiCall: async (apiName, callback) => {
    const start = performance.now();
    try {
      const result = await callback();
      const duration = performance.now() - start;
      console.log(`API ${apiName} took ${duration}ms`);
      return result;
    } catch (error) {
      console.error(`API ${apiName} failed after ${performance.now() - start}ms`);
      throw error;
    }
  }
}; 