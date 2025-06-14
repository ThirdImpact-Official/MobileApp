import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { UnitofAction } from '@/action/UnitofAction';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from 'react-native-paper';

const PAGE_SIZE = 5;
const PLACEHOLDER_IMAGE = require('@/assets/images/react-logo.png');

export default function LatestEscapeGames() {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GetEscapeGameDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const width = Dimensions.get('window').width;

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await new UnitofAction().accueilAction.GetlastEscapegame(page, PAGE_SIZE) as PaginationResponse<GetEscapeGameDto>;
      if (response.Success && response.Data) {
        setGames(response.Data);
        setTotalPages(response.TotalPage);
      } else {
        setError('Échec du chargement des jeux');
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const renderItem = ({ item }: { item: GetEscapeGameDto }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push({
          pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
          params: { id: `${item.esgId}` },
        })}
      >
        <Card style={styles.card}>
          <Card.Cover
            source={item.esgImgResources ? { uri: item.esgImgResources } : PLACEHOLDER_IMAGE}
            style={styles.image}
            resizeMode="cover"
          />
          <Card.Content style={styles.content}>
            <ThemedText style={styles.title} numberOfLines={2}>
              {item.esgNom}
            </ThemedText>
            <ThemedText style={styles.price}>
              {item.price ? `${item.price} €` : 'Prix non disponible'}
            </ThemedText>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && games.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Chargement en cours...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity onPress={fetchGames} style={styles.retryButton}>
          <ThemedText>Réessayer</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Les Derniers Escape Games
      </ThemedText>

      {games.length > 0 ? (
        <>
          <Carousel
            loop
            width={width * 0.85}
            height={250}
            autoPlay
            autoPlayInterval={4000}
            data={games}
            scrollAnimationDuration={800}
            renderItem={renderItem}
            style={styles.carousel}
          />

          <View style={styles.pagination}>
            <TouchableOpacity 
              onPress={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={[styles.paginationButton, page === 1 && styles.disabledButton]}
            >
              <ThemedText style={styles.paginationText}>◀</ThemedText>
            </TouchableOpacity>
            
            <ThemedText style={styles.pageText}>
              {page} / {totalPages}
            </ThemedText>
            
            <TouchableOpacity 
              onPress={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={[styles.paginationButton, page === totalPages && styles.disabledButton]}
            >
              <ThemedText style={styles.paginationText}>▶</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ThemedText style={styles.noGamesText}>Aucun jeu disponible</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  carousel: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    paddingHorizontal: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  paginationButton: {
    paddingHorizontal: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pageText: {
    fontSize: 16,
    minWidth: 60,
    textAlign: 'center',
  },
  noGamesText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
});