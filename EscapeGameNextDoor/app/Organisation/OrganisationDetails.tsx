import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UnitofAction } from "@/action/UnitofAction";
import { GetOrganisationDto } from "@/interfaces/OrganisationInterface/Organisation/getOrganisationDto";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import AppView from "@/components/ui/AppView";
import { Card } from 'react-native-paper';
import { Collapsible } from "@/components/Collapsible";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
export default function OrganisationDetails() {
  const { id } = useLocalSearchParams();
  const action = new UnitofAction();
  const [organisation, setOrganisation] = useState<GetOrganisationDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const notif = useToasted();
  const router = useRouter();

  const fetchOrganisation = async () => {
    try {
      const response = await action.organisationAction.GetOrganisationById(Number(id));
      if (response.Success) {
        // Assuming response.Data is of type GetOrganisationDto
        if (!response.Data) {
          throw new Error("Organisation not found");
        }
        setOrganisation(response.Data as GetOrganisationDto);
        notif.showToast(response.Message, "success");
      } else {
        notif.showToast(response.Message, "error");
      }
    } catch (e) {
      console.error(e);
      notif.showToast("Erreur lors de la récupération de l'organisation", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisation();
  }, [id]);

  if (isLoading) {
    return (
      <AppView>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </AppView>
    );
  }

      <><AppView>
    <View style={styles.center}>
      <Text>Aucune organisation trouvée.</Text>
    </View>
  </AppView><Text>Aucune organisation trouvée.</Text></>
  if (!organisation) {
    return (
      <AppView>
        <View style={styles.center}>
          <Text>Aucune organisation trouvée.</Text>
        </View>
      </AppView>
    );
  }
  if (isError) {
    return (
      <AppView>
        <View style={styles.center}>
          <Text>Erreur lors de la récupération de l'organisation.</Text>
        </View>
      </AppView>
    );
  }
else{

  return (
    <AppView >
      <Card style={styles.card}>
        {organisation.logo ? (
          <Card.Cover source={{ uri: organisation.logo }} style={styles.image} />
        ) : null}
        <Card.Title title={organisation.name} titleStyle={styles.title} />
        <Card.Content style={styles.infoContainer}>
          <Text style={styles.info}>{organisation.description}</Text>
          <Text style={styles.info}>{organisation.email}</Text>
          <Text style={styles.info}>{organisation.phoneNumber}</Text>
          <Text style={styles.info}>{organisation.address}</Text>
          <Text style={styles.info}>Créée le : {organisation.creationDate}</Text>
          <Text style={styles.info}>ID : {organisation.orgId}</Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <TouchableOpacity style={styles.button} 
          onPress={() => { /* TODO: action Escape Game */ 
            router.push({
              pathname: "/Organisation/EscapeGame/EscapeGameOrganisation",
              params: { id: String(organisation.orgId) },
            });
          }}>
            <Text style={styles.buttonText}>Escape Game</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/Notification/Annonce/AnnonceOrganisation",
                params: { id: String(organisation.orgId) },
              })
            }
          >
            <Text style={styles.buttonText}>Annonce</Text>
          </TouchableOpacity>
        </Card.Actions>
        <Card.Content>
        
            <Collapsible title="Adresse GPS " isThemed={false} headerStyle={{ marginTop: 10 }}>
              <Text>Contenu collapsible</Text>
            </Collapsible>
          
        </Card.Content>
      </Card>
    </AppView>
  );
}
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ccc",
    marginHorizontal: 12,
  },
});
