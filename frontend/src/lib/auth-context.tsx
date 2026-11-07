'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from './types';
import { store } from './store';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<UserProfile>;
  signup: (name: string, email: string, password?: string, goal?: string) => Promise<UserProfile>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('finetube_user');
      if (saved) {
        const parsed: UserProfile = JSON.parse(saved);
        setUser(parsed);
        store.currentUser = parsed;
        store.user = parsed;
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<UserProfile> => {
    // Try backend API first, fallback to store
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'password123' })
      });
      if (res.ok) {
        const json = await res.json();
        const profile = json.data.user;
        setUser(profile);
        store.currentUser = profile;
        store.user = profile;
        localStorage.setItem('finetube_user', JSON.stringify(profile));
        return profile;
      }
    } catch {
      // offline / backend not started yet
    }

    const localUser = store.login(email);
    setUser({ ...localUser });
    return localUser;
  };

  const signup = async (name: string, email: string, password?: string, goal?: string): Promise<UserProfile> => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password || 'password123', learningGoal: goal })
      });
      if (res.ok) {
        const json = await res.json();
        const profile = json.data.user;
        setUser(profile);
        store.currentUser = profile;
        store.user = profile;
        localStorage.setItem('finetube_user', JSON.stringify(profile));
        return profile;
      }
    } catch {
      // offline
    }

    const localUser = store.signup(name, email, goal);
    setUser({ ...localUser });
    return localUser;
  };

  const logout = () => {
    store.logout();
    setUser(null);
    localStorage.removeItem('finetube_user');
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const updated = store.updateProfile(updates);
    setUser({ ...updated });

    try {
      await fetch('http://localhost:5000/api/v1/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updated, ...updates })
      });
    } catch {
      // ignore
    }

    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
