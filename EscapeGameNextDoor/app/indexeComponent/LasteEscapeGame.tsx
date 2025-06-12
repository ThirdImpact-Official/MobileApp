import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { UnitofAction } from '@/action/UnitofAction';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const PAGE_SIZE = 5;

export default function LatestEscapeGames() {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GetEscapeGameDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  const width = Dimensions.get('window').width;

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const response = await new UnitofAction().accueilAction.GetlastEscapegame(page, PAGE_SIZE) as PaginationResponse<GetEscapeGameDto>;
      if (response.Success && response.Data) {
        setGames(response.Data);
        setTotalPages(response.TotalPage);
      }
    } catch (error) {
      console.error('Failed to fetch latest games:', error);
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

  return (
    <ThemedView style={{ padding: 16 }}>
      <ThemedText type="subtitle">Les Derniers Escape Games</ThemedText>

      <Carousel
        loop
        width={width * 0.85}
        height={200}
        autoPlay={true}
        data={games}
        scrollAnimationDuration={1000}
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
            <Image
              source={{ uri: item.esgImgResources }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.title}>{item.esgNom}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Pagination custom simple */}
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
    alignItems: 'center',
    paddingBottom: 8,
  },
  image: {
    width: '100%',
    height: 130,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  pageText: {
    fontSize: 16,
  },
  paginateBtn: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
});
