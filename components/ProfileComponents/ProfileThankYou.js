// components/profile/ThankYouSection.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ProfileThankYou = React.memo(({ welcomeText, onSocialLink, isLoading }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{welcomeText}</Text>
    <Text style={styles.title}>for exploring NutriNom!</Text>
    <Text style={styles.text}>
    I built this app as a personal project, and I'm passionate about 
    continuously improving it with your feedback.
  </Text>

    <View style={styles.socialLinksContainer}>
      <TouchableOpacity 
        onPress={onSocialLink}
        style={styles.socialLink}
        disabled={isLoading}
      >
        <Text style={styles.socialLinkText}>Let's connect & chat on</Text>
        <FontAwesome name="linkedin-square" size={24} color="#0A66C2" />
      </TouchableOpacity>
    </View>
  </View>
));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 45
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 6,
    marginBottom: 10,
    lineHeight: 24,
  },
  socialLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialLink: {
    backgroundColor: '#ffffff',
    padding:10,
    paddingHorizontal:15,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  socialLinkText: {
    fontSize:16,
    color: 'black',
    fontWeight: '600',
  }
});

export default ProfileThankYou;