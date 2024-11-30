import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      // Optional: Any additional navigation or UI updates after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className='flex-1 items-center justify-center'>
      <TouchableOpacity 
        onPress={handleLogout}
        className='bg-red-500 px-6 py-3 rounded-lg'
      >
        <Text className='text-white font-bold'>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;