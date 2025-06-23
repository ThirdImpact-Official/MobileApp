import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Card, S } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UnitofAction } from '@/action/UnitofAction';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { useRouter } from 'expo-router';

const PAGE_SIZE = 5;

export default function RecommandedEscapeGames() {
  const [games, setGames] = useState<GetEscapeGameDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { width, height } = Dimensions.get('window');

  const fetchRecommandedGames = async () => {
    setIsLoading(true);
    try {
      const response = await new UnitofAction().accueilAction.GetRankedEscapegame(page, PAGE_SIZE) as PaginationResponse<GetEscapeGameDto>;
      if (response.Success && response.Data) {
        setGames(response.Data);
        setTotalPages(response.TotalPage);
      }
    } catch (error) {
      console.error('Failed to fetch recommended games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommandedGames();
  }, [page]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />;
  }

  const cardWidth = width * 0.85;
  const cardHeight = 280;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Les coups de coeur des Administrateurs
      </ThemedText>
      <View style={styles.separator}>

      <ThemedText >
          <Text >
           "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          </Text>
      </ThemedText>
      </View>
      <Carousel
        loop
        width={cardWidth}
        height={cardHeight}
        autoPlay={true}
        scrollAnimationDuration={1000}
        data={games}
        style={styles.carousel}
        renderItem={({ item, index }) => (
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
              <Card style={styles.card}>
                <Card.Cover
                  source={{ uri: item.esgImgResources }}
                  style={styles.image}
                  resizeMode="cover"
                />
                 <Card.Title title={item.esgTitle} titleStyle={styles.gameTitle} />
                <Card.Content style={styles.cardContainer}>
                  <View style={styles.container}>
                    <Text style={styles.gameText} numberOfLines={3}>
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
          <ThemedText style={[styles.paginationButton, page === 1 && styles.disabledButton]}>
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
          <ThemedText style={[styles.paginationButton, page === totalPages && styles.disabledButton]}>
            ▶
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
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
    paddingVertical: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding:4,
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
  resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 0,
    
  },
  gameText:{
    fontSize: 14,
     textAlign: 'center',
    lineHeight: 20,
  },
  gameTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
   fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'justify',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  separator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    marginBottom:10
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