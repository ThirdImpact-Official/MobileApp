import { StyleSheet, Image, Platform } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ActivityIndicator, Text } from 'react-native';
import { useAuth } from '@/context/ContextHook/AuthContext';
import HelloWave from '../../components/HelloWave';

export default function TabTwoScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.headerImage}
          />
        }>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text> Loading...</Text>
        <Text>Chargement...</Text>
      </ParallaxScrollView>
    );
  } else if (!isAuthenticated) {
    // Add content for unauthenticated users
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.headerImage}
          />
        }>
        <ThemedView style={styles.headerImage}>
          <ThemedText style={styles.titleContainer}>Please Log In</ThemedText>
          <ThemedText>You need to be authenticated to view this content</ThemedText>
          <HelloWave />
        </ThemedView>
      </ParallaxScrollView>
    );
  } else {
    // Content for authenticated users
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        }>
        <ThemedView>
          <ThemedText>Explore</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
