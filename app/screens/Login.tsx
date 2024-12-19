import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext.js';
import * as Sentry from '@sentry/react-native';

const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const Login = () => {
  const { login, setIsAuthenticated } = useContext(AuthContext);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
  });

  useEffect(() => {
    const handleSignIn = async () => {
      if (response?.type === 'success') {
        try {
          setIsGoogleLoading(true);
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
          Alert.alert(
            "Sign In Failed",
            "Unable to sign in with Google. Please try again."
          );
        } finally {
          setIsGoogleLoading(false);
        }
      }
    };
  
    if (response) {
      handleSignIn();
    }
  }, [response]);

  // Track sign-in button press
  const handleSignInPress = () => {
    if (isGoogleLoading) return;
    Sentry.addBreadcrumb({
      category: 'user_action',
      message: 'User initiated Google sign-in',
      level: 'info'
    });
    promptAsync();
  };

  const handleAppleSignIn = async () => {
    if (isAppleLoading) return;
    try {
      setIsAppleLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
  
      // Add breadcrumb for successful Apple auth
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Apple authentication successful',
        level: 'info'
      });
  
      // Call your backend with the Apple credential
      const res = await axios.post(`${BACKEND_URL}/auth/apple`, {
        identityToken: credential.identityToken,
        fullName: credential.fullName,
        email: credential.email,
      });
  
      const user = res.data.data.user;
      const token = res.data.data.token;
  
      // Use the login method from context
      await login(user, token);
  
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Backend authentication successful',
        level: 'info'
      });
  
    } catch (error) {
  
      Sentry.captureException(error, {
        tags: {
          location: 'apple_login_flow',
          errorType: error instanceof Error ? error.name : 'unknown'
        }
      });
      setIsAuthenticated(false);
      Alert.alert(
        "Sign In Failed",
        "Unable to sign in with Apple. Please try again."
      );
    } finally {
      setIsAppleLoading(false);
    }
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
    <View className='flex items-center justify-between top-[35%]'>
    <View className='items-center'>
        <Image className='w-20 h-20 mb-5' source={require('./../../assets/images/icon.png')}/>
        <Text className='text-white font-bold text-5xl'>NutriNom</Text>
        <Text className='text-white font-medium text-3xl mt-3'>Scan • Learn • Nom</Text>
    </View>
    <View className='flex items-center mt-10'>
      <TouchableOpacity className='flex flex-row items-center gap-2 bg-white rounded-xl' style={{ paddingVertical: 13, paddingHorizontal:19, opacity: (isGoogleLoading || isAppleLoading) ? 0.5 : 1 }} onPress={() => handleSignInPress()} disabled={isGoogleLoading || isAppleLoading}>
          {isGoogleLoading ? (
                  <ActivityIndicator color="#666" />
                ) : (
                  <>
                    <Image className='w-5 h-5' source={require('./../../assets/images/google.png')}/>
                    <Text style={{ fontSize: 18 }} className='font-medium'>Sign in with Google</Text>
                  </>
                )}
      </TouchableOpacity>
      {isAppleLoading ? (
            <View style={[styles.appleButton, styles.appleLoadingButton]}>
              <ActivityIndicator color="#000" />
            </View>
          ) : (
            <View style={{ opacity: (isGoogleLoading || isAppleLoading) ? 0.5 : 1 }}>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                cornerRadius={10}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            </View>
          )}
    </View>
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
    },
    appleButton:{
      width:220,
      height:49,
      marginTop:12
    },
    appleLoadingButton: {
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      borderRadius: 10,
    }
  });

export default Login