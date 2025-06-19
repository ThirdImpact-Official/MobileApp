import React, { useEffect, useState } from "react";
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
import AppView from "@/components/ui/AppView";
import { Button, Card } from 'react-native-paper';
import { ThemedView } from "@/components/ThemedView";

const { width } = Dimensions.get('window');

export default function SessionGameList() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [sessionGames, setSessionGames] = useState<GetSessionGameDto[]>([]);
  const [escapeGame, setEscapeGame] = useState<GetEscapeGameDto | null>(null);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const httpaction = new UnitofAction();

  const fetchSessionGames = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await httpaction.sessionAction.getSessionEscapeGameById(
        Number(id), 
        page, 
        5
      ) as PaginationResponse<GetSessionGameDto>;
      
      if (response.Success) {
        console.log(response.Data);
        setSessionGames(response.Data as GetSessionGameDto[]);
        setTotalPages(response.TotalPage);
      } else {
        setError(response.Message || "Failed to load sessions");
        setSessionGames([]);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred";
      setError(errorMessage);
      setSessionGames([]);
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
        setError(response.Message || "Failed to load escape game details");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An error occurred";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    fetchSessionGames();
    fetchEscapeGame();
  }, [page]);

  useEffect(() => {
    // Reset to first page when filter changes
    if (page !== 1) {
      setPage(1);
    } else {
      // If already on page 1, refetch
      fetchSessionGames();
    }
  }, [filter]);

  const filteredSessions = sessionGames.filter((sg) => {
    if (filter === '1') return !sg.isReserved;
    if (filter === '2') return sg.isReserved;
    return true;
  });

  const renderSessionItem = ({ item, index }: { item: GetSessionGameDto; index: number }) => (
    <Card style={styles.sessionItem} key={item.segId}>
      <Card.Content>
        <ThemedView>
          <TouchableOpacity
            style={styles.sessionButton}
            onPress={() => router.push({
              pathname: `/Organisation/SessionGame/SessionGameDetails`,
              params: { id: item.segId.toString() }
            })}
            activeOpacity={0.7}
          >
            <View style={[
              styles.sessionBadge,
              { backgroundColor: item.isReserved ? '#9e9e9e' : '#4caf50' }
            ]}>
              <Text style={styles.sessionBadgeText}>{item.segId}</Text>
            </View>

            <View style={styles.sessionContent}>
              <Text style={styles.sessionStatus}>
                {item.isReserved ? 'Reserved' : 'Available'}
              </Text>
              <Text style={styles.sessionDate}>
                {FormUtils.FormatDate(item.gameDate.toString())}
              </Text>
              <Text style={styles.sessionTime}>
                {FormUtils.FormatDate(item.gameDate.toString())}
              </Text>
            </View>

            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        </ThemedView>
      </Card.Content>

      {index !== filteredSessions.length - 1 && <View style={styles.separator} />}
    </Card>
  );

  if (isLoading) {
    return (
      <AppView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      </AppView>
    );
  }

  if (error) {
    return (
      <AppView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={() => {
              setPage(1);
              fetchSessionGames();
              fetchEscapeGame();
            }}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      </AppView>
    );
  }

  return (
    <AppView>
     
        <Card style={styles.header}>
          <Card.Actions><Button onPress={()=> {
            setPage(1) ;
            fetchSessionGames();
          }}> Recharger </Button></Card.Actions>
          <Card.Content style={styles.filterRow}>
            <View style={styles.escapeGameName}>
              <Text style={styles.escapeGameText}>
                {escapeGame?.esgNom || 'Escape Game Sessions'}
              </Text>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filter}
                onValueChange={(itemValue) => setFilter(itemValue)}
                style={styles.picker}
                dropdownIconColor="#007AFF"
              >
                <Picker.Item label="All Sessions" value="" />
                <Picker.Item label="Available Only" value="1" />
                <Picker.Item label="Reserved Only" value="2" />
              </Picker>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.listContainer}>
          <Card style={styles.listCard}>
            {filteredSessions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {sessionGames.length === 0 
                    ? 'No sessions available' 
                    : 'No matching sessions found'}
                </Text>
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
          </Card>
        </View>

        <Card.Actions style={styles.paginationContainer}>
          <View style={styles.paginationControls}>
            <Button
              mode="outlined"
              onPress={() => setPage(page - 1)}
              disabled={page === 1}
              style={styles.paginationButton}
              labelStyle={styles.paginationButtonText}
            >
              Previous
            </Button>
            
            <Text style={styles.pageInfo}>
              Page {page} of {totalPages}
            </Text>
            
            <Button
              mode="outlined"
              onPress={() => setPage(page + 1)}
              disabled={page === totalPages}
              style={styles.paginationButton}
              labelStyle={styles.paginationButtonText}
            >
              Next
            </Button>
          </View>
        </Card.Actions>
   
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
  },
  header: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  escapeGameName: {
    flex: 1,
    marginRight: 16,
  },
  escapeGameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listCard: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  listContent: {
    paddingVertical: 8,
  },
  sessionItem: {
    marginHorizontal: 8,
    marginVertical: 4,
    elevation: 1,
  },
  sessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sessionBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionBadgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionContent: {
    flex: 1,
  },
  sessionStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sessionTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  arrowContainer: {
    padding: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#007AFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  paginationContainer: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  paginationButton: {
    borderColor: '#007AFF',
    minWidth: 100,
  },
  paginationButtonText: {
    color: '#007AFF',
  },
  pageInfo: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 16,
  },
});