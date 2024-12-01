import { View, Text, Image } from 'react-native'
import React from 'react'

const HistoryList = () => {
  return (
    <View style={{
      width: '100%', 
      paddingHorizontal: 10, 
      marginBottom: 15, 
    }}>
      <View style={{
        paddingVertical: 60, 
        borderRadius: 8, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // for Android shadow
        backgroundColor: '#E4F5DC',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}>
        <Image/>
        <Text>HistoryList</Text>
      </View>
    </View>
  )
}

export default HistoryList