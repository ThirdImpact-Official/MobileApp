import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UnitofAction } from '@/action/UnitofAction';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function TopEscapeGames() {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GetEscapeGameDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await new UnitofAction().accueilAction.GetRankedEscapegame(page, 5) as PaginationResponse<GetEscapeGameDto>;
      if (response.Success) {
        setGames(response.Data as GetEscapeGameDto[]);
        setTotalPages(response.TotalPage);
      }
    } catch (error) {
      console.error("Failed to fetch top escape games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [page]);

  if (isLoading) {
    return (
      <ThemedView>
        <ActivityIndicator size="large" />
        <ThemedText>Chargement des meilleurs escape games...</ThemedText>
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: GetEscapeGameDto }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
          params: { id: `${item.esgId}` },
        })
      }
      activeOpacity={0.8}
    >
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.esgImgResources }} style={styles.image} />
        <Card.Content>
          <Text variant="titleMedium" numberOfLines={1}>{item.esgNom}</Text>
          <Text variant="bodyMedium" numberOfLines={2}>{item.esgContent}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ThemedView>
      <ThemedText type="subtitle">Les Meilleurs Escape Games</ThemedText>
      <Carousel
        data={games}
        renderItem={renderItem}
        width={width * 0.8}
        style={{ alignSelf: 'center' }}
        loop={false}
      />
      <View style={styles.paginationContainer}>
        <Button
          mode="outlined"
          disabled={page <= 1}
          onPress={() => setPage(page - 1)}
          style={styles.paginationButton}
        >
          Précédent
        </Button>
        <Text style={styles.pageText}>{page} / {totalPages}</Text>
        <Button
          mode="outlined"
          disabled={page >= totalPages}
          onPress={() => setPage(page + 1)}
          style={styles.paginationButton}
        >
          Suivant
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    height: 140,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationButton: {
    marginHorizontal: 8,
  },
  pageText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
});
