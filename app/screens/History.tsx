import { View, Text, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native'
import React,{useState, useEffect, useContext} from 'react'
import HistoryList from '../../components/HistoryList';
import { AuthContext } from '../contexts/AuthContext.js';
import axios from 'axios';

const History = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState();
  const { user } = useContext(AuthContext);
  const BACKEND_URL = 'http://10.5.1.88:3000';

  useEffect(()=>{

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
    if (user && user.id) {
      fetchProductList();
    }
  },[user]);
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
        borderBottomColor: '#ddd' 
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>History</Text>
      </View>

      {
        isLoading ? (
          <View>
            <Text>Fetching data...</Text> 
          </View>
        ) : (      
            <HistoryList productList={productList}/>
        )
      }


    </SafeAreaView>
  )
}

export default History