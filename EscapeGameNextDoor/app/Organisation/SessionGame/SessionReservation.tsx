import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AppView from "@/components/ui/AppView";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { SessionAction } from '../../../action/SessionAction';
import { UnitofAction } from "@/action/UnitofAction";
import { GetSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto";
import { ServiceResponse } from "@/interfaces/ServiceResponse";
import {FormUtils } from "@/classes/FormUtils"
async function fetchSessionReservationById(id: string): Promise<GetSessionReservedDto> {
    const sessionAction = new SessionAction();
    const response = await sessionAction.getSessionById(Number(id)) as ServiceResponse<GetSessionReservedDto>;
    return response.Data as GetSessionReservedDto;
}

export default function SessionReservation() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [session, setSession] = useState<null |GetSessionReservedDto >(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof id === "string") {
            setLoading(true);
            fetchSessionReservationById(id).then((data) => {
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
                            <Typography variant="h6">{session.content}</Typography>
                            <Typography>Date : {FormUtils.formatDateString(session.gameDate)}</Typography>
                            <Typography>Participants : {}</Typography>
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