import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import TabNavigation from './navigation/TabNavigation'
import Login from './screens/Login';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../app/contexts/AuthContext.js';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated, loading } = useContext(AuthContext);

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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View className='flex-1'>
        {isAuthenticated ? <TabNavigation/> : <Login/>}
    </View>
  );
}