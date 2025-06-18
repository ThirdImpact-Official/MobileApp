import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import FormUtils from '@/classes/FormUtils';
import { UnitofAction } from '@/action/UnitofAction';
import AppView from '@/components/ui/AppView';
import { Card, Text, Button, Portal, Dialog, useTheme, IconButton } from 'react-native-paper';

export default function EscapeGameDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();
    const action = new UnitofAction();

    const rawId = Array.isArray(id) ? null : id;
    const numericId = rawId ? Number(rawId) : null;

    const [state, setState] = useState<GetEscapeGameDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isErrorVisible, setIsErrorVisible] = useState(false);

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
            setIsErrorVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const AddFavorite = async () => {
        try {
            const response = await action.favorisAction.addFavoris(state!.esgId);
            if (response.Success) {
                showDialog('Success', 'Game added to favorites');
            }
        } catch (error) {
            showDialog('Error', 'Failed to add to favorites');
        }
    };

    const showDialog = (title: string, message: string) => {
        // Implement dialog showing logic here using react-native-paper Dialog
    };

    useEffect(() => {
        fetchEscapeGame();
    }, [numericId]);

    if (isLoading) {
        return (
            <AppView>
                <View style={styles.centered}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} />
                </View>
            </AppView>
        );
    }

    if (!state) {
        return (
            <AppView>
                <View style={styles.container}>
                    <Text variant="headlineMedium">No game data available</Text>
                </View>
            </AppView>
        );
    }

    const formattedDate = state.esg_CreationDate
        ? FormUtils.FormatDate(state.esg_CreationDate.toString())
        : 'Date not available';

    return (
        <AppView>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Card style={styles.card}>
                    <Card.Title
                        title={state.esgNom || 'Untitled Game'}
                        subtitle={`Created: ${formattedDate}`}
                        right={(props) => (
                            <IconButton
                                {...props}
                                icon="heart"
                                onPress={AddFavorite}
                            />
                        )}
                    />

                    <Card.Cover
                        source={{ uri: state.esgImgResources || 'https://via.placeholder.com/300x200?text=No+Image' }}
                        style={styles.image}
                    />

                    <Card.Content style={styles.content}>
                        <Text variant="bodyLarge" style={styles.description}>
                            {state.esgContent || 'No description available'}
                        </Text>

                        <View style={styles.detailsGrid}>
                            <DetailItem
                                label="Child-friendly"
                                value={state.esg_IsForChildren ? "Yes" : "No"}
                            />
                            <DetailItem
                                label="Phone"
                                value={state.esgPhoneNumber || 'Not available'}
                            />
                            <DetailItem
                                label="Difficulty"
                                value={state.difficultyLevel?.dileName || 'Not specified'}
                            />
                            <DetailItem
                                label="Price"
                                value={state.price?.indicePrice.toString() || 'Not specified'}
                            />
                        </View>
                    </Card.Content>

                    <Card.Actions style={styles.actions}>
                        <Button
                            mode="contained"
                            onPress={() => router.push(`/Organisation/SessionGame/SessionGameList?id=${state.esgId}`)}
                        >
                            Game Sessions
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() => router.push('/Organisation/ActivitityPlace/ActivityPlaceList')}
                        >
                            Activities
                        </Button>
                        <Button
                            mode="contained"
                            onPress={() => router.push({
                                pathname: '/Organisation/Event/Eventlist',
                                params: { id: id }
                            })}
                        >
                            Events
                        </Button>
                    </Card.Actions>
                </Card>
            </ScrollView>

            <Portal>
                <Dialog visible={isErrorVisible} onDismiss={() => setIsErrorVisible(false)}>
                    <Dialog.Title>Error</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{error}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setIsErrorVisible(false)}>OK</Button>
                        <Button onPress={fetchEscapeGame}>Retry</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </AppView>
    );
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View>
    <View style={styles.detailItem}></View>
        <Text variant="labelLarge">{label}</Text>
        <Text variant="bodyMedium">{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    scrollViewContent: {
        padding: 16,
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
        marginBottom: 16,
    },
    image: {
        height: 200,
    },
    content: {
        padding: 16,
    },
    description: {
        marginBottom: 16,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    detailItem: {
        flex: 1,
        minWidth: '45%',
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 8,
        gap: 8,
    },
});
