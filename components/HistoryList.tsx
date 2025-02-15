import React, { useState,useContext, useEffect, useCallback } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ScanContext } from '../app/contexts/ScanContext.js';
import * as Sentry from '@sentry/react-native';
import { AuthContext } from '../app/contexts/AuthContext';

// Define the type for props
interface HistoryListProps {
  productList?: { 
    scanId: number;
    productId: number;
    productName: string;
    productImage: string;
  }[];
}

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const HistoryList: React.FC<HistoryListProps> = ({ productList }) => {
  const { foodData, setFoodData, saveScannedItem, setExpertData, isLoading } = useContext(ScanContext);
  const [historyLoading, setIsHistoryLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
  const { user } = useContext(AuthContext);
  const router = useRouter(); 

  // Function to handle product details fetch
  const handleProductPress = useCallback(async (productId: number) => {
    try {
      setIsHistoryLoading(true);
      setLoadingProductId(productId);
  
      // Fetch data for that particular product id
      const response = await axios.get(`${BACKEND_URL}/product/${productId}`);
      const productInfo = response.data.productInfo;
  
      if (!productInfo) {
        throw new Error('Product information not found');
      }
  
      // Set food data first
      setFoodData({
        product: productInfo 
      });
  
      try {
        // Try to fetch expert info
        const expertResponse = await axios.get(`${BACKEND_URL}/product/llm/${productId}`);
        setExpertData(expertResponse.data?.expertInfo || null);
      } catch (expertError) {
        // Set expert data to null if fetch fails
        setExpertData(null);
      }
  
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('../(modals)/nutrition-screen');
  
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          location: 'product_details_fetch',
          errorType: error instanceof Error ? error.name : 'unknown',
          productId: productId.toString()
        },
        extra: {
          userId: user?.id,
          loadingProductId
        }
      });
    } finally {
      setIsHistoryLoading(false);
      setLoadingProductId(null);
    }
  },[historyLoading,foodData,user?.id]);


  // Render individual product item
  const renderProductItem = useCallback(({ item }: { item: NonNullable<HistoryListProps['productList']>[0] }) => (
    <View style={[
      styles.itemContainer, 
      historyLoading && { opacity: 0.8 }  // Add opacity when loading
    ]}>
      <TouchableOpacity 
        style={styles.touchableItem}
        onPress={() => handleProductPress(item.productId)}
        disabled = {historyLoading}
      >
        <Image 
          source={
            item.productImage 
              ? { uri: item.productImage }
              : require('../assets/images/default_food.png') 
          }
          defaultSource={require('../assets/images/default_food.png')}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text 
            numberOfLines={2} 
            ellipsizeMode="tail" 
            style={styles.productText}
          >
            {item.productName}
          </Text>
        </View>
        <MaterialIcons name="navigate-next" size={24} color="black" />
      </TouchableOpacity>
    </View>
  ),[historyLoading, handleProductPress]);

  // If no products, show a message
  if (!productList || productList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="qr-code-scanner" size={48} color="#888" />
        <Text style={styles.emptyTitle}>No Scan History Yet</Text>
        <Text style={styles.emptyDescription}>
          Start scanning products to track and manage your items
        </Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container, 
      historyLoading && { opacity: 0.8 }  // Add opacity to main container when loading
    ]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Scan History</Text>
        <Text style={styles.countText}>({productList.length} items)</Text>
      </View>
      <FlatList
        data={productList}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.scanId.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 15,
    marginTop:10,
    
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 9
  },
  countText: {
    fontSize: 14,
    color: '#888',
  },
  listContainer: {
    width: '100%',
  },
  itemContainer: {
    marginVertical: 10,  
    paddingHorizontal: 10,
  },
  touchableItem: {
    padding: 15, 
    borderRadius: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#e7e3db',
    flexDirection: 'row',
    alignItems: 'center',
    height: 100, 
  },
  productImage: {
    width: 90, 
    height: 90, 
    borderRadius: 8, 
    marginRight: 15,
    marginLeft: -2
  },
  textContainer: {
    flex: 1, 
    marginRight: 15,
  },
  productText: {
    fontSize: 15, 
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 150,
    height: 300, 
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
});

export default HistoryList