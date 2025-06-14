import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Card } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UnitofAction } from '@/action/UnitofAction';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { useRouter } from 'expo-router';

const PAGE_SIZE = 5;

export default function LatestEscapeGamesNoted() {
  const [games, setGames] = useState<GetEscapeGameDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { width } = Dimensions.get('window');

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const response = await new UnitofAction().accueilAction.GetTopEscapegame(page, PAGE_SIZE) as PaginationResponse<GetEscapeGameDto>;
      if (response.Success && response.Data) {
        setGames(response.Data);
        setTotalPages(response.TotalPage);
      }
    } catch (error) {
      console.error('Failed to fetch top-rated games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [page]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />;
  }

  const cardWidth = width * 0.85;
  const cardHeight = 280;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Les Escape Games les mieux notés
      </ThemedText>

      <Carousel
        loop
        width={cardWidth}
        height={cardHeight}
        autoPlay={true}
        scrollAnimationDuration={1000}
        data={games}
        style={styles.carousel}
        renderItem={({ item }) => (
          <View style={[styles.cardContainer, { width: cardWidth }]}>
            <TouchableOpacity
              key={item.esgId}
              onPress={() =>
                router.push({
                  pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
                  params: { id: `${item.esgId}` },
                })
              }
              style={[styles.card, { width: cardWidth - 20 }]}
              activeOpacity={0.8}
            >
              <Card style={styles.cardPaper}>
                <Card.Cover
                  source={{ uri: item.esgImgResources }}
                  style={styles.image}
                  resizeMode="cover"
                />
                
                <Card.Content style={styles.cardContent}>
                  <View style={styles.textContent}>
                    <Text style={styles.gameTitle} numberOfLines={2}>
                      {item.esgNom}
                    </Text>
                   
                    <Text style={styles.description} numberOfLines={3}>
                      {item.esgContent}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </View>
        )}
      />

      <ThemedView style={styles.pagination}>
        <TouchableOpacity 
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          style={styles.paginationButton}
          disabled={page === 1}
        >
          <ThemedText style={[styles.paginateBtn, page === 1 && styles.disabledBtn]}>
            ◀
          </ThemedText>
        </TouchableOpacity>
        
        <ThemedText style={styles.pageText}>
          {page} / {totalPages}
        </ThemedText>
        
        <TouchableOpacity 
          onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
          style={styles.paginationButton}
          disabled={page === totalPages}
        >
          <ThemedText style={[styles.paginateBtn, page === totalPages && styles.disabledBtn]}>
            ▶
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  carousel: {
    alignSelf: 'center',
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardPaper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    height: '100%',
  },
  image: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 0,
    flex: 1,
  },
  textContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
    lineHeight: 22,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFA500',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'justify',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 16,
  },
  paginationButton: {
    padding: 8,
  },
  pageText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  paginateBtn: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  disabledBtn: {
    color: '#ccc',
  },
});