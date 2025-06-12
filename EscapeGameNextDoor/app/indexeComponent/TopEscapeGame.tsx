import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Pagination, Box } from '@mui/material';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UnitofAction } from '@/action/UnitofAction';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from 'expo-router';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export default function TopEscapeGames() {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GetEscapeGameDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await new UnitofAction().accueilAction.GetRankedEscapegame(page, 5) as PaginationResponse<GetEscapeGameDto>;

      if (response.Success) {
        setGames(response.Data as GetEscapeGameDto[]);
        setTotalPages(response.TotalPage);
      }
    } catch (error) {
      console.error("Failed to fetch top escape games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [page]);

  if (isLoading) return <ThemedText>Chargement des meilleurs escape games...</ThemedText>;

  return (
    <ThemedView>
      <ThemedText type="subtitle">Les Meilleurs Escape Games</ThemedText>

      <Carousel
        NextIcon={<NavigateNextIcon />}
        PrevIcon={<NavigateBeforeIcon />}
        navButtonsAlwaysVisible
        animation="slide"
        autoPlay={false}
        indicators={false}
        duration={400}
      >
        {games.map((game) => (
          <Card
            key={game.esgId}
            onClick={() =>
              router.push({
                pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
                params: { id: `${game.esgId}` },
              })
            }
            sx={{
              width: 300,
              margin: '0 auto',
              cursor: 'pointer',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={game.esgImgResources}
              alt={game.esgNom}
            />
            <CardContent>
              <Typography variant="h6" noWrap>{game.esgNom}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {game.esgContent}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Carousel>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </ThemedView>
  );
}
