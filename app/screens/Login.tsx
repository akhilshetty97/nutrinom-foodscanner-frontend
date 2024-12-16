import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useContext } from 'react'
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext.js';
import * as Sentry from '@sentry/react-native';

const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const Login = () => {
  const { login, setUserInfo, setToken, setIsAuthenticated } = useContext(AuthContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
  });

  useEffect(() => {
    const handleSignIn = async () => {
      if (response?.type === 'success') {
        try {
          const accessToken = response?.authentication?.accessToken;
  
          // Add breadcrumb for successful Google auth
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'Google authentication successful',
            level: 'info'
          });
          const res = await axios.post(`${BACKEND_URL}/auth`, {
            token: accessToken,
          });
  
          const user = res.data.data.user;
          const token = res.data.data.token;
  
          // Use the login method from context
          await login(user, token);
          // Add breadcrumb for successful backend auth
          Sentry.addBreadcrumb({
            category: 'auth',
            message: 'Backend authentication successful',
            level: 'info'
          });
          
        } catch (error) {
          // Capture the error with context
          Sentry.captureException(error, {
            tags: {
              location: 'login_flow',
              errorType: error instanceof Error ? error.name : 'unknown'
            },
            extra: {
              hasAccessToken: !!response?.authentication?.accessToken,
              responseType: response?.type
            }
          });
          setIsAuthenticated(false);
        }
      }
    };
  
    if (response) {
      handleSignIn();
    }
  }, [response]);

  // Track sign-in button press
  const handleSignInPress = () => {
    Sentry.addBreadcrumb({
      category: 'user_action',
      message: 'User initiated Google sign-in',
      level: 'info'
    });
    promptAsync();
  };

  return (
    <View className='flex-1'>
    <Image
    style={styles.image}
    source={{
      uri:'https://cdn.pixabay.com/photo/2016/12/10/21/26/food-1898194_1280.jpg'
    }}
    resizeMode='cover'
  />
    <View className='flex items-center justify-between top-[38%]'>
    <View className='items-center'>
        <Image className='w-20 h-20 mb-5' source={require('./../../assets/images/icon.png')}/>
        <Text className='text-white font-bold text-5xl'>NutriNom</Text>
        <Text className='text-white font-medium text-3xl mt-3'>Scan • Learn • Nom</Text>
    </View>
    <TouchableOpacity className='flex flex-row items-center gap-5 bg-white rounded-xl mt-20 p-3 px-5' onPress={() => handleSignInPress()}>
        <Image className='w-8 h-8' source={require('./../../assets/images/google.png')}/>
        <Text className='text-lg font-medium'>Sign In with Google</Text>
    </TouchableOpacity>
  </View>
  </View>
  )
}

const styles = StyleSheet.create({
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      opacity:0.5
    }
  });

export default Login