import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Card, CardHeader, CardContent, CardActions, Typography, Box, Stack, CardMedia, Button, Divider } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import FormUtils from '@/classes/FormUtils';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Collapsible } from '@/components/Collapsible';
import { testSessionGames } from '../../../TestData/SessiontestData';
import { GetSessionGameDto } from '@/interfaces/EscapeGameInterface/Session/getSessionGameDto';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import ParallaxScrollView from '@/components/ParallaxScrollView';

import { useColorScheme, View, Image, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Activities from '../../(tabs)/activities';

export default function EscapeGameDetails() {
    const { escapeGame } = useLocalSearchParams();
    const [state, setState] = useState<GetEscapeGameDto | undefined>(JSON.parse(escapeGame as string));
    const [sessionGames, setSessionGames] = useState<GetSessionGameDto[]>(testSessionGames);
    const [isLoading, setIsLoading] = useState(true);

    const rooter = useRouter();

    if (state === undefined) {
        return (
            <Stack>
                <Card>
                    <CardHeader title={<Skeleton />} />
                    <CardContent>
                        <Skeleton />
                    </CardContent>
                    <CardActions>
                        <Skeleton />
                    </CardActions>
                </Card>
            </Stack>
        );
    } else {
        return (
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                headerImage={<Image source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo} />}>
                <Stack className='flex flex-col items-center justify-center '>
                    <Card>
                        <CardHeader
                            title={
                                <>
                                    <Typography variant="h5">{state.esgNom}</Typography>
                                </>
                            }
                            action={
                                <>
                                    <Box>
                                        <Typography variant="h6">{FormUtils.FormatDate(state.esg_CreationDate.toString())}</Typography>
                                    </Box>
                                </>
                            }
                        />
                        <CardMedia component="img" image={state.esgImgResources} />
                        <CardContent className='overflow-y-scroll'>
                            <Box className="space-y-2">
                                <Typography variant="body2" color="textSecondary">
                                    <strong>Description</strong> :
                                    {state.esgContent}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <strong>Est adapatée au enfant</strong> : {state.esg_IsForChildren ? "Oui" : "Non"}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <strong>Numérode téléphone </strong> : {state.esgPhoneNumber}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <strong>Niveau de difficulté</strong> : {state.difficultyLevel?.dowName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <strong>Prix</strong> : {state.price?.indicePrice}
                                </Typography>
                            </Box>
                        </CardContent>
                        <CardActions className='flex flex-row items-center justify-center'>
                            <Button> Avis Utilisateur</Button>
                            <Divider orientation="vertical" flexItem />
                            <Button onClick={() => rooter.push(`/Organisation/SessionGame/SessionGameList?id=${state.esgId}`)}>Session de jeux</Button>
                            <Divider orientation="vertical" flexItem />
                            <Button onClick={() => rooter.push(`/Organisation/ActivitityPlace/ActivityPlaceList`)}>Activities</Button>
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