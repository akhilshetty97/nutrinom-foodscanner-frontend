import { View, Text, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native'
import React from 'react'
import HistoryList from '../../components/HistoryList'

const History = () => {
  return (
    <SafeAreaView 
      style={{
        flex: 1, 
        backgroundColor: '#f4f4f4',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }}
    >
      {/* Header Section */}
      <View style={{ 
        width: '100%', 
        padding: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ddd' 
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>History</Text>
      </View>

      {/* Content Section (List of History) */}
      <ScrollView 
        contentContainerStyle={{ 
          paddingVertical: 20,  // Add vertical padding
          paddingHorizontal: 10 // Add horizontal padding
        }}
        showsVerticalScrollIndicator={true} // Show scroll indicator
      >
        <HistoryList />
        <HistoryList />
        <HistoryList />
        <HistoryList />
        <HistoryList />
      </ScrollView>
    </SafeAreaView>
  )
}

export default History