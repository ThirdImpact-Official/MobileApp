import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UnitofAction } from "@/action/UnitofAction";
import { GetAnnonceDto } from "@/interfaces/NotificationInterface/Annonce/getAnnonceDto";
import AppView from "@/components/ui/AppView";
import { Card } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import FormUtils from '@/classes/FormUtils';
import { ArrowLeft } from "react-native-feather";
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
        console.log("annonce", response.Data);
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
      <Card>
        <Card.Title title={annonce.name} titleStyle={{ fontSize: 24 ,textAlign:"center"} }
         left={(props) => <ThemedText><ArrowLeft {...props} onPress={() => router.back()}/></ThemedText> } 
          right={(props) => <ThemedText {...props}>{FormUtils.FormatDate(annonce.createdDate)}</ThemedText>} />
        <Card.Cover source={{ uri: annonce.image }} />
        <Card.Content>
        <ScrollView contentContainerStyle={styles.container}>
          <ThemedText>
            <Text style={styles.title}>Annonce</Text>
            </ThemedText>  
          
          <ThemedText>
            <Text style={styles.label}>Titre :</Text>
            </ThemedText>
          <ThemedText>

          <Text style={styles.content}>{annonce.name ?? "-"}</Text>
          </ThemedText>
          <ThemedText>
            <Text style={styles.label}>Description :</Text>

          </ThemedText>
          <ThemedText>
            <Text style={styles.content}>{annonce.description ?? "-"}</Text>
          </ThemedText>

          {/* Ajoute d'autres champs selon la structure de GetAnnonceDto */}
        </ScrollView>

        </Card.Content>
        </Card>
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
