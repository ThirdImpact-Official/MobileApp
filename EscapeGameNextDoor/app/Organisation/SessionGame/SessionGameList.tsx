import React from "react";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import {
  Box,
  Button,
  FormControl,
  List,
  ListItem,
  Stack,
  Card,
  ListItemButton,
} from "@mui/material";
import Typography from '@mui/joy/Typography';
import ListItemContent from "@mui/joy/ListItemContent";
import ListDivider from "@mui/joy/ListDivider";
import AspectRatio from "@mui/joy/AspectRatio";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import FormUtils from '@/classes/FormUtils';
import AppView from "@/components/ui/AppView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { UnitofAction } from "@/action/UnitofAction";
import { PaginationResponse } from "@/interfaces/ServiceResponse";

export default function SessionGameList() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [sessionGames, setSessionGames] = useState<GetSessionGameDto[]>([]);
  const [escapeGame, setEscapeGame] = useState<GetEscapeGameDto | null>(null);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const httpaction = new UnitofAction();

  const fetchSessionGames = async () => {
    setIsLoading(true);
    try {
      const response = await httpaction.sessionAction.getSessionEscapeGameById(Number(id), page, 5) as PaginationResponse<GetSessionGameDto>;
      if (response.Success) {
        setSessionGames(response.Data as GetSessionGameDto[]);
        setTotalPages(response.TotalPage);
      } else {
        setSessionGames([]);
        setTotalPages(1);
        console.log(response.Message);
      }
    } catch (e) {
      setSessionGames([]);
      setTotalPages(1);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEscapeGame = async () => {
    try {
      const response = await httpaction.escapeGameAction.getEscapeGameById(Number(id));
      if (response.Success) {
        setEscapeGame(response.Data as GetEscapeGameDto);
      } else {
        console.log(response.Message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchSessionGames();
    fetchEscapeGame();
    // eslint-disable-next-line
  }, [page]);

  const filteredSessions = sessionGames.filter((sg) => {
    if (filter === '1') return !sg.isReserved;
    if (filter === '2') return sg.isReserved;
    return true;
  });

  if (isLoading) {
    return (
      <AppView>
        <ActivityIndicator size="large" />
      </AppView>
    );
  }

  return (
    <AppView>
      <Stack className="flex flex-row items-end justify-center p-4">
        <Typography><ThemedText>Filtre</ThemedText></Typography>
        <ThemedView>
          <Box className="flex flex-row items-center justify-center md:w-1/2">
            <ThemedView>
              <Typography>{escapeGame?.esgNom}</Typography>
            </ThemedView>
            <FormControl className="ps-2">
              <Picker
                selectedValue={filter}
                onValueChange={(itemValue) => setFilter(itemValue)}
              >
                <Picker.Item label="All" value="" />
                <Picker.Item label="Available" value="1" />
                <Picker.Item label="Reserved" value="2" />
              </Picker>
            </FormControl>
          </Box>
        </ThemedView>
      </Stack>

      <Stack className="flex flex-col items-center justify-center p-4">
        <Card variant="outlined" sx={{ width: 350, p: 0 }}>
          <List sx={{ py: 'var(--ListDivider-gap)' }}>
            {filteredSessions.map((sessionGame, index) => (
              <React.Fragment key={sessionGame.segId}>
                <ListItem>
                  <ListItemButton
                    sx={{ gap: 2 }}
                    onClick={() => router.push({
                      pathname: `/Organisation/SessionGame/SessionGameDetails`,
                      params: { id: sessionGame.segId.toString() }
                    })}
                  >
                    <AspectRatio sx={{ flexBasis: 80 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          bgcolor: sessionGame.isReserved ? 'grey.300' : 'success.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: 24,
                          color: 'text.primary',
                        }}
                      >
                        {sessionGame.segId}
                      </Box>
                    </AspectRatio>
                    <ListItemContent>
                      <Typography sx={{ fontWeight: 'md' }}>
                        {sessionGame.isReserved ? 'Reserved' : 'Available'}
                      </Typography>
                      <Typography level="body-sm">
                        {FormUtils.FormatDate(sessionGame.gameDate.toString())}
                      </Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
                {index !== filteredSessions.length - 1 && <ListDivider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="outlined"
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
            size="small"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </Box>
      </Stack>
    </AppView>
  );
}