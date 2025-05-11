import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import AdInitializer from './AdInitializer';

// Replace with your actual ad unit ID for production
const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-nnnnnnnnnnnnnnn/nnnnnnnnnn';

console.log('adUnitId', adUnitId);
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [adsInitialized, setAdsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (adsInitialized) {
      const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('Ad loaded');
        setLoaded(true);
        setError(null);
      });

      const unsubscribeEarned = rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
          console.log('User earned reward of ', reward);
          setLoaded(false); // Reset loaded state to load a new ad
          rewarded.load(); // Load the next ad
        },
      );

      const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Ad error:', error);
        setError(error.message);
        setLoaded(false);
      });

      // Start loading the rewarded ad straight away
      console.log('Loading ad...');
      rewarded.load();

      // Unsubscribe from events on unmount
      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeError();
      };
    }
  }, [adsInitialized]);

  if (!adsInitialized) {
    return <AdInitializer onInitialized={() => setAdsInitialized(true)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rewarded Ad Example</Text>
      
      {error && (
        <Text style={styles.errorText}>Error: {error}</Text>
      )}
      
      {!loaded ? (
        <Text style={styles.loadingText}>Loading Ad...</Text>
      ) : (
        <Button
          title="Show Rewarded Ad"
          onPress={() => {
            rewarded.show();
          }}
        />
      )}
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
