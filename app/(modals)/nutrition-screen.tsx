import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useMemo, useContext } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScanContext } from '../contexts/ScanContext';
import NutriScoreBadge from './NutriScoreBadge';

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

  // Check for error from previous screen
  const errorMessage = params.error as string | undefined;

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading product information...</Text>
      </View>
    );
  }

  // If there's an error, render error view
  if (errorMessage || !foodData || !foodData.product) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>No product information available</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            clearScannedItem();
            router.back();
          }}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { product } = foodData;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Section with Product Details */}
      <View style={styles.topSection}>
        {product.image_front_small_url && <Image source={{ uri: product.image_front_small_url }} style={styles.image} resizeMode="contain"/>}
        <View style={styles.productDetailsContainer}>
          <Text style={styles.title}>{product.product_name}</Text>
          {product.brands && (
            <View style={styles.detailHighlight}>
              <Text style={styles.detailHighlightLabel}>Brand</Text>
              <Text style={styles.detailHighlightText}>{product.brands}</Text>
            </View>
          )}
          {product.quantity && (
            <View style={styles.detailHighlight}>
              <Text style={styles.detailHighlightLabel}>Quantity</Text>
              <Text style={styles.detailHighlightText}>{product.quantity}</Text>
            </View>
          )}
          {product.serving_size && <Text style={styles.detailText}>Serving Size: {product.serving_size}</Text>}
        </View>
      </View>

      {/* Nutritional Information Section */}
      {product.nutriscore_grade !== "not-applicable" && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Nutritional Information</Text>
          {product.nutriments?.energy_kcal !== undefined && <Text>Calories: {product.nutriments.energy_kcal} kcal</Text>}
          {product.nutriments?.carbohydrates !== undefined && <Text>Carbohydrates: {product.nutriments.carbohydrates} g</Text>}
          {product.nutriments?.sugars !== undefined && <Text>Sugars: {product.nutriments.sugars} g</Text>}
          {product.nutriments?.fat !== undefined && <Text>Fat: {product.nutriments.fat} g</Text>}
          {product.nutriments?.saturated_fat !== undefined && <Text>Saturated Fat: {product.nutriments.saturated_fat} g</Text>}
          {product.nutriments?.proteins !== undefined && <Text>Proteins: {product.nutriments.proteins} g</Text>}
          {product.nutriments?.salt !== undefined && <Text>Salt: {product.nutriments.salt} g</Text>}
          {product.nutriments?.fiber !== undefined && <Text>Fiber: {product.nutriments.fiber} g</Text>}
        </View>
      )}

      {/* Allergens Section */}
      {product.allergens && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Allergens</Text>
          <Text>{product.allergens}</Text>
        </View>
      )}

      {/* Ingredients Section */}
      {product.ingredients_text && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text>{product.ingredients_text}</Text>
        </View>
      )}

      {/* Additional Information Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        {product.nutriscore_grade && (
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Nutri-Score:</Text>
            <NutriScoreBadge grade={product.nutriscore_grade} />
          </View>
        )}
        {product.ecoscore_grade && <Text>Eco-Score: {product.ecoscore_grade}</Text>}
        {product.nova_group !== undefined && <Text>NOVA Group: {product.nova_group}</Text>}
        {product.countries && <Text>Countries: {product.countries}</Text>}
        {product.packaging && <Text>Packaging: {product.packaging}</Text>}
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
    fontSize: 16,
    marginRight: 8,
  },
});
export default NutritionScreen;