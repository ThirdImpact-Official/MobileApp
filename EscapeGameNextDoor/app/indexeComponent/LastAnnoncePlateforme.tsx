import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useRouter } from 'expo-router';
import { UnitofAction } from '@/action/UnitofAction';
import { GetAnnonceDto } from '@/interfaces/NotificationInterface/Annonce/getAnnonceDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';

export default function LatestAnnonces() {
  const [annonces, setAnnonces] = useState<GetAnnonceDto[]>([]);
  const [page, setPage] = useState(1);
  const carouselRef = useRef(null);
  const router = useRouter();

  const fetchAnnonces = async () => {
    try {
      const response = await new UnitofAction().annonceAction.getAllAnnonces(page, 5) as PaginationResponse<GetAnnonceDto>;
      if (response.Success) {
        setAnnonces(response.Data?.toSorted((a, b) => b.createdDate - a.createdDate) as GetAnnonceDto[]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, [page]);

  const renderItem = ({ item }: { item: GetAnnonceDto }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: `/Notification/Annonce/AnnonceDetails`,
          params: { id: `${item.id}` },
        })
      }
      style={{
        borderRadius: 12,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ height: 100, borderRadius: 8 }}
        resizeMode="cover"
      />
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Les Derniers Annonces</Text>
      <Carousel
        ref={carouselRef}
        data={annonces}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={250}
      />
    </View>
  );
}
