import { StyleSheet, Platform, Image } from 'react-native';
import React from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import LatestEscapeGames from '../indexeComponent/LasteEscapeGame';
import TopEscapeGames from '../indexeComponent/TopEscapeGame';
import RecommandedEscapeGames from '../indexeComponent/RecomandedEscapegame';
import LatestEscapeGamesNoted from '../indexeComponent/LastestEscapeNoted';
import LatestAnnonces from '../indexeComponent/LastAnnoncePlateforme';
import AppView from '@/components/ui/AppView';
import { ThemedText } from '@/components/ThemedText';
import LinearGradientWrapSynthwave, { SynthwaveText } from '../../components/ui/synthwaveGradienbt';
export default function HomeScreen() {
  const theme = useTheme();

  return (
  <AppView>

        <Surface style={styles.titleContainer} elevation={0}>
          <LinearGradientWrapSynthwave>
          <SynthwaveText>
            <Text variant="headlineLarge">Welcome!</Text>
          </SynthwaveText>
          </LinearGradientWrapSynthwave>
        </Surface>
   
        <Surface style={styles.stepContainer} elevation={0}>
           <ThemedText type="subtitle">
                   <Text >
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                   </Text>
               </ThemedText>
        </Surface>

          <Surface style={styles.contentContainer} elevation={0}>
           
            <LatestAnnonces />
            </Surface>
        <Surface style={styles.stepContainer} elevation={0}>
            <LatestEscapeGames />
        </Surface>
        <Surface style={styles.stepContainer} elevation={0}>
         
            <RecommandedEscapeGames />
            </Surface>
           
        <Surface style={styles.stepContainer} elevation={0}>
            <LatestEscapeGamesNoted />
          </Surface>
  </AppView>
  
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
