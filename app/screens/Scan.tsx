import { View, Text,SafeAreaView, Platform, StatusBar, Pressable, StyleSheet, TouchableOpacity,Linking, Alert, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import {useCameraPermission, Camera, useCameraDevice, useCodeScanner} from "react-native-vision-camera"
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { ScanContext } from '../contexts/ScanContext.js';
import ScanOverlay from '../../components/ScanOverlay';
import * as Sentry from '@sentry/react-native';

const Scan = () => {

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const router = useRouter(); 
  const scannerEnabled = useRef(true); 
  const { scannedCode, setScannedCode, saveScannedItem, clearScannedItem } = useContext(ScanContext);
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  // Method Reset the scanner
  const resetScanner = () => {
    clearScannedItem();
    scannerEnabled.current = true;
  };

  // Listen for focus changes to reset scanner(eg when modal is pushed down)
  useEffect(() => {
    if (isFocused) {
      resetScanner();
    }
  }, [isFocused]);

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'upc-a', 'itf', 'ean-8','upc-e'],
    regionOfInterest:{
      x: 0.1,     // 10% from left (making it wider)
      y: 0.35,    // 35% from top
      width: 0.8,  // 80% width (wider scan area)
      height: 0.3, // 30% height (shorter scan area)
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
          Sentry.addBreadcrumb({
            category: 'camera',
            message: 'Camera permission denied by user',
            level: 'warning'
          });
          Alert.alert(
            'Camera Access Required',
            'This feature requires camera access. Would you like to enable it in Settings?',
            [
              {
                text: 'Not Now',
                style: "cancel"
              },
              {
                text: 'Open Settings',
                onPress: () => Linking.openSettings()
              }
            ]
          );
        }
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            location: 'camera_permission',
            errorType: error instanceof Error ? error.name : 'unknown'
          }
        });
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
            Sentry.captureMessage(`Unexpected API status: ${response.status}`, {
              level: 'error',
              tags: { feature: 'barcode_scan' },
              extra: { 
                statusCode: response.status,
                scannedCode 
              }
            });
            // Optionally add error handling for non-200 status
            throw new Error(`Unexpected status code: ${response.status}`);
          }
        } catch (error) {
            if (axios.isAxiosError(error)) {
              Sentry.captureException(error, {
                tags: {
                  location: 'barcode_scan',
                  errorType: 'network',
                  statusCode: error.response?.status?.toString()
                },
                extra: {
                  scannedCode,
                  responseData: error.response?.data
                }
              });
              router.push('../(modals)/nutrition-screen');
            } else {
              Sentry.captureException(error, {
                tags: {
                  location: 'barcode_scan',
                  errorType: 'unknown'
                },
                extra: { scannedCode }
              });
              router.push('../(modals)/nutrition-screen');
            }
          }
      };
      fetchData()
    }
  }, [scannedCode]);

  if (!device){
    Sentry.captureMessage('Camera device unavailable', {
      level: 'warning',
      tags: { feature: 'camera_device' }
    });
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
          <Text style={styles.permissionTitle}>Camera Access</Text>
          <Text style={styles.permissionSubtitle}>
            To scan barcodes and show product information, this app needs to access your camera.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={handleRequestPermission}
          >
            <Text style={styles.permissionButtonText}>Continue</Text>
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
      <ScanOverlay/>
  
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
    }
  });

export default Scan
