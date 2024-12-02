import React, { useState,useContext, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ScanContext } from '../app/contexts/ScanContext.js';

// Define the type for props
interface HistoryListProps {
  productList?: { 
    scanId: number;
    productId: number;
    productName: string;
    productImage: string;
  }[];
}

const BACKEND_URL = 'http://10.5.1.152:3000';

const HistoryList: React.FC<HistoryListProps> = ({ productList }) => {
  const { foodData, setFoodData } = useContext(ScanContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
  const router = useRouter(); 

  // Function to handle product details fetch
  const handleProductPress = async (productId: number) => {
    try {
      // Show loading indicator for the specific product
      setIsLoading(true);
      setLoadingProductId(productId);
      
      // Fetch data for that particular product id
      const response = await axios.get(`${BACKEND_URL}/product/${productId}`);
      const productInfo = response.data.productInfo;
      setFoodData(productInfo);    
      // Navigate to nutrition screen
      router.push('/(modals)/nutrition-screen');

    } catch (error) {
      console.error('Error fetching product details:', error);
      // Optional: Add error handling, like showing an alert
    } finally {
      setIsLoading(false);
      setLoadingProductId(null);
    }
  };

  // Render individual product item
  const renderProductItem = ({ item }: { item: NonNullable<HistoryListProps['productList']>[0] }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity 
        style={styles.touchableItem}
        onPress={() => handleProductPress(item.productId)}
        disabled={isLoading && loadingProductId === item.productId}
      >
        <Image 
          source={{ uri: item.productImage }}
          style={styles.productImage}
          resizeMode="cover"
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
        {isLoading && loadingProductId === item.productId ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <MaterialIcons name="navigate-next" size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );

  // If no products, show a message
  if (!productList || productList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No scan history found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    marginTop:10
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
  },
  countText: {
    fontSize: 14,
    color: '#888',
  },
  listContainer: {
    width: '100%',
  },
  itemContainer: {
    marginBottom: 10,
  },
  touchableItem: {
    padding: 15, 
    borderRadius: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80, 
    height: 80, 
    borderRadius: 8, 
    marginRight: 15,
  },
  textContainer: {
    flex: 1, 
    marginRight: 15,
  },
  productText: {
    fontSize: 15, 
    fontWeight: '500',
  },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  }
});

export default HistoryList