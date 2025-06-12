import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
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
  const width = Dimensions.get('window').width;

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

  return (
    <ThemedView style={{ padding: 16 }}>
      <ThemedText type="subtitle">Les Meilleurs Escape Games</ThemedText>

      <Carousel
        loop
        width={width * 0.85}
        height={240}
        autoPlay={true}
        scrollAnimationDuration={1000}
        data={games}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.esgId}
            onPress={() =>
              router.push({
                pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
                params: { id: `${item.esgId}` },
              })
            }
            style={styles.card}
          >
            <Image source={{ uri: item.esgImgResources }} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.title}>{item.esgNom}</Text>
              <Text style={styles.description} numberOfLines={3}>{item.esgContent}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.pagination}>
        <TouchableOpacity onPress={() => setPage((p) => Math.max(1, p - 1))}>
          <Text style={styles.paginateBtn}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>{page} / {totalPages}</Text>
        <TouchableOpacity onPress={() => setPage((p) => Math.min(totalPages, p + 1))}>
          <Text style={styles.paginateBtn}>▶</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#555',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  pageText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  paginateBtn: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
});
