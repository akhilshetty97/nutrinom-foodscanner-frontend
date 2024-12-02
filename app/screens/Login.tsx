import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useContext } from 'react'
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext.js';

const IOS_CLIENT_ID = '145316921728-rh0ttpefq7r5ot5ou62ue2ivrpbhg0ma.apps.googleusercontent.com';
const BACKEND_URL = 'http://10.5.1.152:3000';

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
          console.log('Access Token:', accessToken);
  
          const res = await axios.post(`${BACKEND_URL}/auth`, {
            token: accessToken,
          });
  
          const user = res.data.data.user;
          const token = res.data.data.token;
  
          // Use the login method from context
          await login(user, token);
          
        } catch (error) {
          console.error('Login Error:', error);
          setIsAuthenticated(false);
        }
      }
    };
  
    if (response) {
      handleSignIn();
    }
  }, [response]);

  return (
    <View className='flex-1'>
    <Image
    style={styles.image}
    source={{
      uri:'https://cdn.pixabay.com/photo/2016/12/10/21/26/food-1898194_1280.jpg'
    }}
    resizeMode='cover'
  />
    <View className='flex items-center justify-between top-[42%]'>
    <View className='items-center'>
        <Text className='text-white font-bold text-5xl'>NutriNom</Text>
        <Text className='text-white font-medium text-3xl mt-3'>Scan • Learn • Nom</Text>
    </View>
    <TouchableOpacity className='flex flex-row items-center gap-5 bg-white rounded-xl mt-28 p-3 px-5' onPress={() => promptAsync()}>
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
    }
  });

export default Login