import { StyleSheet, Image, Platform } from 'react-native';
import { Box, FormControl, List, ListItem, Pagination, Paper, Stack, Typography,Button } from '@mui/material';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ActivityIndicator, Text } from 'react-native';
import { useAuth } from '@/context/ContextHook/AuthContext';
import HelloWave from '../../components/HelloWave';
import AppView from '@/components/ui/AppView';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { UnitofAction } from '@/action/UnitofAction';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { GetOrganisationDto } from '@/interfaces/OrganisationInterface/Organisation/getOrganisationDto';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { GetPriceDto } from '@/interfaces/EscapeGameInterface/Price/getPriceDto';
import { GetDifficultyLevelDto } from '@/interfaces/EscapeGameInterface/DifficultyLevel/getDifficultyLevelDto';
import { GetCategoryDto } from '@/interfaces/EscapeGameInterface/Category/getCategoryDto';
export default function TabTwoScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isorganisation, setIsOrganisation] = useState<boolean>(false);

  const HandleOrganisationSearch = () => {
    setIsOrganisation(true);
  }
  /**
   * Handles the research of escape games by setting the state to indicate 
   * that the current selection is not an organisation. This function updates 
   * the state to reflect that the user is focusing on escape games rather 
   * than organisations.
   */

  const handleEscapeGameResearch = () => {
    setIsOrganisation(false);
  }

  if (isLoading) {
    return (
      <AppView>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text> Loading...</Text>
        <Text>Chargement...</Text>
      </AppView>
    );
  } else if (!isAuthenticated) {
    // Add content for unauthenticated users
    return (
      <AppView>

        <ThemedView style={styles.headerImage}>
          <ThemedText style={styles.titleContainer}>Please Log In</ThemedText>
          <ThemedText>You need to be authenticated to view this content</ThemedText>
          <HelloWave />
        </ThemedView>
      </AppView>);

  } else {
    // Content for authenticated users
    return (
      <AppView>
        <Box className="flex flex-row justify-center items-center space-x-4 gap-4 p-4 ">
          <Box
            className='border  rounded-sm'
            onClick={() => handleEscapeGameResearch()}
          >
            <ThemedText type='title'
              className='p-4' >
              Escapegames
            </ThemedText>
          </Box>
          <Box
            className='border rounded-sm'
            onClick={() => HandleOrganisationSearch()}
          >
            <ThemedText type='title' className='p-4'>
              Organisation
            </ThemedText>
          </Box>
        </Box>
        <Box className="flex flex-row justify-center items-center p-4 space-x-4">
          <ThemedView>
            {
              isorganisation ? <OrganisationSelection /> : <EscapeGameSelection />
            }
          </ThemedView>
        </Box>
      </AppView>
    );
  }
}

export function OrganisationSelection() {
  const httpaction = new UnitofAction();
  const [organisation, setOrgansiation] = useState<GetOrganisationDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  //select
  const [isfiltered, setIsfiltered] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const router = useRouter();
  const httpAction = new UnitofAction();
  const fetchOrganisation = async () => {
    try {
      const response =
        await httpAction.organisationAction.GetAllOrganisation(page, 5);
      if (response.Success) {
        setOrgansiation(response.Data as GetOrganisationDto[]);
        setTotalPages(response.TotalPage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
  const resetfilter = () => {
    setIsfiltered(false);
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }
  useEffect(() => {
    fetchOrganisation();
  }, [page]);
  return (
    <>
      <Stack>

        <Paper elevation={2}
          className='p-4 m-4'>
          <Box className="flex flex-row justify-center items-center space-x-4 m-4">
            <Picker>
              <Picker.Item label="Organisation" value="organisation" />
            </Picker>
            <Picker>
              <Picker.Item label="Organisation" value="organisation" />
            </Picker>
            <FormControl>
              <Button onClick={resetfilter} >Reset</Button>
            </FormControl>
          </Box>
          <Box>
            <List>

            </List>
            {!isLoading && organisation.map((escapeGame) => (
              <ListItem key={escapeGame.orgId}>
                <ItemDisplay
                  key={escapeGame.orgId}
                  name={escapeGame.name}
                  header={escapeGame.address}
                  img={escapeGame.logo}
                   onClick={()=>{router.push(
                      {
                        pathname: `/Organisation/OrganisationDetails`,
                        params: { id: escapeGame.orgId.toString() }
                      }
                    )}}
                />
              </ListItem>
            ))}
            <Pagination
              className='pt-4'
              page={page}
              count={totalPages}
              onChange={handlePageChange}
            />
          </Box>
        </Paper>
      </Stack>
    </>
  )
}
export function EscapeGameSelection() {
  const [escapeGames, setEscapeGames] = useState<GetEscapeGameDto[]>([]);
  const [price, setPrice] = useState<GetPriceDto[]>([]);
  const [difficulty, setDifficulty] = useState<GetDifficultyLevelDto[]>([]);
  const [category, setCategory] = useState<GetCategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //select
  const [isfiltered, setIsfiltered] = useState<boolean>(false);

  const [selectCategory, setSelectCategory] = useState<GetCategoryDto | null>(null);
  const [selectPrice, setSelectPrice] = useState<GetPriceDto | null>(null);
  const [selectDifficulty, setSelectDifficulty] = useState<GetDifficultyLevelDto | null>(null);
  //
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const httpAction = new UnitofAction();
  const router = useRouter();
  /**
   * 
   */
  const fetchEscapeGames = async () => {
    try {

      const response: PaginationResponse<GetEscapeGameDto> =
        await httpAction.escapeGameAction.getAllEscapeGames(page, 5);
      if (response.Success) {
        setEscapeGames(response.Data as GetEscapeGameDto[]);
        setTotalPages(response.TotalPage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * 
   * @param page 
   * @param catId 
   * @param priceId 
   * @param diflId 
   */
  const fetchEscapeGamesFiltered = async (
    page: number,
    catId: number | null = null,
    priceId: number | null = null,
    diflId: number | null = null
  ) => {
    try {
      setIsLoading(true);
      const response =
        await httpAction.escapeGameAction.GetAllEscapeGames(catId, priceId, diflId, page, 5);

      if (response.Success) {
        setEscapeGames(response.Data as GetEscapeGameDto[]);
        setTotalPages(response.TotalPage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * fetch category
   */
  const fetchAllCategory = async () => {
    try {
      const response = await httpAction.categoryAction.getAllCategories();
      if (response.Success) {

        setCategory(response.Data as GetCategoryDto[]);
      }
    }
    catch (e) {
      console.error(e);
    }
  }
  /**
   * fetch price indicator
   */
  const fetchPriceindicator = async () => {
    try {
      const response = await httpAction.escapeGameAction.GetPriceIndice();
      if (response.Success) {
        setPrice(response.Data as GetPriceDto[]);
      }

    }
    catch (e) {
      console.error(e);
    }
  }
  /**
   * fetch difficultylevel
   */
  const fetchDifficultylevel = async () => {
    try {
      const response = await httpAction.escapeGameAction.GetDifficultyLevelDto();
      if (response.Success) {
        setDifficulty(response.Data as GetDifficultyLevelDto[]);
      }
    }
    catch (e) {
      console.error(e);
    }
  }
  /**
   * reset filter
   */
  const resetFilter=()=>{
    setIsfiltered(false);
    setSelectCategory(null);
    setSelectPrice(null);
    setSelectDifficulty(null);
  }
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }
  useEffect(() => {
    fetchAllCategory();
    fetchPriceindicator();
    fetchDifficultylevel();
  }, []);

  useEffect(() => {
    if(!isfiltered)
    {
      fetchEscapeGamesFiltered(page, selectCategory?.catId, selectPrice?.id, selectDifficulty?.dowId);
    }
    else{
      fetchEscapeGames();
    }
  }, [page, selectCategory, selectPrice, selectDifficulty]);
  return (
    <>
      <Stack>

        <Paper elevation={2} className="p-4 m-4">
          <Box className="flex flex-row justify-center items-center space-x-4 m-4">
            <Picker
              onValueChange={(value) => {
                setSelectCategory(value as GetCategoryDto);
                setIsfiltered(true);
              }}

            >
              {
                category.map((category) => (

                  <Picker.Item label={category.catName} value={category} />
                ))
              }
            </Picker>
            <Picker
              onValueChange={(value) => {
                setSelectPrice(value as GetPriceDto);
                  setIsfiltered(true);
              }}
            >
              {
                price.map((priceindicator) => (
                  <Picker.Item label={priceindicator.indicePrice.toString()} value={priceindicator.id} />
                ))
              }

            </Picker>
            <Picker
              onValueChange={(value) => {
                setSelectDifficulty(value as GetDifficultyLevelDto);
                  setIsfiltered(true);
              }}
            >
              {
                difficulty.map((difficultylevel) => (
                  <Picker.Item label={difficultylevel.dowName} value={difficultylevel.dowId} />
                ))
              }
            </Picker>
            <FormControl>
              <Button onClick={resetFilter}>Reset</Button>
            </FormControl>
          </Box>
          <Box >
            <List className='space-y-4'>

              {!isLoading && escapeGames.map((escapeGame) => (
                <ListItem>

                  <ItemDisplay

                    key={escapeGame.esgId}
                    name={escapeGame.esgNom}
                    header={escapeGame.esgContent}
                    img={escapeGame.esgImgResources}
                    onClick={()=>{router.push(
                      {
                        pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
                        params: { id: escapeGame.esgId.toString() }
                      }
                    )}}
                  />
                </ListItem>
              ))}
            </List>
            <Pagination
              className='pt-4'
              page={page}
              count={totalPages}
              onChange={handlePageChange}
            />
          </Box>
        </Paper>
      </Stack>
    </>
  );
}
const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
