import React, { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [scannedCode, setScannedCode] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const { user } = useContext(AuthContext);

  const saveScannedItem =  (code, data) => {
    // If user is logged in, you can also save to backend/database here
    // if (user) {
    //   // Optional: API call to save scan history for the user
    //   try {
    //     await axios.post('/api/user/scan-history', {
    //       userId: user.id,
    //       barcode: code,
    //       foodData: data
    //     });
    //   } catch (error) {
    //     console.error('Failed to save scan history', error);
    //   }
    // }

    setScannedCode(code);
    setFoodData(data);
  };

  const clearScannedItem = () => {
    setScannedCode(null);
    setFoodData(null);
  };

  return (
    <ScanContext.Provider value={{ 
      scannedCode, 
      setScannedCode,
      foodData, 
      setFoodData,
      saveScannedItem, 
      clearScannedItem 
    }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScanContext = () => useContext(ScanContext);