import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useMemo, useContext } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScanContext } from '../contexts/ScanContext';

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
  const { foodData, clearScannedItem } = useContext(ScanContext);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Check for error from previous screen
  const errorMessage = params.error as string | undefined;

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
      {product.image_front_small_url && <Image source={{ uri: product.image_front_small_url }} style={styles.image} />}
      <Text style={styles.title}>{product.product_name}</Text>
      {product.brands && <Text style={styles.brand}>Brand: {product.brands}</Text>}
      {product.quantity && <Text style={styles.quantity}>Quantity: {product.quantity}</Text>}
      {product.serving_size && <Text style={styles.servingSize}>Serving Size: {product.serving_size}</Text>}
      {product.categories && <Text style={styles.categories}>Categories: {product.categories}</Text>}

      <View style={styles.nutritionSection}>
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

      {product.allergens && (
        <View style={styles.allergensSection}>
          <Text style={styles.sectionTitle}>Allergens</Text>
          <Text>{product.allergens}</Text>
        </View>
      )}

      {product.ingredients_text && (
        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text>{product.ingredients_text}</Text>
        </View>
      )}

      <View style={styles.additionalInfoSection}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        {product.nutriscore_grade && <Text>Nutri-Score: {product.nutriscore_grade}</Text>}
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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brand: {
    fontSize: 18,
    marginBottom: 8,
  },
  quantity: {
    fontSize: 18,
    marginBottom: 8,
  },
  servingSize: {
    fontSize: 18,
    marginBottom: 8,
  },
  categories: {
    fontSize: 18,
    marginBottom: 16,
  },
  nutritionSection: {
    marginBottom: 16,
  },
  allergensSection: {
    marginBottom: 16,
  },
  ingredientsSection: {
    marginBottom: 16,
  },
  additionalInfoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'red',
  },
  errorMessage: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  scannedCodeText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
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
});

export default NutritionScreen;