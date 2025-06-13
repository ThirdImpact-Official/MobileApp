import { GetActivityPlaceDto } from '../../../interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto';
import { View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, FC } from 'react';
import { testActivityPlaces } from '@/TestData/ActivityPlacetestData';
import AppView from '@/components/ui/AppView';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import { useRouter } from 'expo-router';
import { Card } from '@ui-kitten/components';
import React from 'react';

const ActivityPlaceList = () => {
    const [dataTable] = useState<GetActivityPlaceDto[]>(testActivityPlaces);
    return (
        <AppView>
            <ScrollView>
                <View>
                    <ThemedText>ActivityPlace</ThemedText>
                </View>
                {dataTable.map((column) => (
                  <Card key={column.acpId}>
                    <View>
                        <ThemedText style={{ fontWeight: 'bold' }}>{column.acpEsgId}</ThemedText>
                    </View>
                    <View>
                        <ThemedText>{column.name}</ThemedText>
                    </View>             
                  </Card>
                ))}
            </ScrollView>
        </AppView>
    );
};

export default ActivityPlaceList;

interface ActivityPlaceListProps {
    data?: GetActivityPlaceDto | undefined | null;
}

