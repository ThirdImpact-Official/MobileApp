import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Pagination, Stack } from '@mui/material';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UnitofAction } from '@/action/UnitofAction';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import Carousel from 'react-material-ui-carousel'
import { useRouter } from 'expo-router';

export default function RecommandedEscapeGames() {
  const [games, setGames] = useState<GetEscapeGameDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
const router  = useRouter();
  useEffect(() => {
    const fetchRecommandedGames = async () => {
      setIsLoading(true);
      try {
        const response = await new UnitofAction().accueilAction.GetRankedEscapegame(page, 5) as PaginationResponse<GetEscapeGameDto>;
        if (response.Success) {
          console.log(response);
          setGames(response.Data as GetEscapeGameDto[]);
          setTotalPages(response.TotalPage);
        }
      } catch (error) {
        console.error('Failed to fetch recommanded games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommandedGames();
  }, [page]);

  return (
    <Stack>
      {isLoading ? (
        <ThemedText>Chargement des recommandations...</ThemedText>
      ) : (
        <>
        <Carousel
        NextIcon={<img src="http://random.com/next"/>}
    PrevIcon={<img src="http://random.com/prev"/>}
        >
          <ThemedText type="subtitle">Les Meilleurs Escape Games</ThemedText>
          {games.map((game) => (
            <Card key={game.esgId} 
             onClick={()=>
            router.push({
              pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
              params:{ id: `${game.esgId}`},
            })
            } 
            sx={{
                  width: 250,          // largeur réduite
    margin: '0 auto 16px',
    cursor: 'pointer',
    borderRadius: 12,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
             }}>
              <CardMedia component="img" height="140" image={game.esgImgResources} alt={game.esgNom} />
              <CardContent>
                <Typography variant="h6">{game.esgNom}</Typography>
                <Typography variant="body1">{game.esgContent}</Typography>
              </CardContent>
            </Card>
          
          ))}

          </Carousel>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </>
      )}
    </Stack>
  );
}
