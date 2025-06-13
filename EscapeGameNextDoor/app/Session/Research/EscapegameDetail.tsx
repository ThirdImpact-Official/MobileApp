import React, { FC, useEffect, useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Card, Title, Paragraph, Button, ActivityIndicator } from "react-native-paper";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { UnitofAction } from "@/action/UnitofAction";
import { ServiceResponse, PaginationResponse } from "@/interfaces/ServiceResponse";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { useNavigation } from "@react-navigation/native";

interface EscapeGameDetailProps {
  Id?: number | null | undefined;
}

const buttonlst = [
  { label: "Session", route: "SessionGameList" },
  { label: "Activity place", route: "ActivitityPlaceList" },
  { label: "Organisation", route: "" },
  { label: "Avis", route: "RatingList" },
];

const EscapeGameDetail: FC<EscapeGameDetailProps> = ({ Id }) => {
  const action = new UnitofAction();
  const [escapeGame, setEscapeGame] = useState<GetEscapeGameDto | null>(null);
  const [loading, setLoading] = useState(false);
  const notif = useToasted();
  const navigation = useNavigation();

  const fetchEscape = async (id: number) => {
    setLoading(true);
    try {
      const response: ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto> =
        await action.escapeGameAction.getEscapeGameById(id);

      if (response.Success) {
        setEscapeGame(response.Data as GetEscapeGameDto);
        notif.showToast(response.Message, "success");
      } else {
        notif.showToast(response.Message, "error");
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (Id !== undefined && Id !== null && Id > 0) {
      fetchEscape(Id);
    }
  }, [Id]);

  if (!Id || Id <= 0 || loading) {
    return (
      <Card style={styles.card}>
        <Card.Title title={<ActivityIndicator animating />} />
        <Card.Content>
          <ActivityIndicator animating size="large" />
        </Card.Content>
        <Card.Actions>
          {buttonlst.map((item) => (
            <Button key={item.label} onPress={() => item.route && navigation.navigate(item.route as never)}>
              {item.label}
            </Button>
          ))}
        </Card.Actions>
      </Card>
    );
  }

  if (!escapeGame) return null;

  return (
    <ScrollView>
      <Card style={styles.card}>
        <Card.Title title={escapeGame.esgTitle} />
        {escapeGame.esgImgResources ? (
          <Image
            source={{ uri: escapeGame.esgImgResources }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : null}
        <Card.Content>
          <Paragraph>Id: {escapeGame.esgId?.toLocaleString()}</Paragraph>
          <Paragraph>Title: {escapeGame.esgTitle}</Paragraph>
          <Paragraph>Description: {escapeGame.esgContent}</Paragraph>
          <Paragraph>PhoneNumber: {escapeGame.esgPhoneNumber}</Paragraph>
          <Paragraph>Difficulty: {escapeGame.esg_DILE_Id}</Paragraph>
          <Paragraph>Price: {escapeGame.esg_Price_Id}</Paragraph>
          <Paragraph>Pour Enfants: {escapeGame.esg_IsForChildren ? "Oui" : "Non"}</Paragraph>
        </Card.Content>
        <Card.Actions>
          {buttonlst.map((item) => (
            <Button key={item.label} onPress={() => item.route && navigation.navigate(item.route as never)}>
              {item.label}
            </Button>
          ))}
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: { margin: 16 },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 8 },
});

export default EscapeGameDetail;
