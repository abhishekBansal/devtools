import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecentlyUsed } from '../hooks/useRecentlyUsed';

export const useToolTracker = () => {
  const location = useLocation();
  const { addRecentTool } = useRecentlyUsed();
  const lastTrackedTool = useRef<string | null>(null);

  useEffect(() => {
  // debug
  // eslint-disable-next-line no-console
  console.debug('[useToolTracker] location.pathname:', location.pathname);
    // Extract tool slug from pathname like /tools/base64-encoder-decoder
    const toolMatch = location.pathname.match(/^\/tools\/(.+)$/);
    
    if (toolMatch) {
      const toolSlug = toolMatch[1];
      // debug
      // eslint-disable-next-line no-console
      console.debug('[useToolTracker] matched toolSlug:', toolSlug, 'lastTracked:', lastTrackedTool.current);

      // Only track if it's a different tool from the last one
      if (lastTrackedTool.current !== toolSlug) {
        lastTrackedTool.current = toolSlug;
        // debug
        // eslint-disable-next-line no-console
        console.debug('[useToolTracker] tracking tool:', toolSlug);
        addRecentTool(toolSlug);
      }
    } else {
      lastTrackedTool.current = null;
    }
  }, [location.pathname, addRecentTool]);
};

// Higher-order component to wrap tool pages
export function withToolTracking<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function TrackedComponent(props: T) {
    useToolTracker();
    return React.createElement(WrappedComponent, props);
  };
}
