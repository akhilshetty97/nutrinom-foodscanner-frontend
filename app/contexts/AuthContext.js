import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            location: 'auth_load',
            errorType: error instanceof Error ? error.name : 'unknown'
          },
          extra: {
            hasStoredData: !!(await AsyncStorage.getItem('user'))
          }
        });
        
        // Attempt to clear and reinitialize storage
        try {
          await AsyncStorage.clear();
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'Successfully cleared AsyncStorage after error',
            level: 'warning'
          });
        } catch (clearError) {
          Sentry.captureException(clearError, {
            tags: {
              location: 'auth_storage_clear',
              errorType: clearError instanceof Error ? clearError.name : 'unknown'
            }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData, token) => {
    try {
      setUser(userData);
      setToken(token);
      setIsAuthenticated(true);
  
      // Ensure these are awaited
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', token);

      // Set user in Sentry for better error tracking
      Sentry.setUser({
        id: userData.id,
        email: userData.email
      });
  
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          location: 'auth_login',
          errorType: error instanceof Error ? error.name : 'unknown'
        },
        extra: {
          hasUserData: !!userData,
          hasToken: !!token
        }
      });
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      // Remove user and token from state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      // Remove items from AsyncStorage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');

      // Clear user from Sentry
      Sentry.setUser(null);
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          location: 'auth_logout',
          errorType: error instanceof Error ? error.name : 'unknown'
        }
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, setIsAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
