import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { GetSessionReservedDto } from '../../../interfaces/EscapeGameInterface/Reservation/getSessionReservedDto';

interface ReservationItemProps {
  reservation: GetSessionReservedDto;
}

export function ReservationItem({ reservation }: ReservationItemProps) {
  const router = useRouter();

  const handleRedirection = () => {
    console.log("Redirecting to reservation details for:", reservation.id);
    const reservationSerialized = JSON.stringify(reservation);
    router.push({
      pathname: "/Profile/Reservation/ReservationDetails",
      params: { reservation: reservationSerialized },
    });
  };

  return (
    <TouchableOpacity onPress={handleRedirection} style={styles.itemContainer}>
      <View style={styles.letterCircle}>
        <Text style={styles.letterText}>{reservation.id.toString()}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.headerText}>
          {reservation.sessionGame?.gameDate
            ? new Date(reservation.sessionGame.gameDate).toDateString()
            : "Date inconnue"}
        </Text>
        <Text style={styles.nameText}>{reservation.content}</Text>
      </View>
    </TouchableOpacity>
  );
}

interface ReservationListeProps {
  reservationcolumns: GetSessionReservedDto[];
  loading?: boolean;
}

export function ReservationListe({ reservationcolumns, loading = false }: ReservationListeProps) {
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!reservationcolumns || reservationcolumns.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Aucune réservation disponible</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reservationcolumns}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ReservationItem reservation={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  letterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6200ee", // primary color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  letterText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 14,
    color: "#555",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingVertical: 8,
  },
});
