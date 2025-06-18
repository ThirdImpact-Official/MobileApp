import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityIndicator, Text, StyleSheet, Dimensions, FlatList, View, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useToasted } from "@/context/ContextHook/ToastedContext";
import AppView from '@/components/ui/AppView';
import { ThemedText } from '@/components/ThemedText';
import { UnitofAction } from '@/action/UnitofAction';
import { GetEventDto } from '@/interfaces/EscapeGameInterface/Event/getEventDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { Card, Button } from 'react-native-paper';
import FormUtils from "@/classes/FormUtils";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_SIZE = 10;

interface EventListState {
    events: GetEventDto[];
    isLoading: boolean;
    isLoadingMore: boolean;
    isRefreshing: boolean;
    error: string | null;
    hasMore: boolean;
    totalCount: number;
}

const LoadingView = () => (
    <AppView >
        <ActivityIndicator size="large" color="#6200ee" />
        <ThemedText style={styles.loadingText}>Chargement des événements...</ThemedText>
    </AppView>
);

const ErrorView = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <AppView>
        <Card style={styles.errorCard}>
            <Card.Content>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
                <Button 
                    mode="contained" 
                    onPress={onRetry} 
                    style={styles.retryButton}
                    labelStyle={styles.retryButtonText}
                >
                    Réessayer
                </Button>
            </Card.Content>
        </Card>
    </AppView>
);

const EventCard = ({ event, onPress }: { event: GetEventDto; onPress: () => void }) => {
    const formatDate = (date: Date) => {
        return FormUtils.FormatDate(date.toString());
    };

    return (
        <Card 
            style={styles.eventCard}
            onPress={onPress}
        >
            <Card.Title 
                title={event.eventTitle || `Événement #${event.eventId}`}
                titleStyle={styles.cardTitle}
                subtitle={`ID: ${event.eventId}`}
                subtitleStyle={styles.cardSubtitle}
            />
            <Card.Content>
                {event.eventDescription && (
                    <Text style={styles.eventDescription} numberOfLines={2}>
                        {event.eventDescription}
                    </Text>
                )}
                
                <View style={styles.eventDetailsRow}>
                    {event.startDate && (
                        <View style={styles.eventDetailItem}>
                            <Text style={styles.eventDetailLabel}>Début:</Text>
                            <Text style={styles.eventDetailValue}>
                                {formatDate(event.startDate)}
                            </Text>
                        </View>
                    )}
                    
                    {event.endDate && (
                        <View style={styles.eventDetailItem}>
                            <Text style={styles.eventDetailLabel}>Fin:</Text>
                            <Text style={styles.eventDetailValue}>
                                {formatDate(event.endDate)}
                            </Text>
                        </View>
                    )}
                </View>
            </Card.Content>
        </Card>
    );
};

const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
    <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateIcon}>📅</Text>
        <ThemedText style={styles.emptyStateTitle}>Aucun événement trouvé</ThemedText>
        <ThemedText style={styles.emptyStateSubtitle}>
            Aucun événement n'est disponible pour le moment.
        </ThemedText>
        <Button 
            mode="contained" 
            onPress={onRefresh}
            style={styles.refreshButton}
        >
            Actualiser
        </Button>
    </View>
);

export default function EventList() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const notif = useToasted();
    
    const [page, setPage] = useState(1);
    const [state, setState] = useState<EventListState>({
        events: [],
        isLoading: true,
        isLoadingMore: false,
        isRefreshing: false,
        error: null,
        hasMore: true,
        totalCount: 0,
    });

    const action = useMemo(() => new UnitofAction(), []);

    const fetchEvents = useCallback(async (
        pageNumber = 1, 
        isRefresh = false,
        isLoadMore = false
    ) => {
        try {
            setState(prev => ({
                ...prev,
                isLoading: !isLoadMore && !isRefresh,
                isLoadingMore: isLoadMore,
                isRefreshing: isRefresh,
                error: null,
            }));
            
            const response = await action.escapeGameAction.getEventsByEscapeGameId(
                Number(id), 
                pageNumber, 
                PAGE_SIZE
            ) as PaginationResponse<GetEventDto>;
            
            if (response.Success) {
                const eventData = response.Data || [];
                setState(prev => ({
                    ...prev,
                    events: isRefresh || pageNumber === 1 
                        ? eventData 
                        : [...prev.events, ...eventData],
                    hasMore: eventData.length === PAGE_SIZE,
                    totalCount: response.TotalPage || 0,
                    isLoading: false,
                    isLoadingMore: false,
                    isRefreshing: false,
                }));
            } else {
                throw new Error(response.Message || 'Erreur lors du chargement des événements');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
            
            setState(prev => ({
                ...prev,
                isLoading: false,
                isLoadingMore: false,
                isRefreshing: false,
                error: errorMessage,
            }));
            
            
        }
    }, [id, action, notif]);

    const loadMore = useCallback(() => {
        if (!state.isLoadingMore && state.hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchEvents(nextPage, false, true);
        }
    }, [state.isLoadingMore, state.hasMore, page, fetchEvents]);

    const refresh = useCallback(() => {
        setPage(1);
        fetchEvents(1, true, false);
    }, [fetchEvents]);

    const retry = useCallback(() => {
        setPage(1);
        fetchEvents(1, false, false);
    }, [fetchEvents]);

    useEffect(() => {
        if (id) {
            fetchEvents();
        }
    }, [id]);

    const navigateToEventDetail = useCallback((eventId: number) => {
        router.push({
            pathname: '/Organisation/Event/EventDetail',
            params: { id: eventId }
        });
    }, [router]);

    const renderEventCard = useCallback(({ item }: { item: GetEventDto }) => (
        <View style={styles.eventCardContainer}>
            <EventCard 
                event={item}
                onPress={() => navigateToEventDetail(item.eventId)}
            />
        </View>
    ), [navigateToEventDetail]);

    const renderFooter = useCallback(() => {
        if (state.isLoadingMore) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator size="small" color="#6200ee" />
                    <ThemedText style={styles.loadingMoreText}>
                        Chargement des événements...
                    </ThemedText>
                </View>
            );
        }
        
        if (!state.isLoading && state.events.length > 0 && !state.hasMore) {
            return (
                <View style={styles.footer}>
                    <ThemedText style={styles.endText}>
                        Vous avez vu tous les événements
                    </ThemedText>
                </View>
            );
        }
        
        return null;
    }, [state.isLoadingMore, state.events.length, state.hasMore, state.isLoading]);

    const renderEmptyComponent = useCallback(() => {
        if (state.isLoading) return null;
        return <EmptyState onRefresh={refresh} />;
    }, [state.isLoading, refresh]);

    if (state.isLoading && !state.isRefreshing && state.events.length === 0) {
        return <LoadingView />;
    }

    if (state.error && state.events.length === 0) {
        return <ErrorView error={state.error} onRetry={retry} />;
    }

    return (
        <AppView >
            <FlatList
                data={state.events}
                renderItem={renderEventCard}
                keyExtractor={item => `event-${item.eventId}`}
                contentContainerStyle={styles.listContent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={state.isRefreshing}
                        onRefresh={refresh}
                        colors={['#6200ee']}
                        tintColor="#6200ee"
                    />
                }
                ListEmptyComponent={renderEmptyComponent}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={10}
            />
        </AppView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        paddingVertical: 8,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorCard: {
        margin: 16,
        width: SCREEN_WIDTH - 32,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        marginTop: 8,
    },
    retryButtonText: {
        color: 'white',
    },
    eventCardContainer: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    eventCard: {
        elevation: 2,
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    eventDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
        lineHeight: 20,
    },
    eventDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    eventDetailItem: {
        flex: 1,
    },
    eventDetailLabel: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },
    eventDetailValue: {
        fontSize: 13,
        color: '#333',
        marginTop: 2,
    },
    footer: {
        padding: 16,
        alignItems: 'center',
    },
    loadingMoreText: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
    endText: {
        fontSize: 14,
        color: '#888',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyStateIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    refreshButton: {
        width: 150,
    },
});