'use client';
import * as React from 'react';
import { useState, useEffect, FC } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GetActivityPlaceDto } from '../../../interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto';
import { testActivityPlaces } from '@/TestData/ActivityPlacetestData';
import { UnitofAction } from '@/action/UnitofAction';
import AppView from '@/components/ui/AppView';

import Card from '@mui/joy/Card';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import Skeleton from '@mui/joy/Skeleton';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button'; // Import manquant

const ActivityPlaceList = () => {
  const { id } = useLocalSearchParams();
  const [activityPlaces, setActivityPlaces] = useState<GetActivityPlaceDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const action = new UnitofAction();

  const fetchActivityPlaces = async () => {
    setLoading(true);
    try {
      const response = await action.escapeGameAction.getActivityPlacesByEscapeGame(Number(id), page, 5);
      if (response.Success) {
        const data = response.Data as GetActivityPlaceDto[];
        setActivityPlaces(data);
      }
    } catch (error) {
      console.error('Error fetching activity places:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityPlaces();
  }, [id, page]);

  return (
    <AppView>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography level="h3">Activity Place List</Typography>
      </Box>
      <Card variant="outlined" sx={{ width: 360, mx: 'auto', p: 0 }}>
        <List sx={{ py: 'var(--ListDivider-gap)' }}>
          {(loading ? Array.from({ length: 3 }) : activityPlaces).map((item, index) => (
            <React.Fragment key={index}>
              <ActivityPlaceItem data={item as GetActivityPlaceDto} loading={loading} />
              {index !== (loading ? 2 : activityPlaces.length - 1) && <ListDivider />}
            </React.Fragment>
          ))}
        </List>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="outlined"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          sx={{ mr: 1 }}
        >
          Previous
        </Button>
        <Typography level="body-sm" sx={{ mx: 2, alignSelf: 'center' }}>
          Page {page}
        </Typography>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>
    </AppView>
  );
};

export default ActivityPlaceList;

interface ActivityPlaceItemProps {
  data?: GetActivityPlaceDto;
  loading?: boolean;
}

const ActivityPlaceItem: FC<ActivityPlaceItemProps> = ({ data, loading }) => {
  const router = useRouter();

  const handleClick = () => {
    if (data) {
      router.push({
        pathname: `/Organisation/ActivitityPlace/ActivityPlaceDetail`,
        params: { id: data.acpId},
      });
    }
  };

  return (
    <ListItem>
      <ListItemButton onClick={handleClick} sx={{ gap: 2 }}>
        <AspectRatio sx={{ flexBasis: 100 }}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          ) : (
            <img
              srcSet={`${data?.imgressources}?w=100&fit=crop&auto=format&dpr=2 2x`}
              src={`${data?.imgressources}?w=100&fit=crop&auto=format`}
              alt={data?.name || 'Activity place'}
              loading="lazy"
            />
          )}
        </AspectRatio>
        <ListItemContent>
          <Typography sx={{ fontWeight: 'md' }}>
            {loading ? <Skeleton width="60%" /> : data?.name}
          </Typography>
          <Typography level="body-sm">
            {loading ? <Skeleton width="80%" /> : data?.description}
          </Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  );
};