import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { UnitofAction } from "@/action/UnitofAction";
import AppView from "@/components/ui/AppView";
import { GetAnnonceDto } from "@/interfaces/NotificationInterface/Annonce/getAnnonceDto";

export default function AnnonceOrganisation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [annonces, setAnnonces] = useState<GetAnnonceDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // À récupérer si API le fournit
  const action = new UnitofAction();
  const router = useRouter();

  const fetchAnnonce = async () => {
    setIsLoading(true);
    try {
      const response = await action.annonceAction.GetAllAnnonceByOrganisationId(Number(id), page, 5);
      if (response.Success) {
        setAnnonces(response.Data as GetAnnonceDto[]);
        // Si l'API fournit total de pages, on peut faire : setTotalPages(response.TotalPages);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnnonce();
    }
  }, [id, page]);

  const renderItem = ({ item }: { item: GetAnnonceDto }) => (
    <AnnonceItem organisation={item} router={router} />
  );

  const onPrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const onNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <AppView>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <FlatList
            data={annonces}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <View style={styles.pagination}>
            <TouchableOpacity onPress={onPrevPage} disabled={page === 1} style={[styles.pageButton, page === 1 && styles.disabled]}>
              <Text style={styles.pageButtonText}>Précédent</Text>
            </TouchableOpacity>
            <Text style={styles.pageNumber}>{page}</Text>
            <TouchableOpacity onPress={onNextPage} disabled={page === totalPages} style={[styles.pageButton, page === totalPages && styles.disabled]}>
              <Text style={styles.pageButtonText}>Suivant</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </AppView>
  );
}

function AnnonceItem({ organisation, router }: { organisation: GetAnnonceDto; router: ReturnType<typeof useRouter> }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{organisation.name}</Text>
      {organisation.image ? (
        <Image source={{ uri: organisation.image }} style={styles.image} />
      ) : null}
      <Text style={styles.description}>{organisation.description}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => { /* Navigation Escape Game ici */ }}>
          <Text style={styles.buttonText}>Escape Game</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push({
              pathname: "/Notification/Annonce/AnnonceOrganisation",
              params: { id: organisation.id.toString() },
            });
          }}
        >
          <Text style={styles.buttonText}>Annonce</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 6,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  pageButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  disabled: {
    backgroundColor: "#aaa",
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  pageNumber: {
    fontSize: 18,
    marginHorizontal: 16,
  },
});
