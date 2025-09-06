"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  expiry: string | null;
  userId: number | null;
  isStaff: boolean;
  login: (token: string, expiry: string, user: { id: number; is_staff: boolean }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isStaff, setIsStaff] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedExpiry = localStorage.getItem('tokenExpiry');
    const savedId = localStorage.getItem("id");

    if (savedToken && savedExpiry) {
      setToken(savedToken);
      setExpiry(savedExpiry);
      setIsAuthenticated(true);

      (async () => {
        try {
          const res = await fetch(`https://clinic-ashen.vercel.app/auth/${savedId}/`, {
            headers: {
              'Authorization': `Token ${savedToken}`,
            },
            cache: "no-cache"
          });
          if (!res.ok) throw new Error("Failed to fetch user data");

          const user = await res.json();
          setUserId(user.id);
          setIsStaff(user.is_staff);
          localStorage.setItem("id", user.id);
        } catch (err) {
          console.error("Error fetching user data:", err);
          logout();
        }
      })();
    }
  }, []);

  const login = (token: string, expiry: string, user: { id: number; is_staff: boolean }) => {
    setToken(token);
    setExpiry(expiry);
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiry', expiry);
    localStorage.setItem('id', JSON.stringify(user.id));

    setUserId(user.id);
    setIsStaff(user.is_staff);

    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setExpiry(null);
    setUserId(null);
    setIsStaff(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, expiry, userId, isStaff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
