import { UnitofAction } from "@/action/UnitofAction";
import { Typography, Card, CardContent, CardHeader, CardMedia, CardActions } from "@mui/material";
import { useLocalSearchParams } from "expo-router";
import { LockClockOutlined } from '@mui/icons-material';
import { useLocale } from "@react-navigation/native";
import { useState } from "react";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { useEffect } from "react";
import { GetPriceDto } from "@/interfaces/EscapeGameInterface/Price/getPriceDto";
import { GetDifficultyLevelDto } from "@/interfaces/EscapeGameInterface/DifficultyLevel/getDifficultyLevelDto";
import FormUtils from '@/classes/FormUtils';
import { diff } from "util";
import AppView from "@/components/ui/AppView";

export default function SummaryReservation() {
    const { id } = useLocalSearchParams();
    const action = new UnitofAction();
    const locale = useLocale();
    const [escapeGame, setEscapeGame] = useState<GetEscapeGameDto | null>(null);
    const [sessionGame, setSessionGame] = useState<GetSessionGameDto | null>(null);
    const [Price, setPrice] = useState<GetPriceDto | null>(null);
    const [Difficulty, setDifficulty] = useState<GetDifficultyLevelDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const sessionResponse = await action.sessionAction.getSessionById(Number(id));
                const sessionData = sessionResponse.Data as GetSessionGameDto;
                setSessionGame(sessionData);
                const escapeResponse = await action.escapeGameAction.getEscapeGameById(sessionData.escapeGameId);
                setEscapeGame(escapeResponse.Data as GetEscapeGameDto);

                const priceResponse = await action.escapeGameAction.GetPriceIndice();
                setPrice(priceResponse.Data?.find((item) => item.id === escapeGame?.esg_Price_Id) as GetPriceDto);

                const difficultyResponse = await action.escapeGameAction.GetDifficultyLevelDto();
                setDifficulty(difficultyResponse.Data?.find((item) => item.dowId === escapeGame?.esg_DILE_Id) as GetDifficultyLevelDto);

                if (sessionData) {
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <AppView>

                <Card>
                    <CardHeader title="Reservation Summary" />
                    <CardContent>
                        <Typography>Loading reservation details...</Typography>
                    </CardContent>
                </Card>
            </AppView>
        );
    }

    return (
        <AppView>
            <Card>
                <CardHeader title="Reservation Summary" />
                <CardMedia
                    component="img"
                    height="140"
                    image={escapeGame?.esgImgResources}
                    alt={escapeGame?.esgNom}
                />
                <CardContent>
                    {escapeGame && (
                        <>
                            <Typography variant="h6">{escapeGame.esgNom}</Typography>
                            <Typography variant="body2">{escapeGame.esgContent}</Typography>
                            <Typography variant="body2">Adapter aux enfants: {escapeGame.esg_IsForChildren ? "Yes" : "No"}</Typography>
                            <Typography variant="body2">indicateur de Price : {Price?.indicePrice}</Typography>
                            <Typography variant="body2">Difficulty Level: {Difficulty?.dowName}</Typography>

                        </>
                    )}
                    {sessionGame && (
                        <>
                            <Typography variant="body2">Prix: {sessionGame?.price} minutes</Typography>
                            <Typography variant="subtitle1">Session Details</Typography>
                            <Typography>Date: {FormUtils.FormatDate(sessionGame.gameDate.toString())}</Typography>
                            <Typography>Players: {sessionGame.placeMaximum}</Typography>
                        </>
                    )}
                </CardContent>
                <CardActions>
                    
                </CardActions>
            </Card>
        </AppView>
    );
}
