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
import { useAuth } from "@/context/ContextHook/AuthContext";
import GenericTabs from "@/components/factory/GenericComponent/TabGénéric";
import FavorisComponent from "../Profile/Favoris/Favoris";
import { UnitofAction } from "@/action/UnitofAction";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { GetSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto";
import AppView from "@/components/ui/AppView";
import { ThemedView } from "@/components/ThemedView";
import ReservationList from "@/app/Profile/Reservation/Reservation";
import { Card, Button, Modal, Avatar, Divider } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { ThemedText } from "@/components/ThemedText";
import { UpdatePictureDto } from "@/interfaces/User/UpdateUserDto";
import CompletedList from "../Profile/CompletedGame/CompletedGameList";

export default function ProfileScreen() {
  const theme = useColorScheme() ?? "light";
  const authContext = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authContext.isAuthenticated);
  const [loading, setLoading] = useState<boolean>(authContext.isLoading);
  const [user, setUser] = useState<GetUserDto | null>(authContext.user);
  const [favorites, setFavorites] = useState<GetEscapeGameDto[]>([]);
  const [reservations, setReservations] = useState<GetSessionReservedDto[]>([]);
  
  const toasted = useToasted();
  const httpAction = new UnitofAction();

  const tabsRef = useRef<{ changeTab: (index: number) => void } | null>(null);
  
  const goToTab = (index: number) => {
    tabsRef.current?.changeTab(index);
  };

  const TabItems = [
    {
      label: "Favoris",
      content: <FavorisComponent item={favorites} />,
    },
    {
      label: "Reservation",
      content: <ReservationList />,
    },
    {
      label: "Achievement",
      content: <CompletedList/>,
    }
  ];

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await httpAction.userAction.GetCurrentUser();
      if (userProfile.Success && userProfile.Data) {
        setUser(userProfile.Data as GetUserDto);
        setIsAuthenticated(true);
        toasted.showToast("Profile loaded successfully", "success");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toasted.showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const favoritesResponse = await httpAction.favorisAction.getFavoris();
      if (favoritesResponse.Success && favoritesResponse.Data) {
        setFavorites(favoritesResponse.Data as GetEscapeGameDto[]);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toasted.showToast("Failed to load favorites", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const reservationsResponse = await httpAction.sessionAction.getSessionReservedByUser(0, 5);
      if (reservationsResponse.Success && reservationsResponse.Data) {
        setReservations(reservationsResponse.Data as GetSessionReservedDto[]);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toasted.showToast("Failed to load reservations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsAuthenticated(authContext.isAuthenticated);
    setLoading(authContext.isLoading);
    setUser(authContext.user);
  }, [authContext]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
      fetchFavorites();
      fetchReservations();
    }
  }, [isAuthenticated]);

  // Image picker modal state
  const [visible, setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    type?: string;
    name?: string;
  } | null>(null);

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.error("ImagePicker error:", response.errorMessage);
          return;
        }

        if (response.assets?.[0]) {
          const asset = response.assets[0];
          setSelectedFile({
            uri: asset.uri || "",
            type: asset.type,
            name: asset.fileName ?? "profile.jpg",
          });
        }
      }
    );
  };

  const uploadImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("picture", {
      uri: selectedFile.uri,
      type: selectedFile.type || 'image/jpeg',
      name: selectedFile.name || 'profile.jpg',
    } as any);

    try {
      await httpAction.userAction.UpdatePicture(formData);
      await fetchUserProfile(); // Refresh user data
      handleClose();
      toasted.showToast("Profile picture updated", "success");
    } catch (err) {
      console.error("Upload error:", err);
      toasted.showToast("Failed to update picture", "error");
    }
  };

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
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={styles.centered}>
        <Text>No user data available</Text>
      </ThemedView>
    );
  }

  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Integrated ProfileComponent directly */}
        <Card style={styles.card}>
          <Card.Title
            title={user.username}
            subtitle={new Date().toLocaleString()}
          />
          <Card.Content>
            <View style={styles.authorContainer}>
              <TouchableOpacity onPress={handleOpen}>
                <Avatar.Image
                  size={80}
                  source={
                    user.picture
                      ? { uri: user.picture }
                      : require("@/assets/images/react-logo.png")
                  }
                />
              </TouchableOpacity>
              <View style={styles.authorNameContainer}>
                <ThemedText style={styles.text}>Nom</ThemedText>
                <ThemedText style={styles.nameText}>
                  {user.firstName} {user.lastName}
                </ThemedText>
                <Divider style={styles.divider} />
                <ThemedText style={styles.text}>Mail</ThemedText>
                <ThemedText style={styles.emailText}>{user.email}</ThemedText>
              </View>
            </View>
          </Card.Content>
         
        </Card>

        <ThemedView style={styles.tabsWrapper}>
          <GenericTabs 
            tabs={TabItems} 
            defaultTab={0} 
            ChangeTab={goToTab} 
            ref={tabsRef} 
          />
        </ThemedView>
      </ScrollView>

      <Modal 
        visible={visible} 
        onDismiss={handleClose} 
        contentContainerStyle={styles.modal}
      >
        <Card>
          <Card.Title 
            title="Change Profile Picture" 
            right={() => (
              <Button onPress={handleClose}>Close</Button>
            )}
          />
          <Card.Cover 
            source={
              selectedFile ? 
              { uri: selectedFile.uri } : 
              require('@/assets/images/react-logo.png')
            }  
          />
          <Card.Content style={styles.modalContent}>
            <Button 
              mode="contained" 
              onPress={pickImage}
              style={styles.modalButton}
            >
              Choose Image
            </Button>
            {selectedFile && (
              <Text style={styles.fileName}>{selectedFile.name}</Text>
            )}
          </Card.Content>
          <Card.Actions>
            <Button 
              onPress={uploadImage}
              disabled={!selectedFile}
            >
              Save
            </Button>
            <Button onPress={handleClose}>Cancel</Button>
          </Card.Actions>
        </Card>
      </Modal>
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
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    marginBottom: 20,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
  },
  authorNameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  text: {
    paddingStart: 10,
    paddingEnd: 10,
    color: '#666',
  },
  nameText: {
    paddingStart: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailText: {
    paddingStart: 10,
    fontSize: 14,
  },
  divider: {
    marginVertical: 8,
  },
  actions: {
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: 8,
  },
  tabsWrapper: {
    width: "100%",
  },
  modal: {
 
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalContent: {
    paddingVertical: 16,
  },
  modalButton: {
    marginVertical: 8,
  },
  fileName: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
});