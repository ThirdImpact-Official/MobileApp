import AppView from "@/components/ui/AppView";
import { useAuth } from "@/context/ContextHook/AuthContext";
import { Stack,Card, CardActionArea, CardContent, CardHeader, Box, Typography, Button, Divider } from "@mui/material";
import { router, useLocalSearchParams,useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { UnitofAction } from "@/action/UnitofAction";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import { useState } from "react";
import FormUtils from '@/classes/FormUtils';
export default function ListSessionDetails() {
    const { id } = useLocalSearchParams()
    //Variable 
    const [session, setSession] = useState<GetSessionGameDto | null>(null);
    //Function
    const isloading = useAuth().isLoading;
    const httpaction = new UnitofAction();
    const rooter = useRouter();
    const fetchSession = async () => {
        const response = await httpaction.sessionAction.getSessionById(Number(id));
        if (response.Success) {
            console.log(response.Data);
            setSession(response.Data as GetSessionGameDto);
        }
        else {
            console.log(response.Message);
        }
    }
    
    useEffect(() => {
        fetchSession();
    }, [id])
    if (isloading) {
        return (
            <AppView>
                <ActivityIndicator size="large" />
            </AppView>
        )
    }
    else {

        return (
            <AppView>
                <Stack className="flex flex-col items-center justify-center p-4">

                    <Card className="">
                        <CardHeader title="Session" />
                        <CardContent>
                            <Box className="text-start items-center  ">
                                <Typography>
                                    <strong>Date : </strong>
                                    {FormUtils.FormatDate(session?.gameDate.toString())}
                                </Typography>
                                <Typography>
                                    <strong>PlaceMaximum :</strong>
                                    {session?.placeMaximum.toString()}
                                </Typography>
                                <Typography>
                                    <strong>PlaceDisponible:</strong>
                                    {session?.placeAvailable.toString()}
                                </Typography>
                                <Typography>
                                    <strong>Prix :</strong>
                                    {session?.price ? "Oui" : "Non"}
                                </Typography>
                                <Typography>
                                    <strong>LIbre :</strong>
                                    {session?.isReserved ? "Oui" : "Non"}
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardActionArea>
                            <Box className="flex flex-row items-center justify-center">
                                <Button onClick={() => 
                                    { 
                                    router.push('/Organisation/SessionGame/SessionReservation')
                                    }}>Reserver</Button>
                                <Divider orientation="vertical" flexItem />
                                <Button>Voir les autres Session</Button>
                            </Box>
                        </CardActionArea>
                    </Card>
                </Stack>
            </AppView>
        )
    }
}