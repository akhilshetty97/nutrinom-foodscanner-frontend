import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const Login = () => {
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
    <TouchableOpacity className='flex flex-row items-center gap-5 bg-white rounded-xl mt-28 p-3 px-5'>
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