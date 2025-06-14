import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import FormUtils from '@/classes/FormUtils';
import { UnitofAction } from '@/action/UnitofAction';

export default function EscapeGameDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const action = new UnitofAction();

    const rawId = Array.isArray(id) ? null : id;
    const numericId = rawId ? Number(rawId) : null;

    const [state, setState] = useState<GetEscapeGameDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEscapeGame = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!numericId || isNaN(numericId)) {
                throw new Error('Invalid game ID');
            }

            const response = await action.escapeGameAction.getEscapeGameById(numericId);

            if (!response.Success || !response.Data) {
                throw new Error(response.Message || 'Failed to load game details');
            }

            setState(response.Data as GetEscapeGameDto);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
            console.error('Fetch error:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEscapeGame();
    }, [numericId]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <Button title="Retry" onPress={fetchEscapeGame} />
            </View>
        );
    }

    if (!state) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>No game data available</Text>
            </View>
        );
    }
    const AddFvorite= async () => {
        try {
            const response = await action.favorisAction.addFavoris(state.esgId);
            if (response.Success) {
                Alert.alert('Success', 'Game added to favorites');
            }
        }
        catch (error) {
            Alert.alert('Error', 'Failed to add to favorites');
            console.error('Add to favorites error:', error);
        }
    }
    const formattedDate = state.esg_CreationDate 
        ? FormUtils.FormatDate(state.esg_CreationDate.toString()) 
        : 'Date not available';

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View className='flex flex-row justify-between items-end w-full mb-4'>
                <Button title="Ajouter aux Favoris" onPress={AddFvorite} />
            </View>
            <View style={styles.card}>
                <Text style={styles.title}>{state.esgNom || 'Untitled Game'}</Text>
                <Text style={styles.subheader}>Created: {formattedDate}</Text>

                <Image
                    source={{ uri: state.esgImgResources || 'https://via.placeholder.com/300x200?text=No+Image' }}
                    style={styles.image}
                    onError={() => Alert.alert('Image not available')}
                />

                <View style={styles.content}>
                    <Text style={styles.label}><Text style={{fontWeight:'bold'}}>Description:</Text> {state.esgContent || 'No description available'}</Text>

                    <View style={styles.rowWrap}>
                        <Text style={styles.label}><Text style={{fontWeight:'bold'}}>Child-friendly:</Text> {state.esg_IsForChildren ? "Yes" : "No"}</Text>
                        <Text style={styles.label}><Text style={{fontWeight:'bold'}}>Phone:</Text> {state.esgPhoneNumber || 'Not available'}</Text>
                        <Text style={styles.label}><Text style={{fontWeight:'bold'}}>Difficulty:</Text> {state.difficultyLevel?.dowName || 'Not specified'}</Text>
                        <Text style={styles.label}><Text style={{fontWeight:'bold'}}>Price:</Text> {state.price?.indicePrice || 'Not specified'}</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.button} onPress={() => Alert.alert('User Reviews clicked')}>
                        <Text style={styles.buttonText}>User Reviews</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => state.esgId && router.push(`/Organisation/SessionGame/SessionGameList?id=${state.esgId}`)}
                    >
                        <Text style={styles.buttonText}>Game Sessions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/Organisation/ActivitityPlace/ActivityPlaceList')}
                    >
                        <Text style={styles.buttonText}>Activities</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        padding: 16,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    subheader: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 240,
        borderRadius: 6,
        marginBottom: 16,
        backgroundColor: '#ddd',
    },
    content: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    rowWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8, // gap n’est pas standard sur RN, tu peux gérer marge manuellement
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#1976d2',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        minWidth: 90,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        fontSize: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
    },
});
