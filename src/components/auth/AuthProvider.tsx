import React, { useEffect, useState, type FC, type ReactNode } from 'react';
import localStorageService, { LocalUser } from '../../services/localStorageService';
import { AuthContext, AuthContextType } from './AuthContext';

interface User extends LocalUser {}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find user by email in localStorage
      const foundUser = localStorageService.getUserByEmail(email);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Verify password (in production, use proper password hashing)
      // For demo purposes, we'll check if password matches
      // Security: Require password to be set and match
      if (!foundUser.password) {
        throw new Error('Invalid email or password');
      }
      if (!localStorageService.verifyPassword(password, foundUser.password)) {
        throw new Error('Invalid email or password');
      }

      // Set auth token and user
      const token = `local_${foundUser._id}_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorageService.saveUser(foundUser);
      setUser(foundUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user already exists
      const existingUser = localStorageService.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password (simple hash for demo - in production use proper hashing)
      const hashedPassword = localStorageService.hashPassword(userData.password);
      
      // Create new user in localStorage
      const newUser = localStorageService.createUser({
        ...userData,
        password: hashedPassword,
        email: userData.email.toLowerCase(),
        role: 'user',
        isEmailVerified: false,
        isActive: true,
        preferences: {
          language: 'en',
          theme: 'system',
          notifications: {
            email: true,
            push: true,
            privacyAlerts: true,
            assessmentReminders: true,
          },
        },
        privacyProfile: {
          riskLevel: 'medium',
          overallScore: 0,
        },
        subscription: {
          plan: 'free',
          status: 'active',
        },
      });

      // Set auth token and user
      const token = `local_${newUser._id}_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      setUser(newUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear auth token and user data from localStorage
      localStorage.removeItem('auth_token');
      // Note: We keep user data in localStorage for offline functionality
      // Only clear the auth token to log out
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user from localStorage
      const localUser = localStorageService.getUser();
      
      if (localUser) {
        setUser(localUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Authentication is OPTIONAL - never block access
    try {
      // Check if user is already logged in
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Load user from localStorage
        const localUser = localStorageService.getUser();
        if (localUser) {
          setUser(localUser);
        }
      } else {
        // For non-authenticated users, check if there's a local user
        const localUser = localStorageService.getUser();
        if (localUser) {
          setUser(localUser);
        }
      }
    } catch (error) {
      // Log error but don't block the app
      console.error('AuthProvider initialization error:', error);
    } finally {
      // Always set loading to false immediately - never block the app
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    loading,
    user,
    session: user ? { user } : null,
    error,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};