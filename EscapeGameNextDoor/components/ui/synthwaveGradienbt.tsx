import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface LinearGradientWrapperProps {
  children: React.ReactNode;
}

export default function LinearGradientWrapSynthwave({ children }: LinearGradientWrapperProps) {
  return (
    <LinearGradient
      colors={[
        '#0f0f23',     // Bleu très foncé (haut)
        '#1a1a2e',     // Bleu foncé
        '#16213e',     // Bleu-violet
        '#0f3460',     // Bleu moyen
        '#e94560',     // Rose/magenta (accent)
        '#f39c12',     // Orange/jaune (bas)
      ]}
      locations={[0, 0.2, 0.4, 0.6, 0.85, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientHeader}
    >
      {/* Effet de grille synthwave simplifié */}
      <View style={styles.gridOverlay} />
      
      {/* Effets de lueur néon multiples - version web compatible */}
      <View style={styles.glowEffect1} />
      <View style={styles.glowEffect2} />
      <View style={styles.glowEffect3} />
      
      {/* Lignes néon horizontales */}
      <View style={styles.neonLine1} />
      <View style={styles.neonLine2} />
      
      {/* Contenu */}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  contentContainer: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Effet de grille synthwave (version web compatible)
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: 'rgba(233, 69, 96, 0.05)',
    zIndex: 1,
  },
  
  // Effets de lueur néon - version simplifiée pour web
  glowEffect1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    top: '10%',
    left: '20%',
    opacity: 0.8,
    zIndex: 2,
  },
  
  glowEffect2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    bottom: '20%',
    right: '15%',
    opacity: 0.6,
    zIndex: 2,
  },
  
  glowEffect3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 0, 255, 0.12)',
    top: '60%',
    left: '10%',
    opacity: 0.7,
    zIndex: 2,
  },
  
  // Lignes néon horizontales
  neonLine1: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#e94560',
    top: '30%',
    opacity: 0.6,
    zIndex: 3,
  },
  
  neonLine2: {
    position: 'absolute',
    width: '80%',
    height: 1,
    backgroundColor: '#00ffff',
    bottom: '25%',
    opacity: 0.4,
    zIndex: 3,
  },
});

// Composant Text avec style synthwave (optionnel)
export const SynthwaveText = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <Text style={[synthwaveTextStyles.synthwaveText, style]}>
    {children}
  </Text>
);

const synthwaveTextStyles = StyleSheet.create({
  synthwaveText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
});