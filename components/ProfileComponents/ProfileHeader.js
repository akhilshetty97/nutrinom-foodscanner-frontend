// components/profile/HeaderSection.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const ProfileHeader = React.memo(({ onLogout, onDelete, isLoading }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Profile</Text>
    <View style={{ flexDirection: 'row', gap: 6 }}>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton} disabled={isLoading}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton} disabled={isLoading}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
));

const styles = StyleSheet.create({
  header: {
    width: '100%',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  logoutButton: {
    backgroundColor: '#202020',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default ProfileHeader;