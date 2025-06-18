import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GetEventDto } from '@/interfaces/EscapeGameInterface/Event/getEventDto';
import { ThemedText } from '@/components/ThemedText';
import { useToasted } from '@/context/ContextHook/ToastedContext';
import { UnitofAction } from '@/action/UnitofAction';
import AppView from '@/components/ui/AppView';
import { Card, Button, Divider, Text } from 'react-native-paper';
import FormUtils from "@/classes/FormUtils";
import { ChevronLeft } from 'react-native-feather';

interface EventDetailProps {
    // Add any props if needed
}

const EventDetail: React.FC<EventDetailProps> = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [event, setEvent] = useState<GetEventDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    const action = useMemo(() => new UnitofAction(), []);
    const notif = useToasted();

    const fetchEvent = useCallback(async () => {
        if (!id || isNaN(Number(id))) {
            setError('Invalid event ID');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await action.escapeGameAction.getEventById(Number(id));
            
            if (response?.Success && response.Data) {
                setEvent(response.Data as GetEventDto);
            } else {
                throw new Error(response?.Message || 'Event not found');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
           
        } finally {
            setLoading(false);
        }
    }, [id, action, notif]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            fetchEvent();
        }

        return () => {
            isMounted = false;
        };
    }, [fetchEvent]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not specified';
        try {
            return FormUtils.FormatDate(dateString);
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'Invalid date';
        }
    };

    const handleRegister = useCallback(() => {
        if (!event) return;
        // Implement registration logic here
       
    }, [event, notif]);

    const LoadingView = () => (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
            <ThemedText style={styles.loadingText}>Loading event details...</ThemedText>
        </View>
    );

    const ErrorView = () => (
        <Card style={styles.errorCard}>
            <Card.Content>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
                <Button 
                    mode="contained" 
                    onPress={fetchEvent}
                    style={styles.retryButton}
                    labelStyle={styles.buttonLabel}
                >
                    Retry
                </Button>
            </Card.Content>
        </Card>
    );

    const EventContent = () => {
        if (!event) return null;

        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card style={styles.card} elevation={3}>
                    <Card.Title
                        title={event.eventTitle || 'Event Details'}
                        titleStyle={styles.cardTitle}
                        subtitle={`ID: ${event.eventId}`}
                        subtitleStyle={styles.cardSubtitle}
                        left={(props)=>(
                        <TouchableOpacity 
                            onPress={()=>router.back()}
                        >
                            <ChevronLeft />
                        </TouchableOpacity>
                        )}
                    />
                    <Card.Content style={styles.content}>
                        <View style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>Description</ThemedText>
                            <Text style={styles.descriptionText}>
                                {event.eventDescription || 'No description available'}
                            </Text>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.detailsContainer}>
                            <DetailRow 
                                label="Start Date:" 
                                value={formatDate(event.startDate?.toString())} 
                            />
                            <DetailRow 
                                label="End Date:" 
                                value={formatDate(event.endDate?.toString())} 
                            />
                            {/* Add more details as needed */}
                        </View>
                    </Card.Content>
                    <Card.Actions style={styles.actions}>
                        <Button 
                            mode="outlined" 
                            onPress={() => router.back()}
                            style={styles.backButton}
                            labelStyle={styles.buttonLabel}
                        >
                            Back
                        </Button>
                       
                    </Card.Actions>
                </Card>
            </ScrollView>
        );
    };

    const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
        <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{label}</ThemedText>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );

    return (
        <AppView >
            {loading && !event ? (
                <LoadingView />
            ) : error ? (
                <ErrorView />
            ) : (
                <EventContent />
            )}
        </AppView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 16,
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
        borderRadius: 8,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        marginTop: 8,
        backgroundColor: '#6200ee',
    },
    card: {
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
    },
    content: {
        paddingVertical: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
    },
    divider: {
        marginVertical: 16,
        backgroundColor: '#eee',
    },
    detailsContainer: {
        marginTop: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
    },
    actions: {
        justifyContent: 'space-between',
        padding: 16,
    },
    backButton: {
        borderColor: '#6200ee',
    },
    actionButton: {
        backgroundColor: '#6200ee',
    },
    buttonLabel: {
        color: 'white',
    },
});

export default EventDetail;