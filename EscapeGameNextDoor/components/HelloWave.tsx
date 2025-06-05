import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat
} from 'react-native-reanimated';

export default function HelloWave() {
  const offset = useSharedValue(0);
  
  // Fix for web environment
  const isWeb = Platform.OS === 'web';
  
  useEffect(() => {
    // Only use animations on native platforms or if properly set up on web
    if (!isWeb) {
      offset.value = withRepeat(
        withTiming(10, { duration: 1000 }), 
        -1, 
        true
      );
    } else {
      // Simple fallback for web if reanimated isn't properly set up
      console.log('Wave animation is limited on web platform');
    }
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello!</Text>
      {isWeb ? (
        // Fallback for web
        <Text style={styles.wave}>👋</Text>
      ) : (
        // Animated version for native
        <Animated.Text style={[styles.wave, animatedStyles]}>👋</Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginRight: 10,
  },
  wave: {
    fontSize: 24,
  },
});