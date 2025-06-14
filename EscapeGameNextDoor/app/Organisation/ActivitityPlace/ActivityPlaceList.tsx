import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { GetActivityPlaceDto } from '../../../interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AppView from '@/components/ui/AppView';
import { Card, List } from 'react-native-paper';
import { testActivityPlaces } from '@/TestData/ActivityPlacetestData';
import { UnitofAction } from '@/action/UnitofAction';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { PaginationResponse } from '@/interfaces/ServiceResponse';

const PAGE_SIZE = 10;
const ActivityPlaceList = () => {
    const [activityPlaces,setActivityPlaces] = React.useState<GetActivityPlaceDto[]>(testActivityPlaces);
    const [expandedId, setExpandedId] = React.useState<number | null>(null);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const action= new UnitofAction();
    const [isLoading, setIsLoading] = React.useState(true);
    const params = useLocalSearchParams();
    const router = useRouter();
    const [page, setPage] = React.useState<number>(1);
    const [totalPages, setTotalPages] = React.useState<number>(1);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const fetchActivityPlaces = async () => {
        try {
            const response = await action.escapeGameAction.getActivityPlacesByEscapeGame(Number(params.id),page,PAGE_SIZE) as PaginationResponse<GetActivityPlaceDto>;
            if(!response.Success) {
                setIsError(true);
                setError(response.Message || 'Failed to fetch activity places');
                throw new Error(response.Message || 'Failed to fetch activity places');
            }
            setIsLoading(false);
            setIsError(false);
            setActivityPlaces(response.Data as GetActivityPlaceDto[] || []);
            setTotalPages(response.TotalPage || 1);
            // Handle successful response
        }
        catch (e) {
            console.error(e);
            setIsError(true);
            setError('Failed to fetch activity places');
        }
    }
    React.useEffect(() => {
        fetchActivityPlaces();
    }, [page, params.id]);
    return (
        <AppView>
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedView style={styles.headerContainer}>
                    <ThemedText type="title" style={styles.title}>
                        Activity Places
                    </ThemedText>
                </ThemedView>

                <Card style={styles.listCard}>
                    <List.Section>
                        {activityPlaces.map((place) => (
                            <Card 
                                key={place.acpEsgId} 
                                style={styles.itemCard}
                                onPress={() => toggleExpand(place.acpEsgId)}
                            >
                                <List.Item
                                    title={place.name}
                                    description={expandedId === place.acpEsgId ? place.description : ''}
                                    left={() => (
                                        <List.Icon 
                                            icon="map-marker" 
                                            color="#6200ee" 
                                        />
                                    )}
                                    right={() => (
                                        <List.Icon 
                                            icon={expandedId === place.acpEsgId ? "chevron-up" : "chevron-down"} 
                                        />
                                    )}
                                    titleStyle={styles.itemTitle}
                                    descriptionStyle={styles.itemDescription}
                                />
                                {expandedId === place.acpEsgId && place.imgressources && (
                                    <Card.Cover 
                                        source={{ uri: place.imgressources[0] }} 
                                        style={styles.itemImage}
                                    />
                                )}
                            </Card>
                        ))}
                    </List.Section>
                </Card>
            </ScrollView>
        </AppView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
    },
    headerContainer: {
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    listCard: {
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 2,
    },
    itemCard: {
        margin: 8,
        borderRadius: 4,
        elevation: 1,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    itemImage: {
        height: 150,
        margin: 8,
        borderRadius: 4,
    },
});

export default ActivityPlaceList;