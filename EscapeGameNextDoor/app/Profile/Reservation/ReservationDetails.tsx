import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import FormUtils from '@/classes/FormUtils';
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { GetSessionReservedDto } from '../../../interfaces/EscapeGameInterface/Reservation/getSessionReservedDto';
import { GetSessionGameDto } from '../../../interfaces/EscapeGameInterface/Session/getSessionGameDto';

export default function Reservation() {
    const { reservation } = useLocalSearchParams();
    const [state, setState] = useState<GetSessionReservedDto | undefined>(JSON.parse(reservation as string));
    const rooter = useRouter();
    const [sessiongGame, setSessionGame] = useState<GetSessionGameDto | undefined>(
        state?.sessionGame === null || state?.sessionGame === undefined ? undefined : state.sessionGame
    );

    if (state === undefined || sessiongGame === undefined) {
        return (
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={
                    <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />
                }
            >
                <View style={styles.centered}>
                    <View style={styles.card}>
                        <ActivityIndicator size="large" />
                    </View>
                </View>
            </ParallaxScrollView>
        );
    } else {
        return (
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={
                    <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />
                }
            >
                <ScrollView contentContainerStyle={styles.centered}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.title}>{/* Add a title here if needed */}</Text>
                            <Text style={styles.subtitle}>{FormUtils.FormatDate(sessiongGame.gameDate.toString())}</Text>
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.label}>
                                <Text style={styles.bold}>Date de réservation :</Text> {FormUtils.FormatDate(state.creationDate.toString())}
                            </Text>
                            <Text style={styles.label}>
                                <Text style={styles.bold}>Game Name:</Text> {sessiongGame.price}
                            </Text>
                            <Text style={styles.label}>
                                <Text style={styles.bold}>Place Available:</Text> {sessiongGame.placeAvailable}
                            </Text>
                            <Text style={styles.label}>
                                <Text style={styles.bold}>Place Maximum:</Text> {sessiongGame.placeMaximum}
                            </Text>
                            <Text style={styles.label}>{state.content}</Text>
                        </View>
                        <View style={styles.cardActions}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => rooter.push({
                                    pathname: '/Organisation/EscapeGame/EscapeGameDetails'
                                    ,params: { id: sessiongGame.escapeGameId}
                                })}
                            >
                                <Text style={styles.buttonText}>Escape Game</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => rooter.push(`/Profile/Reservation/Reservation`)}
                            >
                                <Text style={styles.buttonText}>Avis</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => rooter.push(`/Profile/Reservation/Reservation`)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ParallaxScrollView>
        );
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        marginVertical: 20,
    },
    cardHeader: {
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
    },
    cardContent: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    bold: {
        fontWeight: 'bold',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#1976d2',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
