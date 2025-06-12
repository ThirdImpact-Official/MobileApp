import React from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { View, StyleSheet } from "react-native";

export default function PaymentSuccess() {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title="Payment Success" />
        <Card.Content>
          <Paragraph>Votre paiement a été validé.</Paragraph>
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
