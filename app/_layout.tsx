import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../app/contexts/AuthContext.js';
import { ScanProvider } from '../app/contexts/ScanContext.js';
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
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
  );
}