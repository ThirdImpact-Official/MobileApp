import { UnitofAction } from "@/action/UnitofAction";
import React from "react";
import { GetRatingDto } from "@/interfaces/EscapeGameInterface/Rating/getRatingDto";
import { useLocalSearchParams } from "expo-router";
import { useEffect,useState } from "react";
import { User } from "react-native-feather";
import { ActivityIndicator, Card } from "react-native-paper";
import { View,Text,StyleSheet } from "react-native";
import AppView from "@/components/ui/AppView";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { ThemedText } from "@/components/ThemedText";
export const mockRatings: GetRatingDto[] = [
  {
    rateId: 1,
    rateTitle: "Super expérience",
    rateContent: "Le jeu était très bien pensé et immersif. On s'est éclatés !",
    userId: 101,
    notes: 5,
    hasBeenDoneId: 1001,
    creationDate: "2025-06-01T10:00:00Z",
    updateDate: "2025-06-01T10:00:00Z"
  },
  {
    rateId: 2,
    rateTitle: "Assez bon",
    rateContent: "Quelques énigmes trop faciles mais l’ambiance était sympa.",
    userId: 102,
    notes: 3,
    hasBeenDoneId: 1002,
    creationDate: "2025-06-02T12:15:00Z",
    updateDate: "2025-06-02T12:15:00Z"
  },
  {
    rateId: 3,
    rateTitle: "Décevant",
    rateContent: "Beaucoup d’attente, peu de contenu interactif.",
    userId: 103,
    notes: 2,
    hasBeenDoneId: 1003,
    creationDate: "2025-06-03T09:30:00Z",
    updateDate: "2025-06-03T09:30:00Z"
  },
  {
    rateId: 4,
    rateTitle: "Très bien organisé",
    rateContent: "Le personnel était accueillant et le scénario génial.",
    userId: 104,
    notes: 4,
    hasBeenDoneId: 1004,
    creationDate: "2025-06-04T14:45:00Z",
    updateDate: "2025-06-04T14:45:00Z"
  },
  {
    rateId: 5,
    rateTitle: "Exceptionnel",
    rateContent: "Meilleur escape game que j’ai fait jusqu’à présent.",
    userId: 105,
    notes: 5,
    hasBeenDoneId: 1005,
    creationDate: "2025-06-05T16:20:00Z",
    updateDate: "2025-06-05T16:20:00Z"
  },
  {
    rateId: 6,
    rateTitle: "Sympa mais sans plus",
    rateContent: "Correct pour passer une heure, mais manque de challenge.",
    userId: 106,
    notes: 3,
    hasBeenDoneId: 1006,
    creationDate: "2025-06-06T11:10:00Z",
    updateDate: "2025-06-06T11:10:00Z"
  },
  {
    rateId: 7,
    rateTitle: "Médiocre",
    rateContent: "Décor vieillissant et mécanismes cassés.",
    userId: 107,
    notes: 1,
    hasBeenDoneId: 1007,
    creationDate: "2025-06-07T17:30:00Z",
    updateDate: "2025-06-07T17:30:00Z"
  },
  {
    rateId: 8,
    rateTitle: "Immersion totale",
    rateContent: "On avait vraiment l’impression d’être dans une autre époque.",
    userId: 108,
    notes: 4,
    hasBeenDoneId: 1008,
    creationDate: "2025-06-08T13:40:00Z",
    updateDate: "2025-06-08T13:40:00Z"
  },
  {
    rateId: 9,
    rateTitle: "Bien mais bruyant",
    rateContent: "La salle voisine faisait beaucoup de bruit, dommage.",
    userId: 109,
    notes: 2,
    hasBeenDoneId: 1009,
    creationDate: "2025-06-09T18:05:00Z",
    updateDate: "2025-06-09T18:05:00Z"
  },
  {
    rateId: 10,
    rateTitle: "Bon moment en famille",
    rateContent: "Accessible pour tous les âges, très amusant.",
    userId: 110,
    notes: 4,
    hasBeenDoneId: 1010,
    creationDate: "2025-06-10T15:50:00Z",
    updateDate: "2025-06-10T15:50:00Z"
  }
];

const PAGE_SIZE = 10;
export default  function  RatinglistEscapegame()
{
    const [isLoading,setloading]=useState<boolean>(true);
    const [Error,setError]=useState<string|null>(null);
    const [data,setData]=useState<GetRatingDto[]>(mockRatings);
    const {id} =useLocalSearchParams();
    const [page,setPage]=useState<number>(1);

    const action= new UnitofAction();
    
      const fetchData = async () => {
        try {
          const response = await action.ratingAction.GetAllRatingbyEscapeGameId(Number(id),page,PAGE_SIZE);
          if (response.Success) {
            setData(response.Data as GetRatingDto[]);
          } else {
            setError(response.Message || 'Failed to fetch data');
          }
        } catch (e) {
          setError('An error occurred while fetching data');
          console.error(e);
        } finally {
          setloading(false);
        }
      };
      
    useEffect(()=> {
      fetchData();
    }, [id,page]);
    
    if(Error){
        return (
            <AppView>
                <Card>
                <Card.Content>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ThemedText>{Error}</ThemedText>
                    </View>

                    </Card.Content>.

                </Card>

            </AppView>
        )
    }

    if(isLoading){

        return (
            <AppView>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                   <ThemedText>
                    <ActivityIndicator></ActivityIndicator>
                   </ThemedText>
                </View>
            </AppView>
        )
    }

    return (
        <AppView>
            {
                data.map((rating) => (
                    <RatingCard key={rating.rateId} {...rating} />
                ))
            }
        </AppView>
    )
}

function RatingCard(rating: GetRatingDto)
{
    const [getuser,setuser]= useState<GetUserDto|null>(null);
    const [isLoading,setloading]=useState<boolean>(true);
    const [Error,setError]=useState<string|null>(null);
    const action= new UnitofAction();
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await action.userAction.GetUserById(rating.userId);
            if (response.Success) {
              setuser(response.Data as GetUserDto);
            } else {
              setError(response.Message || 'Failed to fetch data');
            }
          } catch (e) {
            setError('An error occurred while fetching data');
            console.error(e);
          } finally {
            setloading(false);
          }
        };
        fetchData();
      }, []);
      if(Error){
        return (
          
                <Card>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>{Error}</Text>
                </View>

                </Card>)
        }
        if(isLoading){
            return (
                <Card>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>Loading</Text>
                </View>

                </Card>)
        }
        if(!getuser){
            return (
                <Card>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text>Loading</Text>
                </View>

                </Card>)
        }
    return (
        <Card>
            <Card.Title title={getuser.username} />
            <Card.Content>
                <Text>{rating.rateContent}</Text>
            </Card.Content>
        </Card>
    )   
}

const styles =StyleSheet.create({

});