import React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import AspectRatio from '@mui/joy/AspectRatio';
import Skeleton from '@mui/joy/Skeleton';
import AppView from '@/components/ui/AppView';
import { GetRatingDto } from '@/interfaces/EscapeGameInterface/Rating/getRatingDto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Note } from '@mui/icons-material';
import { UnitofAction } from '../../../action/UnitofAction';
import { CardActionArea, Pagination } from '@mui/material';

// Remplace GetRatingDto par la bonne interface si besoin


type RatingItemProps = {
    data?: GetRatingDto;
    loading?: boolean;
};

export default function Ratinglist() {
    // Remplace par ton vrai hook/fetch
    const loading = false;
    const {id} = useLocalSearchParams();
    const [rating,setRating]=React.useState<GetRatingDto[]>([]);
    const [page,setPage]=React.useState<number>(1);

    const action = new UnitofAction();

    const fetchRatings = async () => {
        const response = await action.ratingAction.GetAllRatingbyEscapeGameId(Number(id), 1, 10);
        if (response.Success) {
            const data = response.Data as GetRatingDto[];
            setRating(data);
        }
    };

    React.useEffect(() => {
        fetchRatings();
    }, [page]);
    
    return (
        <AppView>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography level="h3">Ratings List</Typography>
            </Box>
            <Card variant="outlined" sx={{ width: 360, mx: 'auto', p: 0 }}>
                <List sx={{ py: 'var(--ListDivider-gap)' }}>
                    {(loading ? Array.from({ length: 3 }) : rating).map((item, index) => (
                        <React.Fragment key={index}>
                            <RatingItem data={item as GetRatingDto} loading={loading} />
                            {index !== (loading ? 2 : rating.length - 1) && <ListDivider />}
                        </React.Fragment>
                    ))}
                </List>
                <CardActionArea>
                    <Pagination 
                        count={10}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    />
                </CardActionArea>
            </Card>
        </AppView>
    );
}

function RatingItem({ data, loading }: RatingItemProps) {
    const router = useRouter();

    const handleClick = () => {
        if (data) {
            router.push({
                pathname: `/Organisation/Rating/RatingDetails`,
                params: { id: data.rateId.toString() },
            });
        }
    };

    return (
        <ListItem>
            <ListItemButton onClick={handleClick} sx={{ gap: 2 }}>
                <AspectRatio sx={{ flexBasis: 100 }}/>
                <ListItemContent>
                    <Typography sx={{ fontWeight: 'md' }}>
                        {loading ? <Skeleton width="60%" /> : data?.rateTitle}
                    </Typography>
                    <Typography level="body-sm">
                        {loading ? <Skeleton width="80%" /> : data?.rateContent}
                    </Typography>
                    <Typography>
                        <Note fontSize="small" />
                    </Typography>
                </ListItemContent>
            </ListItemButton>
        </ListItem>
    );
}