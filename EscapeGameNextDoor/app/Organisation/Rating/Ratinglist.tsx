import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GetRatingDto } from '@/interfaces/EscapeGameInterface/Rating/getRatingDto';
import { UnitofAction } from '../../../action/UnitofAction';

const { width } = Dimensions.get('window');

type RatingItemProps = {
  data?: GetRatingDto;
  loading?: boolean;
  onPress?: () => void;
};

// Composant Skeleton pour le loading
const SkeletonLoader = ({ width: skeletonWidth = '100%' }: { width?: string | number }) => (
  <View style={[styles.skeleton, { width: skeletonWidth }]} />
);

// Composant Pagination simple
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => (
  <View style={styles.paginationContainer}>
    <TouchableOpacity
      style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
      onPress={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <Text style={[styles.paginationText, currentPage === 1 && styles.paginationTextDisabled]}>
        Précédent
      </Text>
    </TouchableOpacity>
    
    <Text style={styles.paginationInfo}>
      {currentPage} / {totalPages}
    </Text>
    
    <TouchableOpacity
      style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
      onPress={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <Text style={[styles.paginationText, currentPage === totalPages && styles.paginationTextDisabled]}>
        Suivant
      </Text>
    </TouchableOpacity>
  </View>
);

export default function RatingList() {
  const { id } = useLocalSearchParams();
  const [rating, setRating] = React.useState<GetRatingDto[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [totalPages, setTotalPages] = React.useState<number>(10);

  const action = new UnitofAction();

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await action.ratingAction.GetAllRatingbyEscapeGameId(Number(id), page, 10);
      if (response.Success) {
        const data = response.Data as GetRatingDto[];
        setRating(data);
        // Supposons que vous avez une propriété totalPages dans la réponse
        // setTotalPages(response.TotalPages || 10);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRatings();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ratings List</Text>
      </View>

      {/* Content Card */}
      <View style={styles.card}>
        {loading ? (
          // Loading state
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : (
          <>
            {/* Ratings List */}
            <FlatList
              data={rating}
              keyExtractor={(item, index) => item?.rateId?.toString() || index.toString()}
              renderItem={({ item, index }) => (
                <RatingItem
                  data={item}
                  loading={false}
                  onPress={() => {
                    // Navigation vers les détails
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </View>
    </View>
  );
}

function RatingItem({ data, loading, onPress }: RatingItemProps) {
  const router = useRouter();

  const handlePress = () => {
    if (data && !loading) {
      router.push({
        pathname: `/Organisation/Rating/RatingDetails`,
        params: { id: data.rateId.toString() },
      });
    }
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={loading}
    >
      <View style={styles.listItemContent}>
        {/* Avatar/Icon placeholder */}
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>★</Text>
        </View>

        {/* Content */}
        <View style={styles.textContent}>
          <Text style={styles.itemTitle}>
            {loading ? <SkeletonLoader width="60%" /> : data?.rateTitle || 'Titre non disponible'}
          </Text>
          <Text style={styles.itemSubtitle}>
            {loading ? <SkeletonLoader width="80%" /> : data?.rateContent || 'Contenu non disponible'}
          </Text>
          
          {/* Rating stars or note icon */}
          <View style={styles.ratingContainer}>
            <Text style={styles.noteIcon}>📝</Text>
            {data?.rateValue && (
              <Text style={styles.ratingValue}>{data.rateValue}/5</Text>
            )}
          </View>
        </View>

        {/* Arrow indicator */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingBottom: 16,
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  ratingValue: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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
    marginHorizontal: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
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
  paginationInfo: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  skeleton: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});