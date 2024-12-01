import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Define the type for props
interface HistoryListProps {
  productList?: { 
    scanId: number;
    productId: number;
    productName: string;
    productImage: string;
  }[];
}

const HistoryList: React.FC<HistoryListProps> = ({ productList }) => {
  // Render individual product item
  const renderProductItem = (item: NonNullable<HistoryListProps['productList']>[0]) => (
    <View key={item.scanId} style={styles.itemContainer}>
      <TouchableOpacity style={styles.touchableItem}>
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
        <MaterialIcons name="navigate-next" size={24} color="black" />
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
      <View style={styles.listContainer}>
        {productList.map(renderProductItem)}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 15,
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
    // This ensures the list is static and doesn't scroll
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