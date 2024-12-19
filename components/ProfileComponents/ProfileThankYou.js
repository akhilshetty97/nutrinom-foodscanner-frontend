// components/profile/ThankYouSection.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ProfileThankYou = React.memo(({ welcomeText, onSocialLink, isLoading }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{welcomeText}</Text>
    <Text style={styles.title}>for Exploring My App!</Text>
    <Text style={styles.text}>
      I built this app as a personal project, and your use of it makes it all worthwhile. I'm passionate about 
      continuously improving it, and your feedback would mean so much to me. Stay Tuned for exciting new features!
    </Text>
    
    <View style={styles.socialLinksContainer}>
      <TouchableOpacity 
        onPress={onSocialLink}
        style={styles.socialLink}
        disabled={isLoading}
      >
        <FontAwesome name="linkedin-square" size={24} color="black" />
        <Text style={styles.socialLinkText}>LinkedIn</Text>
      </TouchableOpacity>
    </View>
  </View>
));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 25
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  socialLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialLink: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialLinkText: {
    color: 'black',
    fontWeight: '600',
  }
});

export default ProfileThankYou;