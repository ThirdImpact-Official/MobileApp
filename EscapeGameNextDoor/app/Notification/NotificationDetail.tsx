import React, { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { GetNotificationDto } from "@/interfaces/NotificationInterface/Notification/getNotificationDto";
import FormUtils from "@/classes/FormUtils";

interface Props {
  data: GetNotificationDto | undefined | null;
}

export default function NotificationDetail({ data }: Props) {
  const [notif, setNotif] = useState<GetNotificationDto | undefined | null>(data);

  if (!notif) {
    return (
      <View style={[styles.card, styles.center]}>
        <Text style={styles.title}>Loading...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{notif.title}</Text>
        <Text style={styles.date}>{FormUtils.FormatDate(notif.creationDate)}</Text>
      </View>
      <View style={styles.content}>
        <Text>{notif.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    margin: 12,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    height: 150,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    fontSize: 16,
  },
});
