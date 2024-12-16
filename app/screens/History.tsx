import { View, Text, SafeAreaView, ScrollView, Platform, StatusBar, ActivityIndicator } from 'react-native'
import React,{useState, useEffect, useContext, useCallback} from 'react'
import HistoryList from '../../components/HistoryList';
import { AuthContext } from '../contexts/AuthContext.js';
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios';
import * as Sentry from '@sentry/react-native';

const History = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState();
  const { user } = useContext(AuthContext);
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  // Function to fetch product list
  const fetchProductList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/product/history/${user.id}`);

      if (response.data.scannedProducts) {
        setProductList(response.data.scannedProducts);
      }
    } catch(error) {
      Sentry.captureException(error, {
        tags: {
          location: 'history_fetch',
          errorType: error instanceof Error ? error.name : 'unknown'
        },
        extra: {
          userId: user?.id,
          hasUser: !!user
        }
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Use focus effect to refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user && user.id) {
        fetchProductList();
      }
    }, [user])
  );

  // Original useEffect remains as a fallback
  useEffect(() => {
    if (user && user.id) {
      fetchProductList();
    }
  }, [user]);

  return (
    <SafeAreaView 
      style={{
        flex: 1, 
        backgroundColor: '#f4f4f4',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }}
    >
      {/* Header Section */}
      <View style={{ 
        width: '100%', 
        padding: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ddd',
        backgroundColor: '#f4f4f4' 
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>History</Text>
      </View>

      {/* Content Section with gray background */}
      <View style={{ 
        flex: 1,
      }}>
        {isLoading ? (
        <View style={{ 
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20
        }}>
          <ActivityIndicator size="large" color="#d4a72c" />
          <Text style={{ 
            marginTop: 12,
            fontSize: 16,
            color: '#666',
            fontWeight: '500'
          }}>
            Loading history...
          </Text>
        </View>
      )  : (      
          <HistoryList productList={productList}/>
        )}
      </View>
    </SafeAreaView>
  )
}

export default History