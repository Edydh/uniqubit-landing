import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment detection
  environment: process.env.NODE_ENV || 'development',
  
  // Enhanced error tracking
  beforeSend(event, hint) {
    // Filter out development errors in production
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Enhanced error context for uniQubit platform
    if (event.exception) {
      const error = hint.originalException;
      
      // Add custom tags for better error categorization
      event.tags = {
        ...event.tags,
        component: 'client',
        platform: 'uniqubit'
      };
      
      // Add user context if available
      const user = event.user || {};
      if (typeof window !== 'undefined' && window.localStorage) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            event.user = {
              ...user,
              id: parsedUser.id,
              email: parsedUser.email,
              role: parsedUser.role
            };
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }
    
    return event;
  },
  
  // Custom integrations for uniQubit
  integrations: [
    new Sentry.BrowserTracing({
      // Track page transitions
      routingInstrumentation: Sentry.nextRouterInstrumentation,
      
      // Custom transaction names for better monitoring
      beforeNavigate: context => {
        return {
          ...context,
          name: context.location.pathname.includes('/admin') 
            ? `Admin: ${context.location.pathname}`
            : context.location.pathname.includes('/client')
            ? `Client: ${context.location.pathname}`
            : context.location.pathname
        };
      }
    }),
    new Sentry.Replay({
      // Mask sensitive data
      maskAllText: false,
      maskAllInputs: true,
      blockAllMedia: false,
    })
  ]
});
