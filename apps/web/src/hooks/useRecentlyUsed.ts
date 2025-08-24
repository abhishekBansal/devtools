import { useEffect, useState, useCallback } from 'react';
import type { ToolDef } from '../data/tools';

const STORAGE_KEY = 'devtools_recently_used';
const MAX_RECENT_TOOLS = 6;

interface RecentTool {
  slug: string;
  timestamp: number;
  visitCount: number;
}

type Subscriber = (items: RecentTool[]) => void;

// Module-scoped store so all hook instances share the same memory and avoid
// races where one instance loads an empty array and overwrites another instance's update.
const store = {
  items: [] as RecentTool[],
  lastUpdated: 0,
  subscribers: new Set<Subscriber>(),
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      store.items = parsed;
      store.lastUpdated = Date.now();
    } else if (parsed && typeof parsed === 'object') {
      // support wrapped payload
      // @ts-ignore
      const items = parsed.items;
      // @ts-ignore
      const updatedAt = Number(parsed.updatedAt) || Date.now();
      if (Array.isArray(items)) {
        store.items = items;
        store.lastUpdated = updatedAt;
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[useRecentlyUsed][store] failed to load from storage', err);
  }
}

function saveToStorage() {
  try {
    const payload = { updatedAt: Date.now(), items: store.items };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    // eslint-disable-next-line no-console
    console.debug('[useRecentlyUsed][store] saved to storage', payload);
    // dispatch event for same-tab listeners
    try {
      const evt = new CustomEvent('devtools_recently_used_updated', { detail: payload });
      window.dispatchEvent(evt);
    } catch (e) {
      // ignore
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[useRecentlyUsed][store] failed to save to storage', err);
  }
}

function notifySubscribers() {
  for (const sub of Array.from(store.subscribers)) {
    try {
      sub(store.items.slice());
    } catch (err) {
      // ignore
    }
  }
}

// Initialize store once
if (typeof window !== 'undefined') {
  loadFromStorage();

  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      try {
        if (!e.newValue) {
          store.items = [];
          store.lastUpdated = Date.now();
          notifySubscribers();
          return;
        }

        const parsed = JSON.parse(e.newValue);
        if (parsed && typeof parsed === 'object') {
          // @ts-ignore
          const items = parsed.items;
          // @ts-ignore
          const updatedAt = Number(parsed.updatedAt) || Date.now();
          if (Array.isArray(items) && updatedAt > store.lastUpdated) {
            store.items = items;
            store.lastUpdated = updatedAt;
            notifySubscribers();
          }
        } else if (Array.isArray(parsed)) {
          store.items = parsed;
          store.lastUpdated = Date.now();
          notifySubscribers();
        }
      } catch (err) {
        // ignore
      }
    }
  });

  // Also handle same-tab custom events
  window.addEventListener('devtools_recently_used_updated', (e: Event) => {
    try {
      // @ts-ignore
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail === 'object') {
        // @ts-ignore
        const items = detail.items;
        // @ts-ignore
        const updatedAt = Number(detail.updatedAt) || Date.now();
        if (Array.isArray(items) && updatedAt > store.lastUpdated) {
          store.items = items;
          store.lastUpdated = updatedAt;
          notifySubscribers();
        }
      }
    } catch (err) {
      // ignore
    }
  });
}

export function useRecentlyUsed() {
  const [items, setItems] = useState<RecentTool[]>(() => store.items.slice());

  useEffect(() => {
    const sub: Subscriber = (arr) => setItems(arr);
    store.subscribers.add(sub);
    // push current state immediately
    setItems(store.items.slice());
    return () => {
      store.subscribers.delete(sub);
    };
  }, []);

  const addRecentTool = useCallback((toolSlug: string) => {
    // eslint-disable-next-line no-console
    console.debug('[useRecentlyUsed][store] addRecentTool called for:', toolSlug);

    const now = Date.now();
    const existingIndex = store.items.findIndex(t => t.slug === toolSlug);
    let updated: RecentTool[];

    if (existingIndex !== -1) {
      const existing = store.items[existingIndex];
      const updatedTool = { ...existing, timestamp: now, visitCount: existing.visitCount + 1 };
      updated = [updatedTool, ...store.items.slice(0, existingIndex), ...store.items.slice(existingIndex + 1)];
    } else {
      updated = [{ slug: toolSlug, timestamp: now, visitCount: 1 }, ...store.items];
    }

    store.items = updated.slice(0, MAX_RECENT_TOOLS);
    store.lastUpdated = now;
    notifySubscribers();
    saveToStorage();
  }, []);

  const removeRecentTool = useCallback((toolSlug: string) => {
    store.items = store.items.filter(t => t.slug !== toolSlug);
    store.lastUpdated = Date.now();
    notifySubscribers();
    saveToStorage();
  }, []);

  const clearRecentTools = useCallback(() => {
    store.items = [];
    store.lastUpdated = Date.now();
    notifySubscribers();
    saveToStorage();
  }, []);

  const getRecentToolsSlugs = useCallback(() => store.items.map(t => t.slug), []);

  const getRecentToolsWithDetails = useCallback((allTools: ToolDef[]) => {
    return store.items
      .map(recent => {
        const def = allTools.find(t => t.slug === recent.slug);
        if (!def) return null;
        return { ...def, visitCount: recent.visitCount, lastUsed: new Date(recent.timestamp) } as ToolDef & { visitCount: number; lastUsed: Date };
      })
      .filter((t): t is ToolDef & { visitCount: number; lastUsed: Date } => t !== null);
  }, []);

  return {
    recentTools: items,
    addRecentTool,
    removeRecentTool,
    clearRecentTools,
    getRecentToolsSlugs,
    getRecentToolsWithDetails,
    hasRecentTools: items.length > 0,
  };
}
