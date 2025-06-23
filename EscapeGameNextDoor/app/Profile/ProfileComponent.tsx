import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, Button, Divider, Avatar, Modal } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { ThemedText } from "@/components/ThemedText";
import { UnitofAction } from "@/action/UnitofAction";
import { UpdatePictureDto } from "@/interfaces/User/UpdateUserDto";
import { on } from 'events';

type ProfileProps = {
  user: GetUserDto;

};

export default function ProfileComponent({ user }: ProfileProps) {
  const [profile] = useState<GetUserDto>(user);
  const [visible, setVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null); // image binaire
  const action = new UnitofAction();
  const [object,setobject]= useState<UpdatePictureDto>();
  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.error("ImagePicker error: ", response.errorMessage);
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setSelectedFile({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName ?? "profile.jpg",
          });
        }
      }
    );
  };

const uploadImage = async () => {
  const formData = new FormData();
  formData.append("picture", selectedFile as any);
 
   try {
     const response = await action.userAction.UpdatePicture(formData);
     handleClose();
   } catch (err) {
     console.error("Erreur upload image : ", err);
   }

}


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={profile.username}
          subtitle={new Date().toLocaleString()}
          left={() => (
            <TouchableOpacity onPress={handleClose}>
              <ThemedText>Collapsible</ThemedText>
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          <View style={styles.authorContainer}>
            <TouchableOpacity onPress={handleOpen}>
              <Avatar.Image
                size={80}
                source={
                  profile.picture
                    ? { uri: profile.picture }
                    : require("../../assets/images/react-logo.png")
                }
              />
            </TouchableOpacity>
            <View style={styles.authorNameContainer}>
              <Text style={styles.text} variant="labelSmall">Nom</Text>
              <Text style={styles.text} variant="titleMedium">
                {profile.firstName} {profile.lastName}
              </Text>
              <Divider style={styles.divider} />
              <Text style={styles.text} variant="labelSmall">Mail</Text>
              <Text style={styles.text} variant="bodyMedium">{profile.email}</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button mode="outlined" onPress={() => {}}>Forum</Button>
          <Button mode="outlined" onPress={() => {}}>EscapeGame Completer</Button>
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
  text: {
    paddingStart: 10,
    paddingEnd: 10,
  },
  divider: {
    marginVertical: 8,
  },
  actions: {
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: 8,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});
