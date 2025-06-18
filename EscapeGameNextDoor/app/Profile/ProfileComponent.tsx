import React, { useState } from "react";
import { View, Image, ScrollView, StyleSheet } from "react-native";
import { Card, Text, Button, Divider, Avatar } from "react-native-paper";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type ProfileProps = {
  user: GetUserDto;
};

export default function ProfileComponent({ user }: ProfileProps) {
  const [profile] = useState<GetUserDto>(user);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={profile.username}
          subtitle={new Date().toLocaleString()}
        />
        <Card.Content>
          <View style={styles.authorContainer}>
            <Avatar.Image
              size={80}
              source={
                profile.picture
                  ? { uri: profile.picture }
                  : require("../../assets/images/react-logo.png")
              }
            />
            <View style={styles.authorNameContainer}>
              <Text style={styles.text} variant="labelSmall">Nom</Text>
              <Text style={styles.text}   variant="titleMedium">
                {profile.firstName} {profile.lastName}
              </Text>
              <Divider style={styles.divider} />
              <Text style={styles.text} variant="labelSmall" className="">Mail</Text>
              <Text style={styles.text}  variant="bodyMedium">{profile.email}</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button mode="outlined" onPress={() => {}}>
            Forum
          </Button>
          <Button mode="outlined" onPress={() => {}}>
            Escapegame Completer
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",

  },
  card: {
    width: "100%",
    maxWidth: 600,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
  },
  authorNameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  text:{
    paddingStart:10,
    paddingEnd:10
  },
  divider: {
    marginVertical: 8,
  },
  actions: {
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: 8,
  },
});
