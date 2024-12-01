import { View, Text,SafeAreaView, Platform, StatusBar, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import {useCameraPermission, Camera, useCameraDevice, useCodeScanner} from "react-native-vision-camera"
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { ScanContext } from '../contexts/ScanContext.js';

// import { BACKEND_URL } from '@env';
// import NutritionScreen from '../(modals)/nutrition-screen';


const Scan = () => {

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const router = useRouter(); 
  // const [scannedCode, setScannedCode] = useState<string|null>(null);
  const scannerEnabled = useRef(true); 
  // const [foodData, setFoodData] = useState<Record<string, any> | null>(null);
  const { scannedCode, setScannedCode,foodData,setFoodData, saveScannedItem, clearScannedItem } = useContext(ScanContext);
  const BACKEND_URL = 'http://10.5.1.88:3000';

  // Method Reset the scanner
  const resetScanner = () => {
    scannerEnabled.current = true;
    setScannedCode(null);
  };

  // Listen for focus changes to reset scanner(eg when modal is pushed down)
  useEffect(() => {
    if (isFocused) {
      resetScanner();
    }
  }, [isFocused]);

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'upc-a', 'itf'],
    onCodeScanned: (codes) => {
      if (!scannerEnabled.current) return;
      const firstCode = codes[0]?.value;
      if (firstCode) {
        setScannedCode(firstCode);  // Store the first code value
        scannerEnabled.current = false; // Disable scanner after first scan
      }
    }
  })
  
  useEffect(() => {
    if (scannedCode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/call?scannedCode=${scannedCode}`);
          
          if (response.status === 200) {
            saveScannedItem(scannedCode, response.data);
  
            // Navigate to NutritionScreen with the scanned food data
            router.push({
              pathname: '../(modals)/nutrition-screen',
              params: { 
                foodData: JSON.stringify(response.data) 
              }
            });
          } else {
            console.warn("Unexpected status code:", response.status);
            // Optionally add error handling for non-200 status
            throw new Error(`Unexpected status code: ${response.status}`);
          }
        } catch (error) {
          // More comprehensive error handling
          if (axios.isAxiosError(error)) {
            // Check for specific error scenarios
            if (error.response?.status === 404) {
              // Product not found in database
              router.push({
                pathname: '../(modals)/nutrition-screen',
                params: { 
                  error: 'Product not found',
                  scannedCode: scannedCode 
                }
              });
            } else if (error.response?.status === 500) {
              // Server error
              router.push({
                pathname: '../(modals)/nutrition-screen',
                params: { 
                  error: 'Server error. Please try again later.',
                  scannedCode: scannedCode 
                }
              });
            } else {
              // Generic network or request error
              router.push({
                pathname: '../(modals)/nutrition-screen',
                params: { 
                  error: 'Unable to fetch product information',
                  scannedCode: scannedCode 
                }
              });
            }
          } else {
            // Non-Axios error
          router.push({
            pathname: '../(modals)/nutrition-screen',
            params: { 
              error: 'An unexpected error occurred',
              scannedCode: scannedCode 
            }
          });
          }
        }
      };
      fetchData()
    }
  }, [scannedCode]);

  if (!device){
    return <View className='flex-1 bg-white flex items-center justify-center'><Text>Camera is unavailable</Text></View>
  }

  if (!hasPermission) {
    return (
      <SafeAreaView 
      style={{
        flex: 1,
        backgroundColor:'white',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }}
    >
        <View className='flex items-center justify-center'>
          <Text>Camera Permission Required</Text>
          <Text>We need camera access to scan barcodes</Text>
          <TouchableOpacity className='p-5 mt-3 bg-gray-300 rounded-full'
            onPress={requestPermission}
          >
            <Text>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View 
    style={{
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }}
  >
    {Platform.OS === 'android' ? <StatusBar hidden/>:null}
    <Camera 
    style={styles.camera} 
    device={device} 
    isActive={isFocused}
    codeScanner={codeScanner}
    />
    {scannedCode && (
        <View style={styles.scannedCodeContainer}>
          <Text>Scanned Code: {scannedCode}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
    camera: {
      flex: 1,
      width: '100%',
    },
    scannedCodeContainer: {
      position: 'absolute',
      bottom: 20,
      left: 10,
    },
  });

export default Scan
