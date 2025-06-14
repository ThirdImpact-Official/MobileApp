// === SUPPRESSION DES ERREURS DE DÉVELOPPEMENT EXPO ===
if (__DEV__) {
  // Supprimer les erreurs LogBox problématiques
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    const message = args[0]?.toString?.() || '';
    
    // Ignorer les erreurs connues d'Expo/Metro
    if (
      message.includes("Can't perform a React state update on a component that hasn't mounted yet") ||
      message.includes('LogBoxData') ||
      message.includes('useLayoutEffect does nothing on the server') ||
      message.includes('Warning: useLayoutEffect does nothing on the server')
    ) {
      return;
    }
    
    originalError(...args);
  };
  
  console.warn = (...args) => {
    const message = args[0]?.toString?.() || '';
    
    if (
      message.includes('useLayoutEffect does nothing on the server') ||
      message.includes('deprecated glob') ||
      message.includes('Glob versions prior to v9 are no longer supported')
    ) {
      return;
    }
    
    originalWarn(...args);
  };
}

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/ContextHook/AuthContext';
import { ToastedProvider } from '@/context/ContextHook/ToastedContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ToastedProvider>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </AuthProvider>
      </ToastedProvider>
    </ApplicationProvider>
  );
}