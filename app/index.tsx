import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import TabNavigation from './navigation/TabNavigation'

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      color: isDark ? '#fff' : '#000',
    },
  });

  return (
    <View className='flex-1'>
        <TabNavigation/>
    </View>
  );
}