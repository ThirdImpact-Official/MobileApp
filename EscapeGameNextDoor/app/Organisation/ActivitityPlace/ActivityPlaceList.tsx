import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { GetActivityPlaceDto } from '../../../interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AppView from '@/components/ui/AppView';
import { Card, List, ActivityIndicator, Button } from 'react-native-paper';
import { testActivityPlaces } from '@/TestData/ActivityPlacetestData';
import { UnitofAction } from '@/action/UnitofAction';
import { GetAddressDto } from '@/interfaces/OrganisationInterface/Adress/getAdressDto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PaginationResponse, ServiceResponse } from '@/interfaces/ServiceResponse';
import { Collapsible } from '@/components/Collapsible';
import MapContainer from "@/components/Maps/MapContainer";
import { View } from 'react-native';
const PAGE_SIZE = 5;

const ActivityPlaceList = () => {
    const [activityPlaces, setActivityPlaces] = React.useState<GetActivityPlaceDto[]>([]);
    const [expandedId, setExpandedId] = React.useState<number | null>(null);
    const [isError, setIsError] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [page, setPage] = React.useState<number>(1);
    const [totalPages, setTotalPages] = React.useState<number>(1);
    
    const action = new UnitofAction();
    const params = useLocalSearchParams();
    const router = useRouter();

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const fetchActivityPlaces = async () => {
        try {
            setIsLoading(true);
            setIsError(false);
            
            const response = await action.escapeGameAction.getActivityPlacesByEscapeGame(
                Number(params.id), 
                page, 
                PAGE_SIZE
            ) as PaginationResponse<GetActivityPlaceDto>;
            
            if (!response.Success) {
                throw new Error(response.Message || 'Failed to fetch activity places');
            }
            
            setActivityPlaces(response.Data as GetActivityPlaceDto[] || []);
            setTotalPages(response.TotalPage || 1);
            setError(null);
        } catch (e) {
            console.error('Error fetching activity places:', e);
            setIsError(true);
            setError(e instanceof Error ? e.message : 'Failed to fetch activity places');
            // Use test data as fallback
            setActivityPlaces(testActivityPlaces);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        fetchActivityPlaces();
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    React.useEffect(() => {
        if (params.id) {
            fetchActivityPlaces();
        }
    }, [page, params.id]);

    if (isLoading) {
        return (
            <AppView>
                <ThemedView style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                    <ThemedText style={styles.loadingText}>Loading activity places...</ThemedText>
                </ThemedView>
            </AppView>
        );
    }

    if (isError && activityPlaces.length === 0) {
        return (
            <AppView>
                <ThemedView style={styles.errorContainer}>
                    <ThemedText style={styles.errorText}>
                        {error || 'Something went wrong'}
                    </ThemedText>
                    <Button mode="contained" onPress={handleRetry} style={styles.retryButton}>
                        Retry
                    </Button>
                </ThemedView>
            </AppView>
        );
    }

    return (
        <AppView>
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedView style={styles.headerContainer}>
                    <ThemedText type="title" style={styles.title}>
                        Activity Places
                    </ThemedText>
                    {isError && (
                        <ThemedText style={styles.warningText}>
                            Using cached data - {error}
                        </ThemedText>
                    )}
                </ThemedView>

             
                    <List.Section>
                        {activityPlaces.map((place) => (
                            <ActivityPlaceItem 
                                key={place.acpEsgId} 
                                item={place}
                                isExpanded={expandedId === place.acpEsgId}
                                onToggleExpand={() => toggleExpand(place.acpEsgId)}
                            />
                        ))}
                    </List.Section>
               

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <ThemedView style={styles.paginationContainer}>
                        <Button 
                            mode="outlined" 
                            onPress={handlePrevPage}
                            disabled={page === 1}
                            style={styles.paginationButton}
                        >
                            Previous
                        </Button>
                        <ThemedText style={styles.pageText}>
                            Page {page} of {totalPages}
                        </ThemedText>
                        <Button 
                            mode="outlined" 
                            onPress={handleNextPage}
                            disabled={page === totalPages}
                            style={styles.paginationButton}
                        >
                            Next
                        </Button>
                    </ThemedView>
                )}
            </ScrollView>
        </AppView>
    );
};

interface ActivityPlaceItemProps {
    item: GetActivityPlaceDto;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const ActivityPlaceItem: React.FC<ActivityPlaceItemProps> = ({ 
    item, 
    isExpanded, 
    onToggleExpand 
}) => {
    const [address, setAddress] = React.useState<GetAddressDto | null>(null);
    const [addressError, setAddressError] = React.useState<string | null>(null);
    const [addressLoading, setAddressLoading] = React.useState<boolean>(false);
    const [ilaoding, setlaoding] = React.useState<boolean>(false);
    const action = new UnitofAction();
    const router = useRouter();
    const fetchAddress = async () => {
        if (!isExpanded || address || addressLoading) return;
        
        try {
            setAddressLoading
            setAddressLoading(true);
            console.log(item.acpEsgId);
            const response = await action.addressAction.AddressByActivityId(
                item.acpId
            ) as ServiceResponse<GetAddressDto>;
            
            if (!response.Success) {
                throw new Error(response.Message || 'Failed to fetch address');
            }
            
            setAddress(response.Data as GetAddressDto);
            setAddressError(null);
        } catch (e) {
            console.error('Error fetching address:', e);
            setAddressError(e instanceof Error ? e.message : 'Failed to fetch address');
        } finally {
            setAddressLoading(false);
        }
    };

    React.useEffect(() => {
        if (isExpanded) {
            fetchAddress();
        }
    }, [isExpanded]);
    if(addressLoading)
    {
        <ActivityIndicator size="large" />
    }
    return (
        <Card 
            style={styles.itemCard}
            onPress={onToggleExpand}
        >
            <Card.Title title={item.name} />
            <Card.Cover 
                source={{ uri: item.imgressources[0] } } 
                style={styles.itemImage}
            />
            <List.Item
                title={item.name}
                description={isExpanded ? item.description : ''}
                left={() => (
                    <List.Icon 
                        icon="map-marker" 
                        color="#6200ee" 
                    />
                )}
              
                titleStyle={styles.itemTitle}
                descriptionStyle={styles.itemDescription}
            />
            <Card.Content>
                 
                    {addressLoading && (
                        <View style={styles.addressLoadingContainer}>
                            <ActivityIndicator size="small" />
                            <ThemedText>Loading address...</ThemedText>
                        </View>
                    )}
                   

            </Card.Content>
                <Card.Content style={styles.expandedContent}>
                   
                    
                   {addressLoading ? (
    <View style={styles.addressLoadingContainer}>
        <ActivityIndicator size="small" />
        <ThemedText>Loading address...</ThemedText>
    </View>
) : address ? (
    <>
       
            <MapContainer
                latitude={address.latitude}
                longitude={address.longitude}
                markerTitle={address.street}
                markerDescription={address.city}
                zoom={13}
                scrollWheelZoom={false}
                style={styles.mapContainer}
            />
      
        <View style={styles.addressContainer}>
            <ThemedText style={styles.addressTitle}>Address:</ThemedText>
            <ThemedText>{address.street}</ThemedText>
            <ThemedText>{address.city}, {address.postalCode}</ThemedText>
        </View>
    </>
) : addressError ? (
    <ThemedText style={styles.addressError}>
        Address: {addressError}
    </ThemedText>
) : null}    
                    {addressError && (
                        <ThemedText style={styles.addressError}>
                            Address: {addressError}
                        </ThemedText>
                    )}
                    
          
                </Card.Content>
        <Card.Actions>
            <Button onPress={() => {
                router.push({
                    pathname: '/Organisation/ActivitityPlace/ActivityPlaceDetail',
                    params: { id: item.acpId.toString() },
                })
            }}>Details</Button>
        </Card.Actions>
        </Card>
    );
};
export default ActivityPlaceList;

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
    warningText: {
        color: '#ff9800',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#f44336',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        marginTop: 10,
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
    expandedContent: {
        paddingTop: 0,
    },
    itemImage: {
        height: 150,
        marginBottom: 12,
        borderRadius: 4,
    },
    mapContainer: {
        width: '100%',
        height: 200,
        borderRadius: 4,
    },
    addressLoadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    addressError: {
        color: '#f44336',
        fontSize: 12,
        marginTop: 8,
    },
    addressContainer: {
        marginTop: 12,
        padding: 8,
        borderRadius: 4,
    },
    addressTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    paginationButton: {
        minWidth: 80,
    },
    pageText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});