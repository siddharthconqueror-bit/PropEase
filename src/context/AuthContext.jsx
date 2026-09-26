import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('propease_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    return null;
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('propease_onboarded') === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('propease_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('propease_user');
      localStorage.removeItem('propease_jwt_token');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem('propease_onboarded', 'true');
        setHasCompletedOnboarding(true);
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      console.error('Login error:', err);
      // Fallback for offline/custom auth
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      return { success: false, message: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem('propease_onboarded', 'true');
        setHasCompletedOnboarding(true);
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Registration response invalid' };
    } catch (err) {
      console.error('Register error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed.';
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const completeOnboarding = () => {
    localStorage.setItem('propease_onboarded', 'true');
    setHasCompletedOnboarding(true);
  };

  const updateUserRole = (newRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('propease_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasCompletedOnboarding,
        completeOnboarding,
        login,
        register,
        logout,
        updateUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
