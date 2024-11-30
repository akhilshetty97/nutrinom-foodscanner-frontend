import { View, Text,SafeAreaView, Platform, StatusBar, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import {useCameraPermission, Camera, useCameraDevice, useCodeScanner} from "react-native-vision-camera"
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
// import { BACKEND_URL } from '@env';
// import NutritionScreen from '../(modals)/nutrition-screen';


const Scan = () => {

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const router = useRouter(); 
  const [scannedCode, setScannedCode] = useState<string|null>(null);
  const scannerEnabled = useRef(true); 
  const [foodData, setFoodData] = useState<Record<string, any> | null>(null);
  const BACKEND_URL = 'http://10.5.1.152:3000';


  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'upc-a', 'itf'],
    onCodeScanned: (codes) => {
      if (!scannerEnabled.current) return;
      const firstCode = codes[0]?.value;
      if (firstCode) {
        // console.log(firstCode);
        setScannedCode(firstCode);  // Store the first code value
        scannerEnabled.current = false; // Disable scanner after first scan
      }
    }
  })
  
  useEffect(() => {
    if (scannedCode) {
      const fetchData = async () => {
        try {
          console.log(`BACKENDURL: ${BACKEND_URL}/api/call?scannedCode=${scannedCode}`);
          const response = await axios.get(`${BACKEND_URL}/api/call?scannedCode=${scannedCode}`);
          
          if (response.status === 200) {
            setFoodData(response.data);
  
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
            console.error('Axios error details:', {
              message: error.message,
              code: error.code,
              response: error.response?.data,
              status: error.response?.status
            });
          } else {
            console.error('Unexpected error:', error);
          }
          
          // Rethrow to ensure unhandled promise rejection is caught
          throw error;
        }
      };
  
      // Wrap the async function call to catch any unhandled rejections
      fetchData().catch(error => {
        console.error('Unhandled promise rejection:', error);
      });
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
