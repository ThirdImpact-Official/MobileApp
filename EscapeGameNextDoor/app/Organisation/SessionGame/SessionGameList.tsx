import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import {
  Box,
  FormControl,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import FormUtils from '@/classes/FormUtils';
import AppView from "@/components/ui/AppView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ItemDisplay from "@/components/factory/GenericComponent/ItemDisplay";
import { UnitofAction } from "@/action/UnitofAction";

export default function SessionGameList() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [sessionGames, setSessionGames] = useState<GetSessionGameDto[] | null>(null);
  const [escapeGame, setEscapeGame] = useState<GetEscapeGameDto | null>(null);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const httpaction = new UnitofAction();

  const fetchSessionGames = async () => {
    try {
      const response = await httpaction.sessionAction.getSessionEscapeGameById(Number(id), page, 5);
      if (response.Success) {
        setSessionGames(response.Data as GetSessionGameDto[]);
      } else {
        console.log(response.Message);
      }
    } catch (e) {
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
    setIsLoading(true);
    fetchSessionGames();
    fetchEscapeGame();
  }, [page]);

  const filteredSessions = sessionGames?.filter((sg) => {
    if (filter === '1') return !sg.isReserved;
    if (filter === '2') return sg.isReserved;
    return true;
  });

  if (isLoading || sessionGames === null) {
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
                <Picker.Item label="All" value="0" />
                <Picker.Item label="Available" value="1" />
                <Picker.Item label="Reserved" value="2" />
              </Picker>
            </FormControl>
          </Box>
        </ThemedView>
      </Stack>

      <Stack className="flex flex-col items-center justify-center p-4">
        <Box>
          <ThemedView>
            <ThemedText>
              <List>
                {filteredSessions?.map((sessionGame) => (
                  <ListItem key={sessionGame.segId}>
                    <ThemedView>
                      <ItemDisplay
                        letter={sessionGame.segId.toString()}
                        name={sessionGame.isReserved ? 'Reserved' : 'Available'}
                        header={FormUtils.FormatDate(sessionGame.gameDate.toString())}
                        onClick={() => router.push({
                          pathname: `/Organisation/SessionGame/SessionGameDetails`,
                          params: { id: sessionGame.segId.toString() }
                        })}
                      />
                    </ThemedView>
                  </ListItem>
                ))}
              </List>
            </ThemedText>
          </ThemedView>
        </Box>
      </Stack>
    </AppView>
  );
}
