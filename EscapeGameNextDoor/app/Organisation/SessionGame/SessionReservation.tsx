import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AppView from "@/components/ui/AppView";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { SessionAction } from '../../../action/SessionAction';
import { UnitofAction } from "@/action/UnitofAction";
import { GetSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto";
// Simulated fetch function (replace with real API call)
async function fetchSessionReservation(id: string) {
    // Replace with your actual API call
    const action =new UnitofAction();
    const resposne sawait  action.sessionAction.getSessionById(Number(id));
    return response.Data:
}

export default function SessionReservation() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [session, setSession] = useState<null |GetSessionReservedDto >(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof id === "string") {
            setLoading(true);
            fetchSessionReservation(id).then((data) => {
                setSession(data as GetSessionReservedDto );
                setLoading(false);
            });
        }
    }, [id]);

    return (
        <AppView>
            <ThemedView>
                <ThemedText>
                    <h1>Détails de la réservation</h1>
                </ThemedText>
                {loading ? (
                    <CircularProgress />
                ) : session ? (
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{session.name}</Typography>
                            <Typography>Date : {session.date}</Typography>
                            <Typography>Participants : {session.participants}</Typography>
                            <Typography>ID : {session.id}</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography>Aucune session trouvée.</Typography>
                )}
            </ThemedView>
        </AppView>
    );
}