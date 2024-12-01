import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Define the type for props
interface HistoryListProps {
  productList: { 
    scanId: number;
    productId: number;
    productName: string;
    productImage: string;
  }[];
}


// [{"productId": 7, "productImage": "https://images.openfoodfacts.net/images/products/001/330/028/0645/front_en.3.100.jpg", 
//   "productName": "HUNGRY JACK - Complete Buttermilk Pancake Mix and Waffle Mix", "scanId": 7}, {"productId": 5, 
//   "productImage": "https://images.openfoodfacts.net/images/products/007/874/225/4623/front_en.9.100.jpg",
//   "productName": "Great Value Oregano Leaves, 0.87 oz", "scanId": 6}]

const HistoryList = () => {
  return (
    <View style={{
      width: '100%', 
      paddingHorizontal: 10, 
      marginBottom: 15, 
    }}>
      <TouchableOpacity style={{
        padding: 15, 
        borderRadius: 8, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // for Android shadow
        backgroundColor: '#F5F5F5',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}>
        <Image 
          source={{ uri: "https://images.openfoodfacts.net/images/products/001/330/028/0645/front_en.3.100.jpg" }}
          style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 8, 
            marginRight: 15
          }}
          resizeMode="cover"
        />
        <View style={{ 
          flex: 1, 
          marginRight: 15 
        }}>
          <Text 
            numberOfLines={2} 
            ellipsizeMode="tail" 
            style={{ 
              fontSize: 15, 
              fontWeight: '500' 
            }}
          >
            HUNGRY JACK - Complete Buttermilk Pancake Mix and Waffle Mix
          </Text>
        </View>
        <MaterialIcons name="navigate-next" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

export default HistoryList