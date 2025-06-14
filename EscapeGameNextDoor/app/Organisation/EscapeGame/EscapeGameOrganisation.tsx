import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Avatar, IconButton, ActivityIndicator } from "react-native-paper";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { ThemedText } from '@/components/ThemedText';
import AppView from "@/components/ui/AppView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UnitofAction } from "@/action/UnitofAction";
import { useToasted } from "@/context/ContextHook/ToastedContext";

const PAGE_SIZE = 10;

export default function EscapeGameOrganisation() {
  const [games, setGames] = useState<GetEscapeGameDto[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const params = useLocalSearchParams();
  const router = useRouter();
const notif = useToasted();
  const fetchEscapeGames = async (pageNum: number) => {
    try {
      const action = new UnitofAction();
      const response = await action.escapeGameAction.getAllEscapeGamesFromOrganisation(
        Number(params.id), 
        pageNum, 
        PAGE_SIZE
      );
      
      if (response.Success ) {
        setGames(response.Data);
        setTotalPages(response.TotalPage || 1);
        setError(response.Message || null);
        console.log("Escape games loaded:", response);
      } else {
        throw new Error(response.Message || "Failed to load games");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Erreur de chargement"
      );

      return [];
    }
    finally {
      setIsLoading(false);
        notif.showToast("Jeux d'évasion chargés avec succès", "success");
    }
  };

  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchEscapeGames(page);
      } catch (err) {
        console.error("Load error:", err);
        setError("Erreur de chargement des jeux");
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, [page, params.id]);

  const handlePrevPage = () => setPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1));
  const navigateToDetails = (id: number) => {
    router.push(`/Organisation/EscapeGame/EscapeGameDetails?id=${id}`);
  };

  if (isLoading && (!games || games.length === 0)) {
    return (
      <AppView >
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Chargement des jeux...</ThemedText>
      </AppView>
    );
  }

  if (isError) {
    return (
      <AppView >
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity onPress={() => fetchEscapeGames(page)} style={styles.retryButton}>
          <ThemedText>Réessayer</ThemedText>
        </TouchableOpacity>
      </AppView>
    );
  }

  return (
    <AppView >
      <ThemedText type="title" style={styles.header}>
        Jeux d'évasion de l'organisation
      </ThemedText>

      {games != null ? (
        <>
          {games.map((game) => (
            <TouchableOpacity key={game.esgId} onPress={() => navigateToDetails(game.esgId)}>

              <Card key={`${game.esgId}-${page}`} style={styles.card}>
                <Card.Title
                  title={game.esgNom || "Nom inconnu"}
                  subtitle={game.esgContent|| "Pas de description"}
                  left={(props) => <Avatar.Icon {...props} icon="gamepad" />}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="chevron-right"
                      onPress={() => navigateToDetails(game.esgId)}
                  />
                )}
              />
              <Card.Content style={styles.cardContent}>
                <View style={styles.gameInfo}>
                  <ThemedText style={styles.infoText}>
                    Difficulté: {game.esgDifficulte || "Non spécifiée"}
                  </ThemedText>
                  <ThemedText style={styles.infoText}>
                    Durée: {game.esgDuree || "Non spécifiée"}
                  </ThemedText>
                </View>
                <ThemedText numberOfLines={2} style={styles.details}>
                  {game.esgContent || "Aucun détail disponible."}
                </ThemedText>
              </Card.Content>
            </Card>
            </TouchableOpacity>
          ))}

          <View style={styles.pagination}>
            <TouchableOpacity 
              onPress={handlePrevPage}
              disabled={page === 1}
              style={[styles.paginationButton, page === 1 && styles.disabledButton]}
            >
              <ThemedText style={styles.paginationText}>◀ Précédent</ThemedText>
            </TouchableOpacity>
            
            <ThemedText style={styles.pageText}>
              Page {page} / {totalPages}
            </ThemedText>
            
            <TouchableOpacity 
              onPress={handleNextPage}
              disabled={page === totalPages}
              style={[styles.paginationButton, page === totalPages && styles.disabledButton]}
            >
              <ThemedText style={styles.paginationText}>Suivant ▶</ThemedText>
            </TouchableOpacity>
          </View>

          <Card style={styles.aboutCard}>
            <Card.Title
              title="Escape Game Next Door"
              subtitle="Votre partenaire pour des aventures inoubliables !"
              left={(props) => <Avatar.Icon {...props} icon="information" />}
            />
            <Card.Content>
              <ThemedText>
                Découvrez notre sélection de jeux d'évasion uniques et passionnants.
              </ThemedText>
            </Card.Content>
          </Card>
        </>
      ) : (
        <View style={styles.center}>
          <ThemedText style={styles.noGamesText}>Aucun jeu d'évasion disponible</ThemedText>
          <TouchableOpacity onPress={() => fetchEscapeGames(1)} style={styles.retryButton}>
            <ThemedText>Recharger</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardContent: {
    paddingTop: 0,
  },
  gameInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    fontWeight: '500',
  },
  details: {
    fontSize: 14,
    color: "#444",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 16,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 14,
    color: "#007AFF",
  },
  pageText: {
    fontSize: 14,
    minWidth: 80,
    textAlign: "center",
  },
  noGamesText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  aboutCard: {
    backgroundColor: "#F8F9FA",
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
});