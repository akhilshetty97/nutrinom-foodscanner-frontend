import { View, Text,SafeAreaView, Platform, StatusBar, Pressable, StyleSheet, TouchableOpacity,Linking, Alert, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import {useCameraPermission, Camera, useCameraDevice, useCodeScanner} from "react-native-vision-camera"
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { ScanContext } from '../contexts/ScanContext.js';

// import { BACKEND_URL } from '@env';
// import NutritionScreen from '../(modals)/nutrition-screen';

// Screen dimensions for scan
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCAN_AREA_WIDTH = SCREEN_WIDTH * 0.8;
const SCAN_AREA_HEIGHT = SCREEN_HEIGHT * 0.15;


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
    regionOfInterest:{
      x: 0.15,  // 15% from left
      y: 0.3,   // 30% from top
      width: 0.7, // 70% width
      height: 0.4, // 40% height
    },
    onCodeScanned: (codes) => {
      if (!scannerEnabled.current) return;
      const firstCode = codes[0]?.value;
      if (firstCode) {
        setScannedCode(firstCode);  // Store the first code value
        scannerEnabled.current = false; // Disable scanner after first scan
      }
    }
  })

    // Permission handling for camera
    const handleRequestPermission = async () => {
      try {
        const newPermission = await Camera.requestCameraPermission();
        
        // Directly open settings in this case
        if (newPermission === 'denied') {
          Linking.openSettings();
        }
      } catch (error) {
        console.error('Permission request error:', error);
        Alert.alert(
          'Permission Error', 
          'Could not request camera permission. Please allow permission manually in device settings.',
          [{ text: 'OK' }]
        );
      }
    };
  
  useEffect(() => {
    if (scannedCode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/call?scannedCode=${scannedCode}`);
          
          if (response.status === 200) {
            saveScannedItem(scannedCode, response.data);
  
            // Navigate to NutritionScreen with the scanned food data
            router.push('../(modals)/nutrition-screen');
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
              router.push('../(modals)/nutrition-screen');
            } else if (error.response?.status === 500) {
              // Server error
              router.push('../(modals)/nutrition-screen');
            } else {
              // Generic network or request error
              router.push('../(modals)/nutrition-screen');
            }
          } else {
            // Non-Axios error
          router.push( '../(modals)/nutrition-screen');
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
          backgroundColor: '#e7e3db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}
      >
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionSubtitle}>
            We need camera access to scan barcodes and provide you with product information
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={handleRequestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
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
      {Platform.OS === 'android' ? <StatusBar hidden/> : null}
      <Camera 
        style={styles.camera} 
        device={device} 
        isActive={isFocused}
        codeScanner={codeScanner}
      />
      
      {/* Overlay with scan area */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.overlayTop} />
        <View style={styles.centerRow}>
          <View style={styles.overlaySide} />
          <View style={styles.scanArea} />
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          <Text style={styles.scanText}>Align barcode within frame</Text>
        </View>
      </View>
  
      {scannedCode && (
        <View style={styles.scannedCodeContainer}>
        </View>
      )}
    </View>
  );
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
    permissionContainer: {
      width: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    permissionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 15,
      textAlign: 'center',
    },
    permissionSubtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 24,
    },
    permissionButton: {
      backgroundColor: '#202020',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    permissionButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    overlayTop: {
      height: '30%',  // Matches regionOfInterest y value
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    centerRow: {
      flexDirection: 'row',
      height: '40%',  // Matches regionOfInterest height
    },
    overlaySide: {
      width: '15%',  // Matches regionOfInterest x value
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    overlayBottom: {
      height: '30%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      paddingTop: 20,
    },
    scanArea: {
      width: '70%',  // Matches regionOfInterest width
      height: '100%',
      borderColor: '#fff',
      borderWidth: 2,
    },
    scanText: {
      color: '#fff',
      fontSize: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 8,
      borderRadius: 4,
      overflow: 'hidden',
    }
  });

export default Scan
