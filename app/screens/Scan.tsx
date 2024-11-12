import { View, Text,SafeAreaView, Platform, StatusBar, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import {useCameraPermissions} from "expo-camera"
import { useIsFocused } from '@react-navigation/native'
import { CameraView } from 'expo-camera'


const Scan = () => {

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [barcodeResult, setBarcodeResult]= useState<string|null>(null);
  const isFocused = useIsFocused();

  const handleBarcode = ({data}:{data:string})=>{
    console.log("Barcode scanned data:",data);
  }

  if (!isPermissionGranted) {
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

  // active works only for ios
  if (Platform.OS==='ios'){
    return (
        <View 
        style={{
          flex: 1,
        }}
      >
        <CameraView 
          active={isFocused} 
          style={styles.camera} 
          barcodeScannerSettings={{
          barcodeTypes: [
            'ean13', 'upc_a', 'code128'
            ],
          }}
          facing='back'
          onBarcodeScanned={handleBarcode}/>
    </View>
    )
  }

  // code for android
  return (
    <View 
    style={{
      flex: 1,
      paddingTop: StatusBar.currentHeight 
    }}
  >
  <StatusBar hidden/>
    {isFocused && <CameraView style={styles.camera} barcodeScannerSettings={{
    barcodeTypes: ['ean13', 'upc_a', 'code128'],
  }}
  facing='back' onBarcodeScanned={handleBarcode}/>}
    </View>
  )
  }


const styles = StyleSheet.create({
    camera: {
      flex: 1,
      width: '100%',
    }
  });

export default Scan

