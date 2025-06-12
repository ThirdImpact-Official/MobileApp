import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";

// Utilitaire pour formater les dates (remplace FormUtils.FormatDate)
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

interface GenerationTableProps<T> {
  data: T[];
  columns: { label: string; accessor: keyof T }[];
  OnDetails?: (item: T) => void;
  OnUpdate?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  containerStyle?: object;
  headerStyle?: object;
  rowStyle?: object;
  cellStyle?: object;
  actionButtonStyle?: object;
  detailsButtonStyle?: object;
  updateButtonStyle?: object;
  maxHeight?: number;
}

const GenericTable = <T,>({
  data,
  columns,
  OnDetails,
  OnUpdate,
  loading = false,
  emptyMessage = "Aucun résultat trouvé.",
  containerStyle,
  headerStyle,
  rowStyle,
  cellStyle,
  actionButtonStyle,
  detailsButtonStyle,
  updateButtonStyle,
  maxHeight = 400,
}: GenerationTableProps<T>) => {
  // Skeleton loader
  const renderSkeleton = () => (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.skeletonContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.skeletonText}>Chargement...</Text>
      </View>
    </View>
  );

  // Empty state
  const renderEmptyState = () => (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    </View>
  );

  // Header
  const renderHeader = () => (
    <View style={[styles.headerRow, headerStyle]}>
      {columns.map((col) => (
        <View key={String(col.accessor)} style={styles.headerCell}>
          <Text style={styles.headerText}>{col.label}</Text>
        </View>
      ))}
      {(OnDetails || OnUpdate) && (
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>Actions</Text>
        </View>
      )}
    </View>
  );

  // Row item
  const renderItem = ({ item, index }: { item: T; index: number }) => (
    <View style={[
      styles.row, 
      rowStyle,
      index % 2 === 0 ? styles.evenRow : styles.oddRow
    ]}>
      {columns.map((col) => {
        const value = item[col.accessor];
        const isDate =
          value instanceof Date ||
          (typeof value === "string" && !isNaN(Date.parse(value)));

        return (
          <View key={String(col.accessor)} style={[styles.cell, cellStyle]}>
            <Text style={styles.cellText} numberOfLines={2}>
              {isDate
                ? formatDate(value?.toString() ?? "")
                : value != null
                ? String(value)
                : ""}
            </Text>
          </View>
        );
      })}
      
      {(OnDetails || OnUpdate) && (
        <View style={[styles.cell, styles.actionsCell]}>
          <View style={styles.actionsContainer}>
            {OnDetails && (
              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  styles.detailsButton,
                  actionButtonStyle,
                  detailsButtonStyle
                ]}
                onPress={() => OnDetails(item)}
                accessibilityLabel="Voir les détails"
                accessibilityRole="button"
              >
                <Text style={[styles.actionButtonText, styles.detailsButtonText]}>
                  Détails
                </Text>
              </TouchableOpacity>
            )}
            
            {OnUpdate && (
              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  styles.updateButton,
                  actionButtonStyle,
                  updateButtonStyle
                ]}
                onPress={() => OnUpdate(item)}
                accessibilityLabel="Modifier"
                accessibilityRole="button"
              >
                <Text style={[styles.actionButtonText, styles.updateButtonText]}>
                  Modifier
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );

  // Main render
  if (loading) {
    return renderSkeleton();
  }

  if (!data || data.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        <View style={{ minWidth: '100%' }}>
          {renderHeader()}
          
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={{ maxHeight }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    overflow: 'hidden',
  },
  
  // Skeleton
  skeletonContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  skeletonText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  
  // Empty state
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  
  // Scroll
  horizontalScroll: {
    flex: 1,
  },
  
  // Header
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#dee2e6',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    minWidth: 80,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  
  // Rows
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 50,
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f8f9fa',
  },
  
  // Cells
  cell: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    minWidth: 80,
  },
  cellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // Actions
  actionsCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Details button
  detailsButton: {
    backgroundColor: '#fff',
    borderColor: '#6c757d',
  },
  detailsButtonText: {
    color: '#6c757d',
  },
  
  // Update button
  updateButton: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
  },
  updateButtonText: {
    color: '#007AFF',
  },
});

export default GenericTable;