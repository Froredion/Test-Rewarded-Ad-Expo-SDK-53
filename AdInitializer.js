import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import {
  getTrackingPermissionsAsync,
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';

export default function AdInitializer({ onInitialized }) {
  useEffect(() => {
    async function initializeAds() {
      try {
        console.log('Starting ads initialization...');
        
        // Request tracking permission
        const { status } = await getTrackingPermissionsAsync();
        console.log('Tracking permission status:', status);
        
        if (status === PermissionStatus.UNDETERMINED) {
          const result = await requestTrackingPermissionsAsync();
          console.log('Tracking permission request result:', result);
        }

        // Initialize the SDK first
        console.log('Initializing Mobile Ads SDK...');
        const initResult = await mobileAds().initialize();
        console.log('Mobile Ads SDK initialized:', initResult);

        // Then configure request configuration
        console.log('Setting request configuration...');
        await mobileAds().setRequestConfiguration({
          // Update all future requests suitable for parental guidance
          maxAdContentRating: MaxAdContentRating.PG,
          // Indicates that you want your content treated as child-directed for purposes of COPPA
          tagForChildDirectedTreatment: true,
          // Indicates that you want the ad request to be handled in a manner suitable for users under the age of consent
          tagForUnderAgeOfConsent: true,
          // An array of test device IDs to allow
          testDeviceIdentifiers: ['EMULATOR'],
        });
        console.log('Request configuration set successfully');

        if (onInitialized) {
          console.log('Calling onInitialized callback');
          onInitialized();
        }
      } catch (error) {
        console.error('Error initializing ads:', error);
      }
    }

    initializeAds();
  }, [onInitialized]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Initializing Ads...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
}); 