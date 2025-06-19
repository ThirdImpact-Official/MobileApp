import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, useWindowDimensions } from 'react-native';
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppView from "@/components/ui/AppView";
import { useAuth } from "@/context/ContextHook/AuthContext";
import { UnitofAction } from "@/action/UnitofAction";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import FormUtils from '@/classes/FormUtils';
import { Card } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
/**
 * Page pour afficher les d tails d'une session
 * @param id - L'identifiant de la session
 * @returns La page des d tails de la session
 */
export default function SessionDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<GetSessionGameDto | null>(null);
  const isLoading = useAuth().isLoading;
  const httpaction = React.useMemo(() => new UnitofAction(), []);
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const { width } = useWindowDimensions();

  const fetchSession = async () => {
    try {
      const response = await httpaction.sessionAction.getSessionById(Number(id));
      if (response.Success) {
        console.log(response.Data);
        setSession(response.Data as GetSessionGameDto);
      } else {
        setError(response.Message || "Une erreur est survenue lors du chargement de la session.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    }
  };

  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [id]);

  if (isLoading) {
    return (
      <AppView>
        <Card>
          <Card.Content>
            <ActivityIndicator size="large" />
          </Card.Content>
        </Card>
      </AppView>
    );
  }

  if (error) {
    return (
      <AppView>
        <Card style={styles.card}>
          <Card.Title title="Erreur" />
          <Card.Content>
            <Text style={styles.errorText}>{error}</Text>
          </Card.Content>
        </Card>
      </AppView>
    );
  }

  return (
    <AppView>
      <Card style={styles.card}>
        <View style={styles.container}>
          <ThemedText style={styles.header}>Session</ThemedText>
          <Card.Content style={styles.content}>
            <View>
              <ThemedText><Text style={styles.label}>Date : </Text>{session?.gameDate ? FormUtils.FormatDate(session.gameDate.toString()) : "-"}</ThemedText>
              <ThemedText><Text style={styles.label}>Place Maximum : </Text>{session?.placeMaximum ?? "-"}</ThemedText>
              <ThemedText><Text style={styles.label}>Place Disponible : </Text>{session?.placeAvailable ?? "-"}</ThemedText>
              <ThemedText><Text style={styles.label}>Prix : </Text>
                {session?.price !== undefined && session?.price !== null ? `${session.price} €` : "-"}
              </ThemedText>
              <ThemedText><Text style={styles.label}>Libre : </Text>{session?.isReserved ? "Oui" : "Non"}</ThemedText>
            </View>
          </Card.Content>
        </View>

        <Card.Actions style={width < 500 ? styles.verticalActions : styles.horizontalActions}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => router.push({
              pathname: "/Organisation/SessionGame/SessionSummary",
              params: { id: id },
            })}
          >
            <ThemedText>
              Réserver

            </ThemedText>
          </Button>
          <Button
            mode="outlined"
            style={styles.outlinedButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttontext}>
              Autres Sessions
              </ThemedText>
          </Button>
        </Card.Actions>
      </Card>
    </AppView>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  content: {
    gap: 8,
  },
  label: {
    fontWeight: "600",
  },
  horizontalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  verticalActions: {
    flexDirection: 'column',
    gap: 8,
    padding: 16,
  },
  buttontext:{
   
  },
  button: {
    color:'#050505',
    backgroundColor:'#050505',
    flex: 1,
    minWidth: 150,
    maxWidth: 300,
  },
  outlinedButton:{
    color:'#050505',

    flex: 1,
    minWidth: 150,
    maxWidth: 300,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
});