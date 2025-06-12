import React, { FC, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GetActivityPlaceDto } from "@/interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto";
import { UnitofAction } from "@/action/UnitofAction";
import AppView from "@/components/ui/AppView";  // ton container custom si compatible RN
import { useToasted } from "@/context/ContextHook/ToastedContext";

interface ActivityDetailProps {
  data?: GetActivityPlaceDto;
}

const ActivityPlaceDetail: FC<ActivityDetailProps> = ({ data }) => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const toasted = useToasted();
  const httpAction = new UnitofAction();

  const [activity, setActivity] = useState<GetActivityPlaceDto | null | undefined>(data !== undefined ? data : null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);

  const buttonList = [
    { label: "Go to Map", onPress: () => Alert.alert("Navigation vers la carte") },
    { label: "Contact", onPress: () => Alert.alert("Contact") },
    { label: "Book Now", onPress: () => Alert.alert("Réserver maintenant") },
  ];

  const fetchActivity = async () => {
    if (!id) {
      setError("ID is missing");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await httpAction.escapeGameAction.getActivityPlaceById(Number(id));
      if (response.Success) {
        setActivity(response.Data as GetActivityPlaceDto);
        toasted.showToast(response.Message, "success");
      } else {
        setError(response.Message || "Failed to fetch activity");
      }
    } catch (e) {
      setError("An error occurred while fetching activity");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data) {
      fetchActivity();
    }
  }, [id]);

  if (loading) {
    return (
      <AppView>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text>Loading activity...</Text>
        </View>
      </AppView>
    );
  }

  if (error) {
    return (
      <AppView>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchActivity}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </AppView>
    );
  }

  if (!activity) {
    return (
      <AppView>
        <View style={styles.centered}>
          <Text>No activity data available.</Text>
        </View>
      </AppView>
    );
  }

  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{activity.name}</Text>
        <Image
          source={{ uri: activity.imgressources || "https://via.placeholder.com/400x200?text=No+Image" }}
          style={styles.image}
          resizeMode="cover"
          onError={() => Alert.alert("Image not available")}
        />
        <View style={styles.content}>
          <Text style={styles.label}><Text style={styles.bold}>Name: </Text>{activity.name}</Text>
          <Text style={styles.label}><Text style={styles.bold}>Description: </Text>{activity.description || "No description available"}</Text>
          <Text style={styles.label}><Text style={styles.bold}>Address: </Text>{activity.address || "No address provided"}</Text>
        </View>
        <View style={styles.buttons}>
          {buttonList.map((btn, idx) => (
            <TouchableOpacity key={idx} style={styles.button} onPress={btn.onPress}>
              <Text style={styles.buttonText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#ddd",
  },
  content: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "700",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 90,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#1976d2",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default ActivityPlaceDetail;
