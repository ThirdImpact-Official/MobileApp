import { StyleSheet, Platform, Image } from 'react-native';
import React from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import LatestEscapeGames from '../indexeComponent/LasteEscapeGame';
import TopEscapeGames from '../indexeComponent/TopEscapeGame';
import RecommandedEscapeGames from '../indexeComponent/RecomandedEscapegame';
import LatestEscapeGamesNoted from '../indexeComponent/LastestEscapeNoted';
import LatestAnnonces from '../indexeComponent/LastAnnoncePlateforme';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: theme.colors.primary, dark: theme.colors.backdrop }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <Surface style={styles.container}>
        <Surface style={styles.titleContainer} elevation={0}>
          <Text variant="headlineLarge">Welcome!</Text>
        </Surface>

        <Surface style={styles.stepContainer} elevation={0}>
          <Text variant="titleMedium">Step 1: Try it</Text>
          <Text variant="bodyMedium">
            Edit <Text style={styles.boldText}>app/(tabs)/index.tsx</Text> to see changes.
            Press{' '}
            <Text style={styles.boldText}>
              {Platform.select({
                ios: 'cmd + d',
                android: 'cmd + m',
                web: 'F12'
              })}
            </Text>{' '}
            to open developer tools.
          </Text>

          <Surface style={styles.contentContainer} elevation={0}>
            <LatestAnnonces />
            <LatestEscapeGames />
            <RecommandedEscapeGames />
            <LatestEscapeGamesNoted />
          </Surface>
        </Surface>
      </Surface>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepContainer: {
    gap: 12,
    marginBottom: 16,
  },
  contentContainer: {
    gap: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  boldText: {
    fontWeight: 'bold',
  }
});
