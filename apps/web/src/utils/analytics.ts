import ReactGA from 'react-ga4';

// Google Analytics configuration
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const IS_PRODUCTION = import.meta.env.PROD;
const IS_GITHUB_PAGES = window.location.hostname === 'tools.abhishekbansal.dev' || 
                        window.location.hostname.includes('github.io');

// Only initialize GA in production and on GitHub Pages
const SHOULD_TRACK = IS_PRODUCTION && IS_GITHUB_PAGES && GA_MEASUREMENT_ID;

export const initializeAnalytics = () => {
  if (SHOULD_TRACK) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      testMode: false,
      gaOptions: {
        send_page_view: false, // We'll manually send page views
      },
    });
    
    console.log('Google Analytics initialized');
  } else {
    console.log('Google Analytics disabled (not production or missing measurement ID)');
  }
};

export const trackPageView = (path: string, title?: string) => {
  if (SHOULD_TRACK) {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title || document.title,
    });
  }
};

export const trackEvent = (
  action: string,
  category: string = 'general',
  label?: string,
  value?: number
) => {
  if (SHOULD_TRACK) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};

// Tool-specific tracking functions
export const trackToolUsage = (toolName: string, action: string) => {
  trackEvent(action, 'tool_usage', toolName);
};

export const trackToolAction = (toolName: string, action: string, details?: string) => {
  trackEvent(action, 'tool_action', `${toolName}${details ? ` - ${details}` : ''}`);
};

export const trackCopy = (toolName: string, contentType: string = 'result') => {
  trackEvent('copy', 'tool_interaction', `${toolName} - ${contentType}`);
};

export const trackClear = (toolName: string) => {
  trackEvent('clear', 'tool_interaction', toolName);
};

export const trackThemeToggle = (newTheme: 'light' | 'dark') => {
  trackEvent('theme_toggle', 'ui_interaction', newTheme);
};

export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', 'ui_interaction', query, resultsCount);
};

// Helper to check if analytics is enabled
export const isAnalyticsEnabled = () => SHOULD_TRACK;
