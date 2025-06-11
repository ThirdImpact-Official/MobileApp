import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Pagination } from '@mui/material';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UnitofAction } from '@/action/UnitofAction';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import Carousel from 'react-material-ui-carousel'
import { useRouter } from 'expo-router';
export default function LatestEscapeGamesNoted() {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GetEscapeGameDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
const router  = useRouter();

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await new UnitofAction().accueilAction.GetTopEscapegame(page, 5) as PaginationResponse<GetEscapeGameDto>;
      
      if (response.Success) {
        console.log(response);
        setGames(response.Data as GetEscapeGameDto[]);
        setTotalPages(response.TotalPage);
      }
    } catch (error) {
      console.error("Failed to fetch latest games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [page]);

  if (isLoading) return <ThemedText>Chargement des derniers jeux...</ThemedText>;

  return (
    <ThemedView>
      <ThemedText type="subtitle">Les Derniers Escape Games</ThemedText>
      <Carousel
      NextIcon={<img src="http://random.com/next"/>}
      PrevIcon={<img src="http://random.com/prev"/>}
      >

      {games.map((game) => (
        <Card key={game.esgId} 
         onClick={()=>
            router.push({
              pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
              params:{ id: `${game.esgId}`},
            })
            } 
        style={{ 
              width: 250,          // largeur réduite
    margin: '0 auto 16px',
    cursor: 'pointer',
    borderRadius: 12,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
         }}>
          <CardMedia
            component="img"
            height="50"
            image={game.esgImgResources}
            alt={game.esgNom}
            />
          <CardContent>
            <Typography variant="body2">{game.esgNom}</Typography>
           
          </CardContent>
        </Card>
      ))}

      </Carousel>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
      />
    </ThemedView>
  );
}