import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AppView from "@/components/ui/AppView";
import { SessionAction } from '../../../action/SessionAction';
import { GetSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto";
import { ServiceResponse } from "@/interfaces/ServiceResponse";
import FormUtils from "@/classes/FormUtils"
import React from 'react';
import { Card, Divider, Title } from 'react-native-paper';

/**
 * 
 * @param id 
 * @returns 
 */
async function fetchSessionReservationById(id: string): Promise<ServiceResponse<GetSessionReservedDto>> {
    const sessionAction = new SessionAction();
    const response = await sessionAction.getSessionById(Number(id)) as ServiceResponse<GetSessionReservedDto>;
    return response;
}
/**
 * 
 * @returns 
 */
export default function SessionReservation() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [session, setSession] = useState<null | GetSessionReservedDto>(null);
    const [loading, setLoading] = useState(false);
    const [IsError,setIsError] = useState<boolean>(false);
    const [error,setError] = useState<String>("");

    /**
     * 
     */
    const handleput= async()=> {
        try
        {

        }
        catch(error)
        {

        }
    }

    useEffect(() => {
        if (typeof id === "string") {
            setLoading(true);
            fetchSessionReservationById(id).then((data) => {
               if(data.Success)
               {
                   setSession(data.Data);
                     setIsError(false);
                   setError(data.Message)
                   
               }else{
                 setSession(data.Data);
                 setIsError(true);
                   setError(data.Message)
            }
            setLoading(false);
            });
        }
    }, [id]);
    if(IsError)
    {
        return(
            <AppView>
                 <Card>
                    <Card.Title title=" Details de la session"  />
                    <Divider className="mb-4"></Divider>
                    <Card.Content className="flex flex-auto text-center justify-center items-center">
                        <View>
                            <Text>{error}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </AppView>
        )
    }
    else{
        return (
            <AppView>
                <Card>
                    <Card.Title title=" Details de la session"  />
                    <Divider className="mb-4"></Divider>
                    <Card.Content className="flex flex-auto text-center justify-center items-center">
                        <View>
                            <ThemedText style={styles.title}>Détails de la réservation</ThemedText>
                            {loading ? (
                                <ActivityIndicator size="large" />
                            ) : session ? (
                                <View style={styles.card}>
                                    <Text style={styles.contentText}>{session.content}</Text>
                                    <Text style={styles.text}>Date : {FormUtils.FormatDate(session.gameDate)}</Text>
                                    <Text style={styles.text}>Participants : {session.placeReserved}</Text>
                                    <Text style={styles.text}>ID : {session.id}</Text>
                                </View>
                            ) : (
                                <Text style={styles.text}>Aucune session trouvée.</Text>
                            )}
                        </View>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    contentText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
});