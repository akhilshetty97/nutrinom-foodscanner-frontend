import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar, SafeAreaView, ImageBackground, StyleSheet, Linking, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import * as Sentry from '@sentry/react-native';
import { foodFacts } from '../../components/ProfileComponents/foodFacts';
import ProfileHeader from '../../components/ProfileComponents/ProfileHeader';
import ProfileQuoteSection from '../../components/ProfileComponents/ProfileQuoteSection';
import ProfileThankYou from '../../components/ProfileComponents/ProfileThankYou';
import LoadingOverlay from '../../components/ProfileComponents/LoadingOverlay'

const ProfileScreen = () => {
  const { logout, deleteAccount } = useContext(AuthContext);
  const [randomFact, setRandomFact] = useState("");
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false); 

  // Memoize handlers
  const handleLogout = useCallback(async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              Sentry.addBreadcrumb({
                category: 'auth',
                message: 'User initiated logout',
                level: 'info'
              });
              await logout();
            } catch (error) {
              Sentry.captureException(error, {
                tags: {
                  location: 'profile_logout',
                  errorType: error instanceof Error ? error.name : 'unknown'
                },
                extra: {
                  userId: user?.id
                }
              });
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  }, [logout, user?.id]);

  const handleDelete = useCallback(async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await deleteAccount();
            } catch (error) {
              Sentry.captureException(error, {
                tags: {
                  location: 'profile_delete',
                  errorType: error instanceof Error ? error.name : 'unknown'
                },
                extra: {
                  userId: user?.id
                }
              });
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again later."
              );
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  }, [deleteAccount, user?.id]);

  const openSocialLink = useCallback(() => {
    Linking.openURL('https://www.linkedin.com/in/akhilshetty24/').catch((err) => {
      Sentry.captureException(err, {
        tags: {
          location: 'social_link',
          errorType: err instanceof Error ? err.name : 'unknown'
        }
      });
    });
  }, []);

  // Create a helper function
  const getRandomFact = () => foodFacts[Math.floor(Math.random() * foodFacts.length)];

  // Set random fact only once on mount
  useEffect(() => {
    setRandomFact(getRandomFact());
    return () => {
      // Cleanup
      setRandomFact("");
      setIsLoading(false);
    };
  }, []);

  // Memoize the welcome text
  const welcomeText = useMemo(() => {
    return `Thank You${user?.given_name !== 'Apple User' ? `, ${user?.given_name}` : ''}`;
  }, [user?.given_name]);

  if (!user) return null;

  return (
    <SafeAreaView 
      style={{
        flex: 1, 
        backgroundColor: '#f4f4f4',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }}
    >
      <ProfileHeader 
        onLogout={handleLogout}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <View style={styles.container}>
        <ProfileQuoteSection fact={randomFact} />
        <ProfileThankYou 
          welcomeText={welcomeText}
          onSocialLink={openSocialLink}
          isLoading={isLoading}
        />
      </View>

      {isLoading && <LoadingOverlay />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e7e3db',
    padding: 20,
  }
});

export default ProfileScreen;