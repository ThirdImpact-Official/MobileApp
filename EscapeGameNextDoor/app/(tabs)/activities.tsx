import React, { useEffect, useState } from 'react';
import AppView from '@/components/ui/AppView';
import { ActivityIndicator, Button, Card, Divider, List, TextInput } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';
import { GetForumDto } from '@/interfaces/PublicationInterface/Forum/getForumDto';
import { UnitofAction } from '@/action/UnitofAction';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { ThemedText } from '@/components/ThemedText';
import { GetOrganisationDto } from '@/interfaces/OrganisationInterface/Organisation/getOrganisationDto';
import { Picker } from '@react-native-picker/picker';
import FormatUtils from '@/classes/FormUtils';
import { useRouter } from 'expo-router';

export default function ForumList() {
    // State management
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [forums, setForums] = useState<GetForumDto[]>([]);
    const [organisations, setOrganisations] = useState<GetOrganisationDto[]>([]);
    const [selectedOrganisation, setSelectedOrganisation] = useState<GetOrganisationDto | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    
    const PAGE_SIZE = 5;
    const action = new UnitofAction();
    const router = useRouter();

    // Fetch all forums with pagination
    const fetchAllForums = async (page: number = 1) => {
        setIsLoading(true);
        setError("");
        
        try {
            const response = await action.forumAction.getAllForums(page, PAGE_SIZE) as PaginationResponse<GetForumDto>;
            
            if (response.Success) {
                setForums(response.Data as GetForumDto[]);
                setTotalPages(response.TotalPage);
            } else {
                setError(response.Message);
                setForums([]);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
            setForums([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch forums by organisation
    const fetchForumsByOrganisation = async (orgId: number, page: number = 1) => {
        setIsLoading(true);
        setError("");
        
        try {
            const response = await action.forumAction.getOrganisationById(orgId, page, PAGE_SIZE) as PaginationResponse<GetForumDto>;
            if (response.Success) {
                setForums(response.Data as GetForumDto[]);
                setTotalPages(response.TotalPage || 1);
            } else {
                setForums([]);
                setError(response.Message);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
            setForums([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all organisations
    const fetchAllOrganisations = async () => {
        try {
            const response = await action.organisationAction.GetAllOrganisation(1, 20) as PaginationResponse<GetOrganisationDto>;
            if (response.Success) {
                setOrganisations(response.Data as GetOrganisationDto[]);
            } else {
                setError(response.Message);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
        }
    };

    // Fetch forums by name/search term
    const fetchForumsByName = async (searchValue: string, page: number = 1) => {
        setIsLoading(true);
        setError("");
        
        try {
            const response = await action.forumAction.getForumByName(searchValue, page, PAGE_SIZE) as PaginationResponse<GetForumDto>;
            if (response.Success) {
                if(response.Data?.length === 0) {
                    setForums([]);
                } else {
                    setForums(response.Data as GetForumDto[]);
                    setTotalPages(response.TotalPage || 1);
                }
            } else {
                setError(response.Message);
                setForums([]);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
            setForums([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle organisation selection
    const handleOrganisationChange = (value: GetOrganisationDto | undefined) => {
        setSelectedOrganisation(value);
        setCurrentPage(1);
        setSearchTerm(""); // Clear search when changing organisation
    };

    // Handle search input changes
    const handleSearchChange = async () => {
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    // Navigate to forum detail
    const handleForumPress = (forumId: number) => {
        router.push({
            pathname: '/Forum/Forum',
            params: { id: forumId },
        });
    };
   
    // Fetch data based on current filters
    useEffect(() => {
        if (searchTerm.trim().length > 0) {
            fetchForumsByName(searchTerm.trim(), currentPage);
        } else if (selectedOrganisation?.orgId) {
            fetchForumsByOrganisation(selectedOrganisation.orgId, currentPage);
        } else {
            fetchAllForums(currentPage);
        }
    }, [currentPage, selectedOrganisation]);

    // Initial data fetch
    useEffect(() => {
        fetchAllOrganisations();
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <AppView>
                <Card>
                    <Card.Title title="Chargement..." />
                    <Card.Content>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" />
                        </View>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    // Error state
    if (error) {
        return (
            <AppView>
                <Card>
                    <Card.Title title="Erreur" />
                    <Card.Content>
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <Button mode="contained" onPress={() => fetchAllForums()}>
                                Réessayer
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    // Main content
    return (
        <AppView>
            <Card>
                <Card.Title title="Liste des Forums" titleStyle={styles.title} />
                
                {/* Filters */}
                <Card.Content>
                    <View style={styles.filtersContainer}>
                        <TextInput
                            label="Rechercher un forum"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            mode="outlined"
                            style={styles.searchInput}
                            onSubmitEditing={handleSearchChange}
                        />
                        <Button onPress={handleSearchChange} mode="contained">
                            Rechercher
                        </Button>
                        <ThemedText style={styles.filterLabel}>Filtrer par organisation</ThemedText>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedOrganisation}
                                onValueChange={handleOrganisationChange}
                                style={styles.picker}
                            >
                                <Picker.Item label="Toutes les organisations" value={undefined} />
                                {organisations.map((org) => (
                                    <Picker.Item 
                                        key={org.orgId} 
                                        label={org.name} 
                                        value={org} 
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </Card.Content>

                {/* Forum List */}
                <Card.Content>
                    <View style={styles.listContainer}>
                        {forums.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <ThemedText>Aucun forum trouvé</ThemedText>
                            </View>
                        ) : (
                            <List.Section>
                                {forums.map((forum, index) => (
                                    <React.Fragment key={forum.id || index}>
                                        <List.Item
                                            title={forum.title}
                                            titleStyle={styles.forumTitle}
                                            onPress={() => handleForumPress(forum.id)}
                                            right={() => (
                                                <ThemedText style={styles.dateText}>
                                                    {FormatUtils.FormatDate(forum.creationDate)}
                                                </ThemedText>
                                            )}
                                            style={styles.forumItem}
                                        />
                                        {index < forums.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List.Section>
                        )}
                    </View>
                </Card.Content>

                {/* Pagination */}
                {totalPages >= 1 && (
                    <Card.Actions>
                        <View style={styles.paginationContainer}>
                            <View style={{flex:1}}>
                                <Button
                                    mode="outlined"
                                    onPress={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    style={styles.paginationButton}
                                >
                                 <Text>
                                      Précédent
                                    </Text> 
                                </Button>
                                
                                <ThemedText style={styles.pageInfo}>
                                    Page {currentPage} sur {totalPages}
                                </ThemedText>
                                
                                <Button
                                    mode="outlined"
                                    onPress={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    style={styles.paginationButton}
                                >
                                  <Text>
                                      Suivant
                                    </Text>
                                </Button>

                            </View>
                        </View>
                    </Card.Actions>
                )}
            </Card>
        </AppView>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    errorContainer: {
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 16,
    },
    filtersContainer: {
        marginBottom: 16,
    },
    searchInput: {
        marginBottom: 16,
    },
    filterLabel: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#f9f9f9',
    },
    picker: {
        height: 50,
    },
    listContainer: {
        minHeight: 200,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    forumItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    forumTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 12,
        color: '#666',
        alignSelf: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
    },
    paginationButton: {
        minWidth: 100,
    },
    pageInfo: {
        textAlign:"center",
        fontSize: 14,
        fontWeight: '500',
    },
});