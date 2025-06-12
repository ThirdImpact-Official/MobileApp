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

async function fetchSessionReservationById(id: string): Promise<GetSessionReservedDto> {
    const sessionAction = new SessionAction();
    const response = await sessionAction.getSessionById(Number(id)) as ServiceResponse<GetSessionReservedDto>;
    return response.Data as GetSessionReservedDto;
}

export default function SessionReservation() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [session, setSession] = useState<null | GetSessionReservedDto>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof id === "string") {
            setLoading(true);
            fetchSessionReservationById(id).then((data) => {
                setSession(data as GetSessionReservedDto);
                setLoading(false);
            });
        }
    }, [id]);

    return (
        <AppView>
            <ThemedView>
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
            </ThemedView>
        </AppView>
    );
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