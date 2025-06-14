import { Image, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import React from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';
import LatestEscapeGames from '../indexeComponent/LasteEscapeGame';
import TopEscapeGames from '../indexeComponent/TopEscapeGame';
import RecommandedEscapeGames from '../indexeComponent/RecomandedEscapegame';
import LatestEscapeGamesNoted from '../indexeComponent/LastestEscapeNoted';
import LatestAnnonces from '../indexeComponent/LastAnnoncePlateforme';


export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
     
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
        <ThemedView>

        <LatestAnnonces />
    
        <LatestEscapeGames />
     
        <LatestEscapeGames />
   
     
        <RecommandedEscapeGames />
     
        <LatestEscapeGamesNoted />
        </ThemedView>
        </ThemedView>
   
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
