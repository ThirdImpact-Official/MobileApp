import React from "react";
import { Image, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import ParallaxScrollView from "../ParallaxScrollView";
import { useAuth } from '../../context/ContextHook/AuthContext';

interface AppViewProps {
  children: React.ReactNode;
}

export default function AppView({ children }: AppViewProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href='/Authentication/Login' />;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image 
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo} 
        />
      }
    >
      {children}
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