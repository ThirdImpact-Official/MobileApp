import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UnitofAction } from "@/action/UnitofAction";
import { GetAnnonceDto } from "@/interfaces/NotificationInterface/Annonce/getAnnonceDto";
import AppView from "@/components/ui/AppView";

export default function AnnonceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const action = new UnitofAction();

  const [annonce, setAnnonce] = useState<GetAnnonceDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnnonceDetails = async () => {
    try {
      const response = await action.annonceAction.getAnnonceById(Number(id));
      if (response.Success) {
        setAnnonce(response.Data as GetAnnonceDto);
      } else {
        console.warn("Erreur:", response.Message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnnonceDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <AppView>
        <ActivityIndicator size="large" />
      </AppView>
    );
  }

  if (!annonce) {
    return (
      <AppView>
        <View style={styles.center}>
          <Text>Aucune annonce trouvée.</Text>
        </View>
      </AppView>
    );
  }

  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Annonce</Text>
        <Text style={styles.label}>Titre :</Text>
        <Text style={styles.content}>{annonce.name ?? "-"}</Text>

        <Text style={styles.label}>Description :</Text>
        <Text style={styles.content}>{annonce.description ?? "-"}</Text>

        {/* Ajoute d'autres champs selon la structure de GetAnnonceDto */}
      </ScrollView>
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
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
  },
  content: {
    fontSize: 16,
  },
});
