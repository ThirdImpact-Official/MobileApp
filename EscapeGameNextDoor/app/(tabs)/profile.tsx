import { Collapsible } from "@/components/Collapsible";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme, View, Image, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useMemo, useState, useRef } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ReservationListe } from "@/app/Profile/Reservation/Reservation";
import Login from "../Authentication/Login";
import { AuthProvider, useAuth } from "@/context/ContextHook/AuthContext";
import { Box, CircularProgress, Grid } from '@mui/material';
import { AuthContext } from '../../context/ContextHook/AuthContext';
import ProfileComponent from "../Profile/ProfileComponent";
import Item from '../../components/factory/GenericComponent/Item';
import GenericTable from "@/components/factory/GenericComponent/GenericTable";
import GenericTabs from "@/components/factory/GenericComponent/TabGénéric";
import FavorisComponent from "../Profile/Favoris/Favoris";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { useEffect } from "react";
import { UnitofAction } from "@/action/UnitofAction";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { GetSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto";
import { testEscapeGame, testEscapeGames } from "@/TestData/EscapeGametestData";
import { testReservations } from "@/TestData/ReservationData";
import AppView from "@/components/ui/AppView";

export default function Profile() {
  const theme = useColorScheme() ?? 'light';
  const AuthContext = useAuth();
  const [isauthenticated, setIsAuthenticated] = useState<Boolean>(AuthContext.isAuthenticated);
  const [loading, setLoading] = useState(AuthContext.isLoading);
  const [user, setuser] = useState<GetUserDto>(AuthContext.user);
  // favoris 
  const [favoris, setFavoris] = useState<GetEscapeGameDto[]>(testEscapeGames);
  const [reservation, setReservation] = useState<GetSessionReservedDto[]>(testReservations);
  //action 
  const toasted = useToasted();
  const httpAction = new UnitofAction();

  const tabsRef = useRef<{ changeTab: (index: number) => void } | null>(null);
  const goToTab = (index: number) => {
    if (tabsRef.current) {
      tabsRef.current.changeTab(index);
    }
  };
  const Tabitem =
    [
      {
        label: 'Favoris',
        content: <FavorisComponent item={favoris} />,
      },
      {
        label: 'Reservation',
        content: <ReservationListe reservationcolumns={reservation} />,
      },
    ];

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      const userProfile = await httpAction.userAction.GetCurrentUser();
      if (userProfile.Success) {
        console.log("User profile fetched successfully:", userProfile.Data);
        setuser(userProfile.Data as GetUserDto);
        setIsAuthenticated(true);
        toasted.showToast("User profile loaded successfully.", "success");
      }
    }
    catch (error) {
      console.error("Error fetching user profile:", error);
      toasted.showToast("Failed to load user profile.", "error");
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setIsAuthenticated(AuthContext.isAuthenticated);
    setLoading(AuthContext.isLoading);
  }, [AuthContext.isAuthenticated, AuthContext.isLoading]);

  useEffect(() => {
    fetchUserProfile();

  }, [isauthenticated]);


  if (loading) {
    return (<>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Image source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo} />}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text> Loading...</Text>
        <Text>Chargement...</Text>
      </ParallaxScrollView>
    </>)
  }
  else {
    return (

      <AppView>

        <Grid className="flex flex-col items-center" container>
          <Box sx={{ width:"100%", display:"flex",justifyContent:"center",alignItems:"center" }} >

            <Grid size="auto"
              direction={"row"} >
              <ProfileComponent user={user} />
            </Grid>
          </Box>
          <Box sx={{ 
              position: 'relative',
              width:"100%",
              bottom: 0,
              zIndex: 10,
              display:"flex",
              justifyContent:"center",
              alignItems:"center" }}>

            <Grid size="auto" 
              direction="row" >
              <GenericTabs tabs={Tabitem} defaultTab={0} ChangeTab={goToTab} />
            </Grid>
          </Box>
        </Grid>
      </AppView>

);
  }
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
