import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, useWindowDimensions } from "react-native";
import { Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppView from "@/components/ui/AppView";
import { useAuth } from "@/context/ContextHook/AuthContext";
import { UnitofAction } from "@/action/UnitofAction";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import FormUtils from '@/classes/FormUtils';
import { Card } from "react-native-paper";

export default function ListSessionDetails() {
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
        <ActivityIndicator size="large" />
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
          <Text style={styles.header}>Session</Text>
          <Card.Content style={styles.content}>
            <Text><Text style={styles.label}>Date : </Text>{session?.gameDate ? FormUtils.FormatDate(session.gameDate.toString()) : "-"}</Text>
            <Text><Text style={styles.label}>Place Maximum : </Text>{session?.placeMaximum ?? "-"}</Text>
            <Text><Text style={styles.label}>Place Disponible : </Text>{session?.placeAvailable ?? "-"}</Text>
            <Text><Text style={styles.label}>Prix : </Text>
              {session?.price !== undefined && session?.price !== null ? `${session.price} €` : "-"}
            </Text>
            <Text><Text style={styles.label}>Libre : </Text>{session?.isReserved ? "Oui" : "Non"}</Text>
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
            Réserver
          </Button>
          <Button
            mode="outlined"
            style={styles.outlinedButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttontext}>
              Autres Sessions
              </Text>
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
      color:'#050505',
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