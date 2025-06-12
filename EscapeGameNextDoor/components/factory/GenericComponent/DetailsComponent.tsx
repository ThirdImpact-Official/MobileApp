import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import RenderDetail from "./RenderDetails";

interface DetailsProps<T> {
    data: T;
    columns: { label: string; accessor: keyof T }[];
    cardStyle?: object;
    headerStyle?: object;
    contentStyle?: object;
    titleStyle?: object;
    emptyStateStyle?: object;
}

// Component
const DetailsComponent = <T,>({ 
    data, 
    columns, 
    cardStyle,
    headerStyle,
    contentStyle,
    titleStyle,
    emptyStateStyle
}: DetailsProps<T>) => {
    if (!data) {
        return (
            <View style={[styles.emptyContainer, emptyStateStyle]}>
                <Text style={styles.emptyText}>
                    Aucune donnée disponible
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.card, cardStyle]}>
            <View style={[styles.header, headerStyle]}>
                <Text style={[styles.title, titleStyle]}>
                    Détails
                </Text>
            </View>
            
            <ScrollView style={[styles.content, contentStyle]}>
                <View style={styles.stack}>
                    {columns.map((column, index) => (
                        <View key={column.accessor as string}>
                            <RenderDetail
                                label={column.label}
                                value={data[column.accessor]}
                            />
                            {index < columns.length - 1 && (
                                <View style={styles.divider} />
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        backgroundColor: '#fff',
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
    header: {
        backgroundColor: '#1976d2', // Primary dark color
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    stack: {
        padding: 24,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        padding: 24,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default DetailsComponent;