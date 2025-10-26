'use client';

// Check if we're really in a browser environment with a real localStorage
const isRealBrowser = (): boolean => {
  try {
    // Don't even access localStorage properties during checks
    return typeof window !== 'undefined' && 
           window.localStorage !== undefined &&
           window.localStorage !== null;
  } catch {
    return false;
  }
};

// Safe localStorage wrapper that handles SSR gracefully
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isRealBrowser()) return null;
    try {
      const ls = window.localStorage;
      // Additional runtime check
      if (!ls || typeof ls.getItem !== 'function') return null;
      return ls.getItem(key);
    } catch (error) {
      console.error('localStorage.getItem error:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!isRealBrowser()) return;
    try {
      const ls = window.localStorage;
      if (!ls || typeof ls.setItem !== 'function') return;
      ls.setItem(key, value);
    } catch (error) {
      console.error('localStorage.setItem error:', error);
    }
  },
  
  removeItem: (key: string): void => {
    if (!isRealBrowser()) return;
    try {
      const ls = window.localStorage;
      if (!ls || typeof ls.removeItem !== 'function') return;
      ls.removeItem(key);
    } catch (error) {
      console.error('localStorage.removeItem error:', error);
    }
  },
  
  keys: (): string[] => {
    if (!isRealBrowser()) return [];
    try {
      const ls = window.localStorage;
      if (!ls) return [];
      return Object.keys(ls);
    } catch (error) {
      console.error('localStorage.keys error:', error);
      return [];
    }
  }
};
