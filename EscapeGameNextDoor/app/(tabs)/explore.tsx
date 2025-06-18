import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, TextStyle } from 'react-native';
import { Button} from "react-native-paper"
import { useAuth } from '@/context/ContextHook/AuthContext';
import HelloWave from '../../components/HelloWave';
import AppView from '@/components/ui/AppView';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { UnitofAction } from '@/action/UnitofAction';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { GetOrganisationDto } from '@/interfaces/OrganisationInterface/Organisation/getOrganisationDto';
import { router, useRouter } from 'expo-router';
import { GetPriceDto } from '@/interfaces/EscapeGameInterface/Price/getPriceDto';
import { GetDifficultyLevelDto } from '@/interfaces/EscapeGameInterface/DifficultyLevel/getDifficultyLevelDto';
import { GetCategoryDto } from '@/interfaces/EscapeGameInterface/Category/getCategoryDto';
import React from 'react';
import { Card, TextInput } from 'react-native-paper';
import { PaginationResponse } from '@/interfaces/ServiceResponse';
import { useCallback } from 'react';
import { Margin } from '@mui/icons-material';
import { ThemedText } from '@/components/ThemedText';
export default function TabTwoScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isOrganisation, setIsOrganisation] = useState(false);
  const router = useRouter();
  if (isLoading) {
    return (
      <AppView>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
        <Text>Chargement...</Text>
      </AppView>
    );
  } else if (!isAuthenticated) {
    return (
      <AppView>
        <View style={styles.headerImage}>
          <Text style={styles.titleContainer}>Please Log In</Text>
          <Text>You need to be authenticated to view this content</Text>
          <TouchableOpacity onPress={() => router.push('/Authentication/Login')}>
            <Text style={{ color: 'blue' }}>Log In</Text>
          </TouchableOpacity>
          <HelloWave />
        </View>
      </AppView>
    );
  } else {
    return (
      <AppView>
        <View style={styles.switchContainer}>
          <TouchableOpacity style={styles.switchButton} onPress={() => setIsOrganisation(false)}>
            <Text style={styles.switchText}>Escapegames</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchButton} onPress={() => setIsOrganisation(true)}>
            <Text style={styles.switchText}>Organisation</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {isOrganisation ? <OrganisationSelection /> : <EscapeGameSelection />}
        </View>
      </AppView>
    );
  }
}
function OrganisationSelection() {
  const httpAction = new UnitofAction();
  const router = useRouter();
  const [organisations, setOrganisations] = useState<GetOrganisationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrganisations = async (currentPage: number, searchValue: string) => {
    setIsLoading(true);
    try {
      const response = searchValue.trim()
        ? await httpAction.organisationAction.GetOrganisationbyName(searchValue, currentPage, 5) as PaginationResponse<GetOrganisationDto>
        : await httpAction.organisationAction.GetAllOrganisation(currentPage, 5) as PaginationResponse<GetOrganisationDto>;

      if (response.Success) {
        setOrganisations(response.Data as GetOrganisationDto[]);
        setTotalPages(response.TotalPage);
      }
    } catch (error) {
      console.error('Error fetching organisations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setPage(1);
    await fetchOrganisations(1, searchTerm);
  };

  const handlePageChange = async (newPage: number) => {
    setPage(newPage);
    await fetchOrganisations(newPage, searchTerm);
  };

  useEffect(() => {
    fetchOrganisations(page, searchTerm);
  }, []);

  return (
    <ScrollView>
      <Card style={styles.cardContainer}>
        <Card.Title title="filter" titleStyle={styles.cardText} />
        <Card.Content>
          <View style={styles.filterRow}>
            <View style={{ flex: 1 }}>
              <TextInput
                label="Organisation"
                value={searchTerm}
                mode='outlined'
                style={styles.textinput}
                onChangeText={setSearchTerm}
              />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Button onPress={handleSearch} ><Text>
                Recherche
                </Text>
                </Button>
            </View>
          </View>
        </Card.Content>
      </Card>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        organisations.map((org) => (
          <TouchableOpacity
            key={org.orgId}
            style={{ marginBottom: 16 }}
            onPress={() => router.push({
              pathname: `/Organisation/OrganisationDetails`,
              params: { id: org.orgId.toString() }
            })}
          >
            <ItemDisplay
              name={org.name}
              header={org.addresseId.toString()}
              img={org.logo}
              onClick={() => router.push({
                pathname: `/Organisation/OrganisationDetails`,
                params: { id: org.orgId.toString() }
              })}
            />
          </TouchableOpacity>
        ))
      )}

      <View style={styles.paginationRow}>
        <View style={{ flex: 1 }}>

          <Button
          
            disabled={page <= 1}
            onPress={() => handlePageChange(page - 1)}
          >Précédent</Button>
          <Text style={{textAlign:"center"}}>{page} / {totalPages}</Text>
          <Button
          
            disabled={page >= totalPages}
            onPress={() => handlePageChange(page + 1)}
          >Suivant</Button>
        </View>
      </View>
    </ScrollView>
  );
}

function EscapeGameSelection() {
  const [escapeGames, setEscapeGames] = useState<GetEscapeGameDto[]>([]);
  const [price, setPrice] = useState<GetPriceDto[]>([]);
  const [difficulty, setDifficulty] = useState<GetDifficultyLevelDto[]>([]);
  const [category, setCategory] = useState<GetCategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectCategory, setSelectCategory] = useState<number | null>(null);
  const [selectPrice, setSelectPrice] = useState<number | null>(null);
  const [selectDifficulty, setSelectDifficulty] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const httpAction = new UnitofAction();
  const router = useRouter();

  const fetchEscapeGames = async () => {
    setIsLoading(true);
    try {
      const response = await httpAction.escapeGameAction.getAllEscapeGames(page, 5);
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

  const fetchEscapeGamesFiltered = async () => {
    setIsLoading(true);
    try {
      const response = await httpAction.escapeGameAction.GetAllEscapeGames(
        selectCategory,
        selectPrice,
        selectDifficulty,
        page,
        5
      );
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

  useEffect(() => {
    // fetch categories, prices, difficulties
    (async () => {
      try {
        const catRes = await httpAction.categoryAction.getAllCategories();
        if (catRes.Success) setCategory(catRes.Data as GetCategoryDto[]);
        const priceRes = await httpAction.escapeGameAction.GetPriceIndice();
        if (priceRes.Success) setPrice(priceRes.Data as GetPriceDto[]);
        const diffRes = await httpAction.escapeGameAction.GetDifficultyLevelDto();
        if (diffRes.Success) setDifficulty(diffRes.Data as GetDifficultyLevelDto[]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (isFiltered) {
      fetchEscapeGamesFiltered();
    } else {
      fetchEscapeGames();
    }
  }, [page, selectCategory, selectPrice, selectDifficulty, isFiltered]);

  const resetFilter = () => {
    setIsFiltered(false);
    setSelectCategory(null);
    setSelectPrice(null);
    setSelectDifficulty(null);
  };

  return (
    <ScrollView>
      <Card style={styles.cardContainer}>
        <Card.Title title="Filtre" titleStyle={styles.cardText} />
        <Card.Content>
          <View style={styles.filterRow}>
            <View style={{ flex: 1 }}>

              <Picker
                selectedValue={selectCategory}
                style={styles.picker}
                onValueChange={(value) => {
                  setSelectCategory(value);
                  setIsFiltered(true);
                }}
              >
                <Picker.Item label="Catégorie" value={null} />
                {category.map((cat) => (
                  <Picker.Item key={cat.catId} label={cat.catName} value={cat.catId} />
                ))}
              </Picker>
              <Picker
                selectedValue={selectPrice}
                style={styles.picker}
                onValueChange={(value) => {
                  setSelectPrice(value);
                  setIsFiltered(true);
                }}
              >
                <Picker.Item label="Prix" value={null} />
                {price.map((p) => (
                  <Picker.Item key={p.id} label={p.indicePrice.toString()} value={p.id} />
                ))}
              </Picker>
              <Picker
                selectedValue={selectDifficulty}
                style={styles.picker}
                onValueChange={(value) => {
                  setSelectDifficulty(value);
                  setIsFiltered(true);
                }}
              >
                <Picker.Item label="Difficulté" value={null} />
                {difficulty.map((d) => (
                  <Picker.Item key={d.dileId} label={d.dileName} value={d.dileId} />
                ))}
              </Picker>
              <Button  onPress={resetFilter} ><Text>Reset</Text></Button>
            </View>
          </View>
        </Card.Content>
      </Card>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        escapeGames.map((escapeGame) => (
          <TouchableOpacity
            key={escapeGame.esgId}
            onPress={() =>
              router.push({
                pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
                params: { id: escapeGame.esgId.toString() },
              })
            }
            style={{ marginBottom: 16 }}
          >
            <ItemDisplay
              name={escapeGame.esgTitle}
              header={escapeGame.esgContent}
              img={escapeGame.esgImgResources}
              onClick={() =>
                router.push({
                  pathname: `/Organisation/EscapeGame/EscapeGameDetails`,
                  params: { id: escapeGame.esgId.toString() },
                })
              }
            />
          </TouchableOpacity>
        ))
      )}
      <View style={styles.paginationRow}>
        <View style={{ flex: 1 }}>

          <Button  disabled={page <= 1} onPress={() => setPage(page - 1)} ><Text>Précedent</Text></Button>
          <ThemedText style={{textAlign:"center"}}>
            {page} / {totalPages}
          </ThemedText>
          <Button  disabled={page >= totalPages} onPress={() => setPage(page + 1)} ><Text>Suivant</Text></Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  cardText: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",

  },
  cardContainer: {
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    fontWeight: 'bold',
    fontSize: 18,
  },
  textinput: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  switchButton: {
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 8,
    padding: 12,
    backgroundColor: '#eee',
  },
  switchText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterRow: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    justifyContent: 'space-between',
  },
  picker: {
    flex: 1,
    height: 40,
    marginHorizontal: 4,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    gap: 8,
  },
});
