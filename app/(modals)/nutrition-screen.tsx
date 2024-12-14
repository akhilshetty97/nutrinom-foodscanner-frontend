import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import React, { useMemo, useContext, useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScanContext } from '../contexts/ScanContext';
import NutriScoreBadge from './NutriScoreBadge';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from 'axios';

const BACKEND_URL = 'http://10.5.1.88:3000';

interface FoodData {
  product: {
    product_name: string;
    brands: string;
    quantity: string;
    serving_size: string;
    categories: string;
    image_front_small_url: string;
    nutriments?: {
      energy_kcal?: number;
      carbohydrates?: number;
      sugars?: number;
      fat?: number;
      saturated_fat?: number;
      proteins?: number;
      salt?: number;
      fiber?: number;
    };
    allergens?: string;
    ingredients_text?: string;
    nutriscore_grade?: string;
    ecoscore_grade?: string;
    nova_group?: number;
    countries?: string;
    packaging?: string;
  };
}

const NutritionScreen: React.FC = () => {
  const { foodData, clearScannedItem, isLoading} = useContext(ScanContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const [expertAnalysis, setExpertAnalysis] = useState<string>('');
  const [isExpertLoading, setIsExpertLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchExpertAnalysis = async () => {
      // Only fetch if we have nutritional information
      if (foodData?.product?.nutriments && Object.keys(foodData.product.nutriments).length > 0) {
        setIsExpertLoading(true);
        try {
          const nutritionPayload = {
            foodName: foodData.product.product_name,
            foodNutrition: {
              calories: foodData.product.nutriments.energy_kcal,
              carbohydrates: foodData.product.nutriments.carbohydrates,
              sugars: foodData.product.nutriments.sugars,
              fat: foodData.product.nutriments.fat,
              saturatedFat: foodData.product.nutriments.saturated_fat,
              proteins: foodData.product.nutriments.proteins,
              salt: foodData.product.nutriments.salt,
              fiber: foodData.product.nutriments.fiber
            }
          };

          const response = await axios.post(`${BACKEND_URL}/api/llm`, nutritionPayload);
          setExpertAnalysis(response.data.analysis);
        } catch (error) {
          console.error('Error fetching expert analysis:', error);
          setExpertAnalysis('');
        } finally {
          setIsExpertLoading(false);
        }
      }
    };

    fetchExpertAnalysis();
  }, [foodData]);

  // Check for error from previous screen
  const errorMessage = params.error as string | undefined;

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#d4a72c" />
        <Text style={[styles.loadingText, { marginTop: 12 }]}>
          Loading product information...
        </Text>
      </View>
    );
  }

  // If there's an error, render error view
  if (errorMessage || !foodData || !foodData.product) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons 
          name="barcode-off" 
          size={64} 
          color="#666"
        />
        <Text style={[styles.loadingText, styles.errorMessage]}>
          No product information available
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            clearScannedItem();
            router.back();
          }}
        >
          <Text style={styles.retryButtonText}>Try Another Scan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { product } = foodData;
  const hasNutrition = product.nutriments && Object.keys(product.nutriments).length > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Section with Product Details */}
      <View style={styles.topSection}>
        <Image source={
              product.image_front_small_url 
                ? { uri: product.image_front_small_url }
                : require('../../assets/images/default_food.png')  
            } style={styles.image} resizeMode="contain"/>
        <View style={styles.productDetailsContainer}>
          <Text style={styles.title}>{product.product_name}</Text>
          {product.brands && (
            <View style={styles.detailHighlight}>
              <Text style={styles.detailHighlightLabel}>Brand</Text>
              <Text style={styles.detailHighlightText}>{product.brands}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Nutritional Information Section */}
      {product.nutriscore_grade !== "not-applicable" && (
        <View style={styles.sectionContainer}>
          <View style={styles.headerIcons}>
            <MaterialCommunityIcons name="nutrition" size={24} color="black" />
            <Text style={styles.sectionTitle}>Nutritional Information</Text>
          </View>
          {product.nutriments?.energy_kcal !== undefined && 
            <Text><Text style={styles.labelText}>Calories:</Text> {product.nutriments.energy_kcal.toFixed(2)} kcal</Text>
          }
          {product.nutriments?.carbohydrates !== undefined && 
            <Text><Text style={styles.labelText}>Carbohydrates:</Text> {product.nutriments.carbohydrates.toFixed(2)} g</Text>
          }
          {product.nutriments?.sugars !== undefined && 
            <Text><Text style={styles.labelText}>Sugars:</Text> {product.nutriments.sugars.toFixed(2)} g</Text>
          }
          {product.nutriments?.fat !== undefined && 
            <Text><Text style={styles.labelText}>Fat:</Text> {product.nutriments.fat.toFixed(2)} g</Text>
          }
          {product.nutriments?.saturated_fat !== undefined && 
            <Text><Text style={styles.labelText}>Saturated Fat:</Text> {product.nutriments.saturated_fat.toFixed(2)} g</Text>
          }
          {product.nutriments?.proteins !== undefined && 
            <Text><Text style={styles.labelText}>Proteins:</Text> {product.nutriments.proteins.toFixed(2)} g</Text>
          }
          {product.nutriments?.salt !== undefined && 
            <Text><Text style={styles.labelText}>Salt:</Text> {product.nutriments.salt.toFixed(2)} g</Text>
          }
          {product.nutriments?.fiber !== undefined && 
            <Text><Text style={styles.labelText}>Fiber:</Text> {product.nutriments.fiber.toFixed(2)} g</Text>
          }
        </View>
      )}

      {/* Expert Analysis Section - Only show if we have nutrition data */}
      {hasNutrition && (
        <View style={styles.expertContainer}>
          <View style={styles.expertHeaderRow}>
            <MaterialCommunityIcons style={styles.expertIcon} name="brain" size={24} color="#706a3e" />
            <Text style={styles.sectionTitle}>Expert Analysis</Text>
          </View>
          {isExpertLoading ? (
            <ActivityIndicator size="small" color="#d4a72c" />
          ) : expertAnalysis ? (
            <Text style={styles.expertText}>{expertAnalysis}</Text>
          ) : (
            <Text style={styles.expertText}>Analysis not available at the moment.</Text>
          )}
        </View>
      )}

      {/* Allergens Section */}
      {product.allergens && (
        <View style={styles.sectionContainer}>
          <View style={styles.headerIcons}>
            <MaterialIcons style={{marginLeft:-2}} name="no-meals" size={24} color="black" />
            <Text style={styles.sectionTitle}>Allergens</Text>
          </View>
          <Text>{product.allergens}</Text>
        </View>
      )}

      {/* Ingredients Section */}
      {product.ingredients_text && (
        <View style={styles.sectionContainer}>
          <View style={styles.headerIcons}>
            <FontAwesome5 style={{marginTop:3, marginHorizontal:2}} name="pepper-hot" size={20} color="black" />
            <Text style={styles.sectionTitle}>Ingredients</Text>
          </View>
          <Text>{product.ingredients_text}</Text>
        </View>
      )}

      {/* Additional Information Section */}
      <View style={styles.sectionContainer}>
      <View style={styles.headerIcons}>
        <MaterialIcons name="notes" size={24} color="black" />
        <Text style={styles.sectionTitle}>Additional Information</Text>
      </View>
        {['a', 'b', 'c', 'd', 'e'].includes(product.nutriscore_grade?.toLowerCase() || '') && (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Nutri-Score:</Text>
            <NutriScoreBadge grade={product.nutriscore_grade} />
            <TouchableOpacity onPress={()=> Linking.openURL('https://en.wikipedia.org/wiki/Nutri-Score')}>
              <Ionicons style={styles.moreInfo} name="information-circle-outline" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        )}
        {product.ecoscore_grade!='unknown' && 
          <Text><Text style={styles.labelText}>Eco-Score:</Text> {product.ecoscore_grade}</Text>
        }
        {product.nova_group !== undefined && 
          <Text><Text style={styles.labelText}>NOVA Group:</Text> {product.nova_group}</Text>
        }
        {product.countries && 
          <Text><Text style={styles.labelText}>Countries:</Text> {product.countries}</Text>
        }
        {product.packaging && 
          <Text><Text style={styles.labelText}>Packaging:</Text> {product.packaging}</Text>
        }
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 160,
    height: 250,
    marginRight: 16,
    borderRadius: 8,
  },
  productDetailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  sectionContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 4,
  },
  retryButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
  detailHighlight: {
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 6,
  },
  detailHighlightLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailHighlightText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 15,
    marginRight: 8,
    fontWeight:'bold'
  },
  moreInfo: {
    marginLeft:8,
    marginTop: 2
  },
  expertContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fefae0',  
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d4a72c',  
  },
  expertHeaderRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  expertIcon:{
    marginBottom:8
  }, 
  expertText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600'
  },
  headerIcons: {
    display:'flex',
    flexDirection:'row',
    gap:5
  }
});
export default NutritionScreen;