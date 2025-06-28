import React from 'react';
import { GetEscapeGameDto } from '../../../interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { useState, useEffect } from 'react';
import { UnitofAction } from '@/action/UnitofAction';
import AppView from '@/components/ui/AppView';
import { Card, ActivityIndicator, Text,  } from 'react-native-paper';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import { ScrollView, View ,StyleSheet, TouchableOpacity} from 'react-native';
import { router } from 'expo-router';
const PAGE_SIZE = 5;
export default function CompletedList() {
    const [completedGames, setCompletedGames] = useState<GetEscapeGameDto[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const action = new UnitofAction();
    const [page,setpage]= useState<number>(1);
    const [totalPages,setTotalPages] = useState<number>(0);
    useEffect(() => {
        const fetchCompletedGames = async () => {
            try {
                const response = await action.completegameAction.getUserCompletedGames(page,PAGE_SIZE);
                if (response.Success) {
                    setCompletedGames(response.Data as GetEscapeGameDto[]);
                    setTotalPages(response.TotalPage);
                } else {
                    setError(response.Message);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCompletedGames();
    }, []);

    if (isLoading) {
        return (
            <ScrollView>
                <Card>
                    <Card.Title title="Loading">
                    </Card.Title>
                    <Card.Content>
                        <View>
                            <ActivityIndicator />
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        );
    }

    if (error) {
        return (
            <ScrollView>
                <Card>
                    <Card.Title title="Error">
                    </Card.Title>
                    <Card.Content>
                        <View>
                            <Text>{error}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        );
    }

    return (
        <ScrollView>
            <Card>
                <Card.Title title="Completed Games" titleStyle={styles.cardTitle}/>
         
                <Card.Content>
                    <View>
                        {completedGames?.map((game) => (
                            <TouchableOpacity
                            onPress={
                               ()=> router.push({pathname:'/Session/Research/EscapegameDetail',params:{id:game.esgId.toString()}})
                            }>
                            <ItemDisplay
                                 key={game.esgId} 
                                 header={game.esgTitle} 
                                 name={game.esgTitle} 
                                 img={game.esgImgResources} 
                                 onClick={()=> router.push({
                                    pathname:'/Session/Research/EscapegameDetail',params:{id:game.esgId.toString()}
                            })} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    cardTitle:{
        fontSize:20,
        textAlign:'center'
    },
    carContainer:{
        
    },
    cardFooter:{

    },
});