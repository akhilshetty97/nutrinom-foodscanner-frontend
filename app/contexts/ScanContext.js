import React, { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

export const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [scannedCode, setScannedCode] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [expertData, setExpertData] =useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const BACKEND_URL = 'http://10.5.1.88:3000';

  const saveScannedItem = async (code, data) => {
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

    try {
        let expertInfo = null;
        
        // Make LLM call intially when we dont have nutrition data
        if (data.product?.nutriments && 
            Object.keys(data.product.nutriments).length > 0) {
            try {
                const nutritionPayload = {
                    foodName: data.product.product_name,
                    foodNutrition: {
                        calories: data.product.nutriments.energy_kcal,
                        carbohydrates: data.product.nutriments.carbohydrates,
                        sugars: data.product.nutriments.sugars,
                        fat: data.product.nutriments.fat,
                        saturatedFat: data.product.nutriments.saturated_fat,
                        proteins: data.product.nutriments.proteins,
                        salt: data.product.nutriments.salt,
                        fiber: data.product.nutriments.fiber
                    }
                };

                const analysisResponse = await axios.post(
                    `${BACKEND_URL}/api/llm`, 
                    nutritionPayload
                );
                expertInfo = analysisResponse.data.analysis;
            } catch (llmError) {
                console.error('Error fetching LLM analysis:', llmError);
            }
        }

        // Set states first
        setExpertData(expertInfo);
        setScannedCode(code);
        setFoodData(data);

        // Save to backend if not skipped
        await axios.post(`${BACKEND_URL}/product/add`, {
            userId: user.id,
            barcode: code,
            foodData: data,
            expertAnalysis:expertInfo
        });
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to save scan history';
        setError({
            message: 'Scan Save Error',
            details: errorMessage,
            fullError: error
        });
        console.error('Scan save error:', error);
    } finally {
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
      expertData,
      setExpertData,
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