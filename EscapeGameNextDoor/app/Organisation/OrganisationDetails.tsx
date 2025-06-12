import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UnitofAction } from "@/action/UnitofAction";
import { GetOrganisationDto } from "@/interfaces/OrganisationInterface/Organisation/getOrganisationDto";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import AppView from "@/components/ui/AppView";

export default function OrganisationDetails() {
  const { id } = useLocalSearchParams();
  const action = new UnitofAction();
  const [organisation, setOrganisation] = useState<GetOrganisationDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const notif = useToasted();
  const router = useRouter();

  const fetchOrganisation = async () => {
    try {
      const response = await action.organisationAction.GetOrganisationById(Number(id));
      if (response.Success) {
        setOrganisation(response.Data as GetOrganisationDto);
        notif.isvisible = true;
        notif.showToast(response.Message, "success");
      } else {
        notif.isvisible = true;
        notif.showToast(response.Message, "error");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisation();
  }, [id]);

  if (isLoading) {
    return (
      <AppView style={styles.center}>
        <ActivityIndicator size="large" />
      </AppView>
    );
  }

  if (!organisation) {
    return (
      <AppView style={styles.center}>
        <Text>Aucune organisation trouvée.</Text>
      </AppView>
    );
  }

  return (
    <AppView style={styles.container}>
      <View style={styles.card}>
        {organisation.logo ? (
          <Image source={{ uri: organisation.logo }} style={styles.image} />
        ) : null}
        <Text style={styles.title}>{organisation.name}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.info}>{organisation.description}</Text>
          <Text style={styles.info}>{organisation.email}</Text>
          <Text style={styles.info}>{organisation.phoneNumber}</Text>
          <Text style={styles.info}>{organisation.address}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={() => { /* TODO: action Escape Game */ }}>
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
        </View>
      </View>
    </AppView>
  );
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
