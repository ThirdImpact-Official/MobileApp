import React from "react";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import FormUtils from '@/classes/FormUtils';
import { UnitofAction } from "@/action/UnitofAction";
import { PaginationResponse } from "@/interfaces/ServiceResponse";

const { width } = Dimensions.get('window');

export default function SessionGameList() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [sessionGames, setSessionGames] = useState<GetSessionGameDto[]>([]);
  const [escapeGame, setEscapeGame] = useState<GetEscapeGameDto | null>(null);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const httpaction = new UnitofAction();

  const fetchSessionGames = async () => {
    setIsLoading(true);
    try {
      const response = await httpaction.sessionAction.getSessionEscapeGameById(Number(id), page, 5) as PaginationResponse<GetSessionGameDto>;
      if (response.Success) {
        setSessionGames(response.Data as GetSessionGameDto[]);
        setTotalPages(response.TotalPage);
      } else {
        setSessionGames([]);
        setTotalPages(1);
        console.log(response.Message);
      }
    } catch (e) {
      setSessionGames([]);
      setTotalPages(1);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEscapeGame = async () => {
    try {
      const response = await httpaction.escapeGameAction.getEscapeGameById(Number(id));
      if (response.Success) {
        setEscapeGame(response.Data as GetEscapeGameDto);
      } else {
        console.log(response.Message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchSessionGames();
    fetchEscapeGame();
  }, [page]);

  const filteredSessions = sessionGames.filter((sg) => {
    if (filter === '1') return !sg.isReserved;
    if (filter === '2') return sg.isReserved;
    return true;
  });

  const renderSessionItem = ({ item, index }: { item: GetSessionGameDto; index: number }) => (
    <View style={styles.sessionItem}>
      <TouchableOpacity
        style={styles.sessionButton}
        onPress={() => router.push({
          pathname: `/Organisation/SessionGame/SessionGameDetails`,
          params: { id: item.segId.toString() }
        })}
        activeOpacity={0.7}
      >
        {/* Session ID Badge */}
        <View style={[
          styles.sessionBadge,
          { backgroundColor: item.isReserved ? '#9e9e9e' : '#4caf50' }
        ]}>
          <Text style={styles.sessionBadgeText}>{item.segId}</Text>
        </View>

        {/* Session Content */}
        <View style={styles.sessionContent}>
          <Text style={styles.sessionStatus}>
            {item.isReserved ? 'Reserved' : 'Available'}
          </Text>
          <Text style={styles.sessionDate}>
            {FormUtils.FormatDate(item.gameDate.toString())}
          </Text>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>

      {/* Separator */}
      {index !== filteredSessions.length - 1 && <View style={styles.separator} />}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Filter */}
      <View style={styles.header}>
        <Text style={styles.filterLabel}>Filtre</Text>
        <View style={styles.filterRow}>
          <View style={styles.escapeGameName}>
            <Text style={styles.escapeGameText}>{escapeGame?.esgNom}</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filter}
              onValueChange={(itemValue) => setFilter(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="All" value="" />
              <Picker.Item label="Available" value="1" />
              <Picker.Item label="Reserved" value="2" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Sessions List */}
      <View style={styles.listContainer}>
        <View style={styles.card}>
          {filteredSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucune session trouvée</Text>
            </View>
          ) : (
            <FlatList
              data={filteredSessions}
              renderItem={renderSessionItem}
              keyExtractor={(item) => item.segId.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, page === 1 && styles.paginationButtonDisabled]}
            onPress={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <Text style={[styles.paginationText, page === 1 && styles.paginationTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>Page {page}</Text>

          <TouchableOpacity
            style={[styles.paginationButton, page === totalPages && styles.paginationButtonDisabled]}
            onPress={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <Text style={[styles.paginationText, page === totalPages && styles.paginationTextDisabled]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  escapeGameName: {
    flex: 1,
    marginRight: 16,
  },
  escapeGameText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    minWidth: 120,
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: Math.min(350, width - 32),
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    paddingVertical: 8,
  },
  sessionItem: {
    paddingHorizontal: 16,
  },
  sessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sessionBadge: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionBadgeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sessionContent: {
    flex: 1,
  },
  sessionStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
  },
  arrowContainer: {
    padding: 8,
  },
  arrow: {
    fontSize: 20,
    color: '#ccc',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    width: Math.min(350, width - 32),
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  paginationTextDisabled: {
    color: '#999',
  },
  pageInfo: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});