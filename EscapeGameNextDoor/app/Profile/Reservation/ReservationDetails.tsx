import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import FormUtils from '@/classes/FormUtils';
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { GetSessionReservedDto } from '../../../interfaces/EscapeGameInterface/Reservation/getSessionReservedDto';
import { GetSessionGameDto } from '../../../interfaces/EscapeGameInterface/Session/getSessionGameDto';
import { UnitofAction } from "@/action/UnitofAction";
import { Button, Card} from 'react-native-paper';
import AppView from "@/components/ui/AppView";
import { CardContent } from '@mui/material';
export default function Reservation() {
    const { id } = useLocalSearchParams();
    const [state, setState] = useState<GetSessionReservedDto | undefined>(undefined);
    const rooter = useRouter();
    const [sessiongGame, setSessionGame] = useState<GetSessionGameDto | undefined>(
        state?.sessionGame === null || state?.sessionGame === undefined ? undefined : state.sessionGame
    );
    const action= new UnitofAction();
    const [error,setError] =useState<string>("");
    const [isloading,setLoading]=useState<boolean>(false);

    const FetchReservationById=async ()=> {
        try {
            setLoading(true);
            const resposne= await action.sessionAction.getSessionReserved(Number(id));
            const Sessionrepsone= await action.sessionAction.getSessionById(state?.sessionGameId as number);
            if(resposne.Success)
            {
                setState(resposne.Data as GetSessionReservedDto);
            }
            else{
                setError(resposne.Message);
            }
            if(Sessionrepsone.Success)
            {
                setSessionGame(Sessionrepsone.Data as GetSessionGameDto);
            }
            else{
                setError(Sessionrepsone.Message);
            }
        }
        catch(err)
        {
            setError("une erreur a eu lieux lors de la procedure ")
            console.log(err);
        }
        finally
        {
            setLoading(false);
        }
    }
    useEffect(()=>{
        FetchReservationById();
    },[id]);
    if (isloading) {
        return (
           <AppView>
                <Card>
                    <Card.Content>
                        <View style={styles.centered}>
                            <View style={styles.card}>
                                <ActivityIndicator size="large" />
                            </View>
                        </View>
                    </Card.Content>
                </Card>
           </AppView>
           
        );
    } else {
        return (
           <AppView>
            
                <ScrollView contentContainerStyle={styles.centered}>
                    <Card style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.title}>{/* Add a title here if needed */}</Text>
                            <Text style={styles.subtitle}>{FormUtils.FormatDate(sessiongGame?.gameDate.toString())}</Text>
                        </View>
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.label}>
                                <Text style={styles.bold}>Date de réservation :</Text> {FormUtils.FormatDate(state?.creationDate.toString())}
                            </Text>
                            <Text style={styles.label}>
                                <Text style={styles.bold}>Game Name:</Text> {sessiongGame?.price}
                            </Text>
                            <Text style={styles.label}>
                                <Text style={styles.bold}>Place Available:</Text> {sessiongGame?.placeAvailable}
                            </Text>
                            <Text style={styles.label}>
                                <Text style={styles.bold}>Place Maximum:</Text> {sessiongGame?.placeMaximum}
                            </Text>
                            <Text style={styles.label}>{state?.content}</Text>
                        </Card.Content>
                        <Card.Actions style={styles.cardActions}>
                            <View style={{flex:1}}>
                                <Button
                                    style={styles.button}
                                    onPress={() => rooter.push({
                                        pathname: '/Organisation/EscapeGame/EscapeGameDetails'
                                        ,params: { id: sessiongGame?.escapeGameId}
                                    })}
                                >
                                    <Text style={styles.buttonText}>Escape Game</Text>
                                </Button>
                                <Button
                                    style={styles.button}
                                    onPress={() => rooter.push(`/Profile/Reservation/Reservation`)}
                                >
                                    <Text style={styles.buttonText}>Avis</Text>
                                </Button>
                                <Button
                                    style={styles.button}
                                    onPress={() => rooter.push(`/Profile/Reservation/Reservation`)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </Button>
                            </View>
                        </Card.Actions>
                    </Card>
                </ScrollView>
            </AppView>
        );
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        marginVertical: 20,
    },
    cardHeader: {
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
    },
    cardContent: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    bold: {
        fontWeight: 'bold',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        marginVertical: 8,
        backgroundColor: '#1976d2',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
