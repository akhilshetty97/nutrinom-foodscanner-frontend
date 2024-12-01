import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        console.error('Critical Error loading user:', error);
        
        // More comprehensive error logging
        if (error instanceof Error) {
          console.error('Error Name:', error.name);
          console.error('Error Message:', error.message);
          console.error('Error Stack:', error.stack);
        }

        // Attempt to clear and reinitialize storage
        try {
          await AsyncStorage.clear();
        } catch (clearError) {
          console.error('Failed to clear AsyncStorage:', clearError);
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
  
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Login error in context:', error);
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
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error in context:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, setIsAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
