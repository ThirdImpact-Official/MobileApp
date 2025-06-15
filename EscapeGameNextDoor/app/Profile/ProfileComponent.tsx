import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Card, Divider } from "react-native-paper";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
type ProfileProps = {
  user: GetUserDto;
};

export default function ProfileComponent({ user }: ProfileProps) {
  const [profile] = useState<GetUserDto>(user);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card} elevation={3}>
        <Card.Title
          title={
            <ThemedView>
                <Text style={styles.caption}>{new Date().toLocaleString()}</Text>
                <Text style={styles.title}>{profile.username}</Text>
           
            </ThemedView>
          }
        />
        <Card.Content>
          <View style={styles.authorContainer}>
            <TouchableOpacity style={styles.avatarContainer}>
              {/* Si tu as un avatar url dans profile.avatarUrl, sinon avatar par défaut */}
              <Image
                source={
                  profile.picture
                    ? { uri: profile.picture }
                    : require("../../assets/images/react-logo.png")
                }
                style={styles.avatar}
              />
            </TouchableOpacity>

            {/* Demi cercle SVG : React Native ne supporte pas SVG natif sans librairie, on peut l’ignorer ou utiliser react-native-svg */}

            <View style={styles.authorNameContainer}>
              <ThemedText style={styles.title}>
                <ThemedText style={styles.caption}>Nom </ThemedText>
                <ThemedText style={styles.title}>
                  {profile.firstName} {profile.lastName}
                </ThemedText>
                <Divider style={styles.divider} />
                <ThemedText style={styles.caption}>Mail </ThemedText>
                <ThemedText>{profile.email}</ThemedText>
              </ThemedText>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <TouchableOpacity style={styles.tagButton} onPress={() => { /* navigation ici */ }}>
            <Text style={styles.tagText}>Reservation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tagButton} onPress={() => {}}>
            <Text style={styles.tagText}>Favoris</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tagButton} onPress={() => {}}>
            <Text style={styles.tagText}>Forum</Text>
          </TouchableOpacity>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "100%",
    maxWidth: 600,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",

  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  avatarContainer: {
    borderRadius: 40,
    overflow: "hidden",
    width: 80,
    height: 80,
    backgroundColor: "#ccc",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  authorNameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  caption: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: "#ccc",
  },
  actions: {
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tagButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
  },
});
