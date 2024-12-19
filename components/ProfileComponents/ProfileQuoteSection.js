// components/profile/QuoteSection.js
import React from 'react';
import { ImageBackground, Text, StyleSheet } from 'react-native';

const ProfileQuoteSection = React.memo(({ fact }) => (
  <ImageBackground
    source={require('../../assets/images/Quote_Bubble.png')}
    style={styles.container}
    resizeMode="contain"
  >
    <Text style={styles.text}>{fact}</Text>
  </ImageBackground>
));

const styles = StyleSheet.create({
  container: {
    width: 380,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -15
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 60,
    marginBottom: 35
  }
});

export default ProfileQuoteSection;