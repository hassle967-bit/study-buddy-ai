import { useState, useEffect, useCallback } from 'react';

// Simple global state for auth
let isAuthenticated = localStorage.getItem('studyAssistantUser') === 'true';
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function useAuth() {
  const [isAuth, setIsAuth] = useState(isAuthenticated);

  useEffect(() => {
    const handleStorage = () => {
      const currentAuth = localStorage.getItem('studyAssistantUser') === 'true';
      if (currentAuth !== isAuthenticated) {
        isAuthenticated = currentAuth;
        notify();
      }
    };

    window.addEventListener('storage', handleStorage);
    
    const unsubscribe = () => {
      listeners.delete(() => setIsAuth(isAuthenticated));
    };
    
    const listener = () => setIsAuth(isAuthenticated);
    listeners.add(listener);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      unsubscribe();
    };
  }, []);

  const login = useCallback(() => {
    localStorage.setItem('studyAssistantUser', 'true');
    isAuthenticated = true;
    notify();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('studyAssistantUser');
    isAuthenticated = false;
    notify();
  }, []);

  return {
    isAuthenticated: isAuth,
    login,
    logout,
  };
}
