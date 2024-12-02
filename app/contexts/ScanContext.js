import React, { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

export const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [scannedCode, setScannedCode] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const BACKEND_URL = 'http://10.5.1.152:3000';

  const saveScannedItem =  async (code, data, skipApiCall = false) => {
        // Reset previous error and set loading
        setError(null);
        setIsLoading(true);

        // Validate inputs
        if (!user) {
            setError({
            message: 'Authentication Required',
            details: 'Please log in to save scanned items'
            });
            setIsLoading(false);
            return null;
        }
    
        if (!code || !data) {
            setError({
            message: 'Invalid Scan',
            details: 'Barcode or product data is missing'
            });
            setIsLoading(false);
            return null;
        }

        // If user is logged in, you can also save to backend/database here
        // Optional: API call to save scan history for the user
        try {
            // Only make API call if not skipped
            if (!skipApiCall) {
              await axios.post(`${BACKEND_URL}/product/add`, {
                userId: user.id,
                barcode: code,
                foodData: data
              });
            }

            setScannedCode(code);
            setFoodData(data);
            
            } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to save scan history';
            setError({
                message: 'Scan Save Error',
                details: errorMessage,
                fullError: error
            });

            // Log the full error for debugging
            console.error('Scan save error:', error);
            } finally {
                // Ensure loading state is reset
                setIsLoading(false);
            }
  };

  const clearScannedItem = () => {
    setScannedCode(null);
    setFoodData(null);
    setError(null);
  };

  return (
    <ScanContext.Provider value={{ 
      scannedCode, 
      setScannedCode,
      foodData, 
      setFoodData,
      isLoading,
      setIsLoading,
      error,
      setError,
      saveScannedItem,
      clearScannedItem
    }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScanContext = () => useContext(ScanContext);