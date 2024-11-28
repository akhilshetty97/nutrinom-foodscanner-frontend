import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import React, { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';

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
  const params = useLocalSearchParams();

  const foodData: FoodData = useMemo(() => {
    try {
      // Parse the stringified data
      return params.foodData ? JSON.parse(params.foodData as string) : null;
    } catch (error) {
      console.error('Error parsing food data', error);
      return null;
    }
  }, [params.foodData]);

  if (!foodData || !foodData.product) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
});

export default NutritionScreen;
