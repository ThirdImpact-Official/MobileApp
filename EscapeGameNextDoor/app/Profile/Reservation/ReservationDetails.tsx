import { Box, Button, Card, CardActions,CardContent, CardHeader, Skeleton, Stack, Typography } from "@mui/material";

import { GetSessionReservedDto, reservationcolumns } from '../../../interfaces/EscapeGameInterface/Reservation/getSessionReservedDto';
import { GetSessionGameDto } from '../../../interfaces/EscapeGameInterface/Session/getSessionGameDto';
import { useState } from "react";
import FormUtils from '@/classes/FormUtils';
import { ThemedView } from "@/components/ThemedView";
import ItemDisplay from "@/components/factory/GenericComponent/ItemDisplay";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Stroller } from "@mui/icons-material";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {useColorScheme, View, Image, StyleSheet, Text, ActivityIndicator } from "react-native";

type ReservationProps = {
    reservation: GetSessionReservedDto[];
};
export default function Reservation( ) {

    const { reservation } = useLocalSearchParams();

    const [state, setState] = useState<GetSessionReservedDto | undefined>(JSON.parse(reservation as string));
    const rooter = useRouter();

    const [sessiongGame, setSessionGame] = useState<GetSessionGameDto | undefined>(state?.sessionGame === null || state?.sessionGame === undefined ? undefined : state.sessionGame);
    if(state === undefined || sessiongGame === undefined){
        return(
              <ParallaxScrollView
              headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                    headerImage={<Image source={require('@/assets/images/partial-react-logo.png')}
                style={styles.reactLogo} />}
            >

            <Stack>
                <Card>
                    <CardHeader title={
                        <Skeleton />
                    } />
                    <CardContent>
                        <Skeleton />
                    </CardContent>
                    <CardActions>
                        <Skeleton />
                    </CardActions>
                </Card>
            </Stack>
            </ParallaxScrollView>
        )      
    }
    else
    {
        return(
            <ParallaxScrollView
              headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                    headerImage={<Image source={require('@/assets/images/partial-react-logo.png')}
                style={styles.reactLogo} />}
            >
            <Stack className="flex flex-col items-center justify-center w-1/2 ">
                <Card>
                    <CardHeader 
                        title={
                        <>
                          <Typography variant="h5">{}</Typography>
                        </>
                        }
                        action={<>
                          <Box>
                            <Typography variant="h6">{FormUtils.FormatDate(sessiongGame.gameDate.toString())}</Typography>
                          </Box>
                        </>} />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary">
                            <strong>Date de reservation :</strong> {FormUtils.FormatDate(state.creationDate.toString())}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            <strong>Game Name:</strong> {sessiongGame.price}</Typography>
                        <Typography variant="body2" color="textSecondary">
                        <strong>Place Available</strong>    {sessiongGame.placeAvailable}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                         <strong>Place Maximum</strong>   {sessiongGame.placeMaximum}
                        </Typography>
                    <Typography variant="body2" color="textSecondary">
                     {state.content}
                    </Typography>
                    </CardContent>
                    <CardActions>
                        <Box className="justify-center items-center flex flex-row gap-4">
                            <Button onClick={() =>rooter.push(`/EscapeGame/${sessiongGame.escapeGameId}`) }>Escape Game</Button>
                            <Button onClick={() =>rooter.push(`/Profile/Reservation/Reservation`)}>Avis </Button>
                            <Button onClick={() =>rooter.push(`/Profile/Reservation/Reservation`)}>Cancel </Button>
                        </Box>    
                    </CardActions>
                </Card>
            </Stack>
            </ParallaxScrollView>
        );

    }
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
