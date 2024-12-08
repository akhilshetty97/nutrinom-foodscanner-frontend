import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutriScoreBadgeProps {
  grade: string;
}

const NutriScoreBadge: React.FC<NutriScoreBadgeProps> = ({ grade }) => {
  const normalizedGrade = grade.toLowerCase();
  const isValidGrade = ['a', 'b', 'c', 'd', 'e'].includes(normalizedGrade);
  
  if (!isValidGrade) return null;

  const getBackgroundColor = (score: string) => {
    switch (score) {
      case 'a':
        return '#1a7f37'; // Dark green
      case 'b':
        return '#2da44e'; // Light green
      case 'c':
        return '#d4a72c'; // Yellow
      case 'd':
        return '#e16f24'; // Orange
      case 'e':
        return '#cf222e'; // Red
      default:
        return '#8c959f'; // Default gray
    }
  };

  return (
    <View 
      style={[
        styles.badge, 
        { backgroundColor: getBackgroundColor(normalizedGrade) }
      ]}
    >
      <Text style={styles.text}>{grade.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    width: 25,
    height: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NutriScoreBadge;