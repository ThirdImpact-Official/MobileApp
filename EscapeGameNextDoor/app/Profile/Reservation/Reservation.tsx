import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Card, Text, Avatar, Button, ActivityIndicator } from "react-native-paper";
import { GetSessionReservedDto } from '@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto';
import FormUtils from "@/classes/FormUtils";
import { UnitofAction } from "@/action/UnitofAction";

const PAGE_SIZE = 5;

interface ReservationItemProps {
  reservation: GetSessionReservedDto;
}

export default function ReservationListe() {
  const [session, setSession] = useState<GetSessionReservedDto[] | null>([]);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const action = new UnitofAction();

  const fetchUserSessionReserved = async (pageNumber: number = page) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await action.sessionAction.getSessionReservedByUser(pageNumber, PAGE_SIZE);

      if (response.Success) {
        const data = response.Data as GetSessionReservedDto[];
        setSession(data);
        setHasMore(data.length === PAGE_SIZE); // Assume no more data if less than page size
      } else {
        setError(response.Message);
      }
    } catch (err) {
      console.log(err);
      setError("Une erreur est survenue lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSessionReserved(1);
  }, []);

  const handlePageChange = (direction: 'next' | 'prev') => {
    const newPage = direction === 'next' ? page + 1 : page - 1;
    if (newPage >= 1) {
      setPage(newPage);
      fetchUserSessionReserved(newPage);
    }
  };

  if (isLoading) {
    return (
      <React.Fragment>
        <Card>
          <Card.Content style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Chargement...</Text>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button disabled>Précédent</Button>
            <Button disabled>Suivant</Button>
          </Card.Actions>
        </Card>
      </React.Fragment>
    );
  }

  if (error) {
    return (
      <React.Fragment>
        <Card>
          <Card.Content style={styles.centerContent}>
            <Text style={styles.errorText}>{error}</Text>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button
              disabled={page <= 1}
              onPress={() => handlePageChange('prev')}
            >
              Précédent
            </Button>
            <Button
              onPress={() => fetchUserSessionReserved()}
            >
              Réessayer
            </Button>
            <Button
              disabled={!hasMore}
              onPress={() => handlePageChange('next')}
            >
              Suivant
            </Button>
          </Card.Actions>
        </Card>
      </React.Fragment>
    );
  }

  if (session?.length === 0) {
    return (
      <React.Fragment>
        <Card>
          <Card.Content style={styles.centerContent}>
            <Text style={styles.emptyText}>Vous n'avez aucune réservation</Text>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button
              disabled={page <= 1}
              onPress={() => handlePageChange('prev')}
            >
              Précédent
            </Button>
            <Button
              disabled={!hasMore}
              onPress={() => handlePageChange('next')}
            >
              Suivant
            </Button>
          </Card.Actions>
        </Card>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Card>
        {session?.map((item) => (
          <ReservationItem key={item.id} reservation={item} />
        ))}
        <Card.Actions style={styles.actions}>
          <View style={styles.paginationRow}>
            <View style={{ flex: 1 }}>
              <Button
                disabled={page <= 1}
                onPress={() => handlePageChange('prev')}
              >
                Précédent
              </Button>
              <Text style={styles.pageText}>Page {page}</Text>
              <Button
                disabled={!hasMore}
                onPress={() => handlePageChange('next')}
              >
                Suivant
              </Button>

            </View>
          </View>
        </Card.Actions>
      </Card>
    </React.Fragment>
  );
}

export function ReservationItem({ reservation }: ReservationItemProps) {
  const router = useRouter();

  const handleRedirection = () => {
    router.push({
      pathname: "/Profile/Reservation/ReservationDetails",
      params: {
        id: reservation.id.toString(),
        sessionId: reservation.sessionGame?.segId.toString() || '',
        content: reservation.content || ''
      },
    });
  };

  // Safely format the date
  const formatDate = () => {
    try {
      if (reservation.sessionGame?.gameDate) {
        return FormUtils.FormatDate(
          reservation.sessionGame.gameDate instanceof Date
            ? reservation.sessionGame.gameDate.toString()
            : String(reservation.sessionGame.gameDate)
        );
      }
      return 'Date non disponible';
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Date invalide';
    }
  };

  return (
    <Card onPress={handleRedirection} style={styles.card}>
      <Card.Content style={styles.itemContainer}>
        <Avatar.Text
          size={40}
          label={reservation.id.toString().charAt(0)}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text variant="titleMedium" style={styles.dateText}>
            {formatDate()}
          </Text>
          <Text variant="bodyMedium" style={styles.nameText} numberOfLines={1}>
            {reservation.content || 'Aucune description'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#6200ee',
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontWeight: 'bold',
    color: '#333',
  },
  nameText: {
    color: '#666',
    marginTop: 4,
  },
  centerContent: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  pageText: {
    alignSelf: 'center',
    color: '#666',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    gap: 8,
  },
});