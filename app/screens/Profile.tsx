import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar, SafeAreaView, ImageBackground, StyleSheet, Linking } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const foodFacts = [
  "Bananas are berries, but strawberries aren't!",
  "The most expensive pizza in the world costs over $12,000 and takes 72 hours to make.",
  "Pineapples take about two years to grow, making every bite worth the wait.",
  "Cows have best friends and get stressed when separated. Happy cows, happy milk!",
  "In Japan, there's a square watermelon that costs up to $200.",
  "The average person will eat about 35 tons of food in their lifetime.",
  "Potatoes were the first vegetable grown in space.",
  "In South Korea, there's a Guinness World Record for the largest collection of kimchi jars.",
  "Apples float because they are 25% air.",
  "Arachibutyrophobia is the fear of peanut butter sticking to the roof of your mouth.",
  "Jellybeans can take up to 21 days to make.",
  "Cheese is the most stolen food in the world. It even has its own black market!",
  "The world's largest pumpkin weighed over 2,700 pounds.",
  "The popsicle was invented by an 11-year-old by accident.",
  "Each color of Fruit Loop tastes the same. It's all in your head!",
  "The blob of toothpaste on your toothbrush is called a 'nurdle.'",
  "Carrots were originally purple, not orange.",
  "Lobsters used to be so cheap they were served in prisons.",
  "There's a museum dedicated entirely to mustard in Wisconsin, USA.",
  "The hole in a doughnut saves time cooking it evenly.",
  "Cotton candy was co-invented by a dentist. Talk about job security!",
  "Watermelons are 92% water, making them the perfect summer snack.",
  "Almonds are seeds, not nuts. Mind blown, right?",
  "The largest cup of coffee ever brewed could fill an entire swimming pool.",
  "Cucumbers are 95% water but 100% refreshing.",
  "Before the fork, people ate with knives, spoons, or their hands.",
  "The fear of cooking is called mageirocophobia.",
  "Ketchup was once sold as medicine in the 1830s.",
  "French fries are not from France; they're actually from Belgium.",
  "An avocado is technically a berry. Yes, guac lovers, a berry!",
  "Grapes explode when you microwave them. (Don't try this at home!)",
  "Peanuts are used to make dynamite. Boom!",
  "A shrimp's heart is in its head.",
  "Froot Loops are all the same flavor despite being different colors.",
  "The oldest known recipe is for beer, from over 4,000 years ago.",
  "Egg yolks are one of the few foods that naturally contain Vitamin D.",
  "It takes about 400 cocoa beans to make one pound of chocolate.",
  "Cashews grow on apples, and their shells are toxic before processing.",
  "Oranges used to be green! In warmer climates, they don't turn orange.",
  "McDonald's sells 75 hamburgers every second.",
  "Spam is short for 'Spiced Ham.'",
  "A bolt of lightning can cook toast, assuming you can harness it safely!",
  "Coffee beans are actually seeds from a cherry-like fruit.",
  "You can hear rhubarb grow. It makes a squeaky sound when sprouting.",
  "Pomegranates can have up to 1,400 seeds each.",
  "Humans share 60% of their DNA with bananas. Explains a lot, doesn't it?"
];

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);
  const [randomFact, setRandomFact] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Pick a random fact when the component mounts
    const fact = foodFacts[Math.floor(Math.random() * foodFacts.length)];
    setRandomFact(fact);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openSocialLink = (platform:string) => {
    let url = '';
    switch(platform) {
      case 'linkedin':
        url = 'https://www.linkedin.com/in/akhilshetty24/'; 
        break;
      case 'github':
        url = 'https://github.com/akhilshetty97'; 
        break;
    }
    Linking.openURL(url).catch((err) => console.error('Could not open URL:', err));
  };

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
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Food Fact Quote */}
        <ImageBackground
          source={require('../../assets/images/Quote_Bubble.png')} 
          style={styles.quoteContainer}
          resizeMode="contain"
        >
          <Text style={styles.quoteText}>{randomFact}</Text>
        </ImageBackground>

        {/* Thank You Note */}
        <View style={styles.thankYouContainer}>
        <Text style={styles.thankYouTitle}>
          Thank You, {user.given_name},
        </Text>
        <Text style={styles.thankYouTitle}>
          for Trying My App!
        </Text>
          <Text style={styles.thankYouText}>
            I'm incredibly grateful for your support and hope you're enjoying the experience. 
            Your feedback and enthusiasm mean the world to us.
          </Text>

          {/* Social Links */}
          <View style={styles.socialLinksContainer}>
            <TouchableOpacity 
              onPress={() => openSocialLink('linkedin')}
              style={styles.socialLink}
            >
              <FontAwesome name="linkedin-square" size={24} color="black" />
              <Text style={styles.socialLinkText}>LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => openSocialLink('github')}
              style={styles.socialLink}
            >
              <AntDesign name="github" size={24} color="black" />
              <Text style={styles.socialLinkText}>GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  quoteContainer: {
    width: 400, 
    height: 300, 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 60,  
    marginBottom: 35
  },
  logoutButton: {
    backgroundColor: '#202020',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  thankYouContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  thankYouTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  thankYouText: {
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
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:10
  },
  socialLinkText: {
    color: '#333',
    fontWeight: '600',
  },
});

export default ProfileScreen;