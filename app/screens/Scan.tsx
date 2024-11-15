import { View, Text,SafeAreaView, Platform, StatusBar, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import {useCameraPermission, Camera, useCameraDevice, useCodeScanner} from "react-native-vision-camera"
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


const Scan = () => {

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const [scannedCode, setScannedCode] = useState<string|null>(null);
  const scannerEnabled = useRef(true); 
  const [foodData, setFoodData] = useState<Record<string, any> | null>(null);
  const BASE_URL = 'https://world.openfoodfacts.net/api/v2/product';

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'upc-a', 'itf'],
    onCodeScanned: (codes) => {
      if (!scannerEnabled.current) return;
      const firstCode = codes[0]?.value;
      if (firstCode) {
        console.log(firstCode);
        setScannedCode(firstCode);  // Store the first code value
        scannerEnabled.current = false; // Disable scanner after first scan
      }


    //   {
    //     "type": "ean-13",
    //     "corners": [
    //       {
    //         "x": 1288.2368025756452,
    //         "y": 460.1997247098826
    //       },
    //       {
    //         "x": 1321.3947997069927,
    //         "y": 460.19972389460514
    //       },
    //       {
    //         "x": 1321.394788044979,
    //         "y": 310.12710397959677
    //       },
    //       {
    //         "x": 1288.2367909136312,
    //         "y": 310.1271047948742
    //       }
    //     ],
    //     "value": "0706502220235",
    //     "frame": {
    //       "x": 1288.2368087768555,
    //       "height": 150.07261991500854,
    //       "width": 33.157997131347656,
    //       "y": 310.127112865448
    //     }
    //   }
    // ]
    }
  })
  // ${BASE_URL}/api/v2/product/${scannedCode}

  // Call to the API
  useEffect(()=>{
    if (scannedCode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/${scannedCode}`,{
            headers: {
              'User-Agent': 'FooddScan/1.0 (mrshetty24.com)' 
            }
          });
          console.log(response);
          if (response.status === 200) {
            console.log(response.data);
            setFoodData(response.data);
          } else {
            console.warn("Unexpected status code:", response.status);
          }
        }
        catch (error){
          if (axios.isAxiosError(error)) {
            console.error('Axios error fetching data:', error.message);
          } else {
            console.error('Error fetching data:', error);
          }
          }
      }
      fetchData();
    }
  },[scannedCode]);

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

