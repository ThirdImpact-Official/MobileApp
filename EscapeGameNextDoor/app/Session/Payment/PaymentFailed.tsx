import React from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { View, StyleSheet } from "react-native";

export default function PaymentFailed() {
  return (
    <View style={styles.container}>
      <Card elevation={2}>
        <Card.Title title="Payment Failed" />
        <Card.Content>
          <Paragraph>Votre paiement a échoué</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
});
