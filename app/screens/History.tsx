import { View, Text,SafeAreaView, Platform, StatusBar } from 'react-native'
import React from 'react'

const History = () => {
  return (
    <SafeAreaView 
    style={{
      flex: 1,
      backgroundColor:'white',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }}
  >
    <Text>History</Text>
  </SafeAreaView>
  )
}

export default History