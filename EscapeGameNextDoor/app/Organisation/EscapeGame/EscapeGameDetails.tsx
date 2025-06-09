import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Typography, 
  Box, 
  Stack, 
  CardMedia, 
  Button, 
  Divider,
  Skeleton,
  Alert
} from '@mui/material';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import FormUtils from '@/classes/FormUtils';
import AppView from '@/components/ui/AppView';
import { UnitofAction } from '@/action/UnitofAction';

export default function EscapeGameDetails() {
    const { id } = useLocalSearchParams();
    const action = new UnitofAction();
    const [state, setState] = useState<GetEscapeGameDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const fetchEscapeGame = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Validate ID
            if (!id || Array.isArray(id)) {
                throw new Error('Invalid game ID');
            }

            const numericId = Number(id);
            if (isNaN(numericId)) {
                throw new Error('Game ID must be a number');
            }

            const response = await action.escapeGameAction.getEscapeGameById(numericId);
            
            if (!response.Success || !response.Data) {
                throw new Error(response.Message || 'Failed to load game details');
            }

            setState(response.Data as GetEscapeGameDto);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred');
            console.error('Fetch error:', e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchEscapeGame();
    }, [id]);

    if (isLoading) {
        return (
            <AppView>
                <Stack spacing={2} className='p-4'>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="100%" />
                </Stack>
            </AppView>
        );
    }

    if (error) {
        return (
            <AppView>
                <Alert severity="error" className='m-4'>
                    {error}
                    <Button onClick={fetchEscapeGame} color="inherit" size="small">
                        Retry
                    </Button>
                </Alert>
            </AppView>
        );
    }

    if (!state) {
        return (
            <AppView>
                <Typography variant="h6" className='text-center p-4'>
                    No game data available
                </Typography>
            </AppView>
        );
    }

    // Safe date formatting
    const formattedDate = state.esg_CreationDate 
        ? FormUtils.FormatDate(state.esg_CreationDate.toString()) 
        : 'Date not available';

    return (
        <AppView>
            <Stack spacing={3} className='p-4'>
                <Card elevation={3}>
                    <CardHeader
                        title={state.esgNom || 'Untitled Game'}
                        subheader={`Created: ${formattedDate}`}
                        titleTypographyProps={{ variant: 'h5' }}
                    />
                    
                    <CardMedia 
                        component="img"
                        height="240"
                        image={state.esgImgResources || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={state.esgNom || 'Game image'}
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                        }}
                    />
                    
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="body1">
                                <strong>Description:</strong> {state.esgContent || 'No description available'}
                            </Typography>
                            
                            <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
                                <Typography variant="body2">
                                    <strong>Child-friendly:</strong> {state.esg_IsForChildren ? "Yes" : "No"}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Phone:</strong> {state.esgPhoneNumber || 'Not available'}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Difficulty:</strong> {state.difficultyLevel?.dowName || 'Not specified'}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Price:</strong> {state.price?.indicePrice || 'Not specified'}
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                    
                    <CardActions className='flex flex-row justify-center space-x-2'>
                        <Button variant="outlined">User Reviews</Button>
                        <Divider orientation="vertical" flexItem />
                        <Button 
                            variant="outlined"
                            onClick={() => state.esgId && router.push(`/Organisation/SessionGame/SessionGameList?id=${state.esgId}`)}
                        >
                            Game Sessions
                        </Button>
                        <Divider orientation="vertical" flexItem />
                        <Button 
                            variant="outlined"
                            onClick={() => router.push('/Organisation/ActivitityPlace/ActivityPlaceList')}
                        >
                            Activities
                        </Button>
                    </CardActions>
                </Card>
            </Stack>
        </AppView>
    );
}