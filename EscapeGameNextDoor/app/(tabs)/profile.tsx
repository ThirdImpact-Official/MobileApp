import React, { useState, useEffect, useRef } from "react";
import {
  useColorScheme,
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ReservationListe } from "@/app/Profile/Reservation/Reservation";
import { useAuth } from "@/context/ContextHook/AuthContext";
import ProfileComponent from "../Profile/ProfileComponent";
import GenericTabs from "@/components/factory/GenericComponent/TabGénéric";
import FavorisComponent from "../Profile/Favoris/Favoris";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { UnitofAction } from "@/action/UnitofAction";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { GetSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto";
import { testEscapeGames } from "@/TestData/EscapeGametestData";
import { testReservations } from "@/TestData/ReservationData";
import AppView from "@/components/ui/AppView";
import { ThemedView } from "@/components/ThemedView";

export default function Profile() {
  const theme = useColorScheme() ?? "light";
  const authContext = useAuth();
  const [isauthenticated, setIsAuthenticated] = useState<Boolean>(authContext.isAuthenticated);
  const [loading, setLoading] = useState(authContext.isLoading);
  const [user, setUser] = useState<GetUserDto>(authContext.user);
  const [favoris, setFavoris] = useState<GetEscapeGameDto[]>(testEscapeGames);
  const [reservation, setReservation] = useState<GetSessionReservedDto[]>(testReservations);

  const toasted = useToasted();
  const httpAction = new UnitofAction();

  const tabsRef = useRef<{ changeTab: (index: number) => void } | null>(null);
  const goToTab = (index: number) => {
    if (tabsRef.current) {
      tabsRef.current.changeTab(index);
    }
  };

  const Tabitem = [
    {
      label: "Favoris",
      content: <FavorisComponent item={favoris} />,
    },
    {
      label: "Reservation",
      content: <ReservationListe reservationcolumns={reservation} />,
    },
  ];

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      const userProfile = await httpAction.userAction.GetCurrentUser();
      if (userProfile.Success) {
        console.log("User profile fetched successfully:", userProfile.Data);
        setUser(userProfile.Data as GetUserDto);
        setIsAuthenticated(true);
        toasted.showToast("User profile loaded successfully.", "success");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toasted.showToast("Failed to load user profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsAuthenticated(authContext.isAuthenticated);
    setLoading(authContext.isLoading);
  }, [authContext.isAuthenticated, authContext.isLoading]);

  useEffect(() => {
    if (isauthenticated) {
      fetchUserProfile();
    }
  }, [isauthenticated]);

  if (loading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView>

        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
          <Text>Chargement...</Text>
        </View>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={styles.profileWrapper}>
          <ProfileComponent user={user} />
        </ThemedView>

        <ThemedView style={styles.tabsWrapper}>
          <GenericTabs tabs={Tabitem} defaultTab={0} ChangeTab={goToTab} ref={tabsRef} />
        </ThemedView>
      </ScrollView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileWrapper: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  tabsWrapper: {
    width: "100%",
    position: "relative",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
