import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { ThemedView } from "@/components/ThemedView";
import { Button, Card, Text } from 'react-native-paper';
import { UnitofAction } from "@/action/UnitofAction";
import { create } from 'domain';

const PAGE_SIZE = 10; // Define page size constant

interface FavorisComponentProps {
    item?: GetEscapeGameDto[];
}

interface FavorisItemProps {
    item: GetEscapeGameDto;
    onRedirect: (item: GetEscapeGameDto) => void;
}

export function FavorisItem({ item, onRedirect }: FavorisItemProps) {
    return (
        <ThemedView className="space-y-2">
            <ItemDisplay
                letter={item.esgId?.toString() || ""}
                name={item.esgNom}
                header={item.esg_CreationDate}
                img={item.esgImgResources}
                onClick={() => onRedirect(item)}
            />
        </ThemedView>
    );
}

export default function FavorisComponent({ item }: FavorisComponentProps) {
    const [data, setData] = useState<GetEscapeGameDto[] | null>(item || null);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(!item); // Don't load if initial data provided
    const [error, setError] = useState<string>("");
    const [hasMore, setHasMore] = useState<boolean>(true);
    const router = useRouter();
    const action = new UnitofAction();

    const handleRedirection = useCallback((item: GetEscapeGameDto) => {
        router.push({
            pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
            params: { id: item.esgId?.toString() || '' }
        });
    }, [router]);

    const fetchFavorites = useCallback(async (pageNumber: number = page) => {
        try {
            setIsLoading(true);
            setError("");
            
            const response = await action.favorisAction.getFavoris(pageNumber);
            
            if (response.Success) {
                const newData = response.Data as GetEscapeGameDto[];
                setData(newData);
                setHasMore(newData.length === PAGE_SIZE); // Assume no more data if less than page size
            } else {
                setError(response.Message || "Erreur lors du chargement des favoris");
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setError("Une erreur est survenue lors du chargement");
        } finally {
            setIsLoading(false);
        }
    }, [page, action]);

    // Fetch data only if no initial data was provided
    useEffect(() => {
        if (!item) {
            fetchFavorites(1);
        }
    }, []);

    const handlePrevPage = useCallback(() => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            fetchFavorites(newPage);
        }
    }, [page, fetchFavorites]);

    const handleNextPage = useCallback(() => {
        const newPage = page + 1;
        setPage(newPage);
        fetchFavorites(newPage);
    }, [page, fetchFavorites]);

    const handleRetry = useCallback(() => {
        fetchFavorites(page);
    }, [fetchFavorites, page]);

    // Loading state
    if (isLoading) {
        return (
            <Card>
                <Card.Content style={{ alignItems: 'center', padding: 32 }}>
                    <ActivityIndicator size="large" />
                    <Text style={{ marginTop: 16, color: '#666' }}>
                        Chargement de vos favoris...
                    </Text>
                </Card.Content>
                <Card.Actions style={{ justifyContent: 'space-between', paddingHorizontal: 16 }}>
                    <View>
                        <View style={{flex:1}}>

                            <Button disabled>Précédent</Button>
                            <Text style={{ color: '#666' }}>Page {page}</Text>
                            <Button disabled>Suivant</Button>
                        </View>
                    </View>
                </Card.Actions>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card>
                <Card.Content style={{ alignItems: 'center', padding: 32 }}>
                    <Text style={{ color: '#d32f2f', textAlign: 'center', marginBottom: 16 }}>
                        {error}
                    </Text>
                    <Button mode="contained" onPress={handleRetry}>
                        Réessayer
                    </Button>
                </Card.Content>
                <Card.Actions style={{ justifyContent: 'space-between', paddingHorizontal: 16 }}>
                    <Button 
                        disabled={page <= 1}
                        onPress={handlePrevPage}
                    >
                        Précédent
                    </Button>
                    <Text style={{ color: '#666' }}>Page {page}</Text>
                    <Button 
                        disabled={!hasMore}
                        onPress={handleNextPage}
                    >
                        Suivant
                    </Button>
                </Card.Actions>
            </Card>
        );
    }

    // Empty state
    if (!data || data.length === 0) {
        return (
            <Card>
                <Card.Content style={{ alignItems: 'center', padding: 32 }}>
                    <Text style={{ color: '#666', textAlign: 'center', fontSize: 16 }}>
                        Vous n'avez aucun favori pour le moment
                    </Text>
                    <Text style={{ color: '#999', textAlign: 'center', marginTop: 8 }}>
                        Ajoutez des escape games à vos favoris pour les retrouver ici
                    </Text>
                </Card.Content>
                <Card.Actions style={{ justifyContent: 'space-between', paddingHorizontal: 16 }}>
                    <Button 
                        disabled={page <= 1}
                        onPress={handlePrevPage}
                    >
                        Précédent
                    </Button>
                    <Text style={{ color: '#666' }}>Page {page}</Text>
                    <Button 
                        
                        disabled={!hasMore}
                        onPress={handleNextPage}
                    >
                        Suivant
                    </Button>
                </Card.Actions>
            </Card>
        );
    }

    // Success state with data
    return (
        <Card>
            <Card.Content>
                <View>
                    {data.map((favorisItem, index) => (
                        <View 
                            key={favorisItem.esgId?.toString() || `item-${index}`} 
                            style={{ paddingBottom: 16 }}
                        >
                            <FavorisItem item={favorisItem} onRedirect={handleRedirection} />
                        </View>
                    ))}
                </View>
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'space-between', paddingHorizontal: 16 }}>
                <View style={style.paginationRow}>
                    <View style={style.responsivebutton}>
                    <Button 
                        disabled={page <= 1}
                        onPress={handlePrevPage}
                    >
                        Précédent
                    </Button>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>Page {page}</Text>
                        <Text style={{ color: '#999', fontSize: 12 }}>
                            {data.length} élément{data.length > 1 ? 's' : ''}
                        </Text>
                    </View>
                    <Button 
                        disabled={!hasMore}
                        onPress={handleNextPage}
                    >
                        Suivant
                    </Button>

                    </View>
                    </View>
            </Card.Actions>
        </Card>
    );
}

const style=StyleSheet.create({
    paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    gap: 8,
  },
  responsivebutton:{
    display: "flex",
    justifyContent:"center",
    flex:1
  }

})