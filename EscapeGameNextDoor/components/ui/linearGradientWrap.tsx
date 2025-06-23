import { StyleSheet, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue } from 'react-native';

interface LinearGradientWrapperProps {
  children: React.ReactNode;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  style?: any;
  glowEnabled?: boolean;
}

export function LinearGradientWrap({ 
  children, 
  colors = ['#667eea', '#764ba2', '#f093fb'] as const,
  style,
  glowEnabled = true 
}: LinearGradientWrapperProps) {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.gradientHeader, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.innerContent}> 
        {children}
      </View>
      {glowEnabled && <View style={styles.glowEffect} />}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1, // Ensure content appears above glow effect
  },
  glowEffect: {
    position: 'absolute',
    width: 250,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
    zIndex: 0, // Behind the content
  },
});

export default LinearGradientWrap;