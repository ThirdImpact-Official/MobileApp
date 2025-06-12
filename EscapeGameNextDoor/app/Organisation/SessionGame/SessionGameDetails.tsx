import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppView from "@/components/ui/AppView";
import { useAuth } from "@/context/ContextHook/AuthContext";
import { UnitofAction } from "@/action/UnitofAction";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import FormUtils from '@/classes/FormUtils';

export default function ListSessionDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<GetSessionGameDto | null>(null);
  const isLoading = useAuth().isLoading;
  const httpaction = new UnitofAction();
  const router = useRouter();

  const fetchSession = async () => {
    const response = await httpaction.sessionAction.getSessionById(Number(id));
    if (response.Success) {
      setSession(response.Data as GetSessionGameDto);
    } else {
      console.log(response.Message);
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

  return (
    <AppView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Session</Text>

          <View style={styles.content}>
            <Text><Text style={styles.label}>Date : </Text>{session?.gameDate ? FormUtils.FormatDate(session.gameDate.toString()) : "-"}</Text>
            <Text><Text style={styles.label}>Place Maximum : </Text>{session?.placeMaximum ?? "-"}</Text>
            <Text><Text style={styles.label}>Place Disponible : </Text>{session?.placeAvailable ?? "-"}</Text>
            <Text><Text style={styles.label}>Prix : </Text>{session?.price ? "Oui" : "Non"}</Text>
            <Text><Text style={styles.label}>Libre : </Text>{session?.isReserved ? "Oui" : "Non"}</Text>
          </View>

          <View style={styles.actions}>
            <Button
              title="Réserver"
              onPress={() => router.push('/Organisation/SessionGame/SessionReservation')}
            />
            <View style={styles.divider} />
            <Button
              title="Voir les autres Sessions"
              onPress={() => router.back()} // ou autre navigation selon besoin
            />
          </View>
        </View>
      </View>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  content: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
});
