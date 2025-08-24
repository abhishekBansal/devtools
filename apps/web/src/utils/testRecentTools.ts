// Utility for testing recently used tools functionality

export const testAddRecentTool = () => {
  const STORAGE_KEY = 'devtools_recently_used';
  
  const testTool = {
    slug: 'base64-encoder-decoder',
    timestamp: Date.now(),
    visitCount: 1
  };
  
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const tools = existing ? JSON.parse(existing) : [];
    
    const updatedTools = [testTool, ...tools].slice(0, 6);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTools));
    
    console.log('Added test tool to localStorage:', updatedTools);
    return true;
  } catch (error) {
    console.error('Failed to add test tool:', error);
    return false;
  }
};

export const clearRecentTools = () => {
  const STORAGE_KEY = 'devtools_recently_used';
  localStorage.removeItem(STORAGE_KEY);
  console.log('Cleared recent tools from localStorage');
};

export const getRecentTools = () => {
  const STORAGE_KEY = 'devtools_recently_used';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get recent tools:', error);
    return [];
  }
};

// Make functions available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testAddRecentTool = testAddRecentTool;
  (window as any).clearRecentTools = clearRecentTools;
  (window as any).getRecentTools = getRecentTools;
}
