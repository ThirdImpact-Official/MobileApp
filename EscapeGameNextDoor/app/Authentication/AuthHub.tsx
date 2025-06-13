import React from 'react';
import { styles } from '../../constants/styles';
import { Image, Pressable, Text, View } from 'react-native';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { router } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function AuthHub() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.headerImage}
                />
            }
        >
            <View style={{ alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row', marginVertical: 20 }}>
                <ThemedText>
                    <Text style={{ fontSize: 24, textAlign: 'center' }}>Authentification</Text>
                </ThemedText>
            </View>
            <ThemedView>
                <View style={{ backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row' }}>
                    <Pressable
                        onPress={() => { router.push('/Authentication/Login'); }}
                        style={({ pressed }) => [
                            { margin: 8, padding: 8, backgroundColor: pressed ? '#eee' : '#ddd', borderRadius: 4 }
                        ]}
                    >
                        <Text>Se connecter</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => { router.push('/Authentication/Register'); }}
                        style={({ pressed }) => [
                            { margin: 8, padding: 8, backgroundColor: pressed ? '#eee' : '#ddd', borderRadius: 4 }
                        ]}
                    >
                        <Text>S'inscrire</Text>
                    </Pressable>
                </View>
            </ThemedView>
        </ParallaxScrollView>
    );
}