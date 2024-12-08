import { View, Text, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native'
import React,{useState, useEffect, useContext, useCallback} from 'react'
import HistoryList from '../../components/HistoryList';
import { AuthContext } from '../contexts/AuthContext.js';
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios';

const History = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState();
  const { user } = useContext(AuthContext);
  const BACKEND_URL = 'http://10.5.1.152:3000';

  // Function to fetch product list
  const fetchProductList = async () => {
    try {
      setIsLoading(true);
      console.log('User', user);
      const response = await axios.get(`${BACKEND_URL}/product/history/${user.id}`);

      if (response.data.scannedProducts) {
        setProductList(response.data.scannedProducts);
      }
    } catch(error) {
      console.error('Error fetching product history:', error);
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
        backgroundColor: '#f4f4f4' // Match with SafeAreaView background
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>History</Text>
      </View>

      {/* Content Section with gray background */}
      <View style={{ 
        flex: 1,
      }}>
        {isLoading ? (
          <View style={{ padding: 20 }}>
            <Text>Fetching data...</Text> 
          </View>
        ) : (      
          <HistoryList productList={productList}/>
        )}
      </View>
    </SafeAreaView>
  )
}

export default History