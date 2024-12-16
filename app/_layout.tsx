import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { View, Text, SafeAreaView, ScrollView, Platform, StatusBar, ActivityIndicator } from 'react-native'
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../app/contexts/AuthContext.js';
import { ScanProvider } from '../app/contexts/ScanContext.js';
import "../global.css";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // Enable performance tracking
  tracesSampleRate: 1.0,
  // Only enable in production
  // enabled: process.env.EXPO_PUBLIC_ENV === 'production',
  // Add environment tag
  environment: process.env.EXPO_PUBLIC_ENV,
  release: process.env.EXPO_PUBLIC_APP_VERSION,
  enableAutoSessionTracking: true
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Sentry.ErrorBoundary fallback={({ error }) => (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text>Sorry, something went wrong.</Text>
      </View>
    )}>
      <AuthProvider>
        <ScanProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" 
                options={{ 
                  headerShown: false 
                }} 
              />
              <Stack.Screen 
                name="(modals)/nutrition-screen" 
                options={{ 
                  presentation: 'modal',
                  headerShown: false 
                }} 
              />
            </Stack>
          </ThemeProvider>
        </ScanProvider>
      </AuthProvider>
    </Sentry.ErrorBoundary>
  );
}