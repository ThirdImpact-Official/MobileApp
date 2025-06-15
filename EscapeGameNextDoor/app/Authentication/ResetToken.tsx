import AppView from "@/components/ui/AppView";
import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Card, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { Text } from 'react-native';
import { UnitofAction } from "@/action/UnitofAction";
import { Mail, Key } from "react-native-feather";

export default function GenerateToken() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const action = new UnitofAction();

    const handleGenerateToken = async () => {
        if (!email) {
            setError("Veuillez entrer une adresse email valide");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await action.CredentialAction.GenerateEmailToken(email);
            
            if (response.Success) {
                Alert.alert(
                    "Token généré",
                    `Un nouveau token a été généré et envoyé à ${email}`,
                    [{ text: "OK" }]
                );
            } else {
                throw new Error(response.Message || "Échec de la génération du token");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
            console.error("GenerateToken error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppView >
            <Card style={styles.card}>
                <Card.Title 
                    title="Générer un nouveau token" 
                    subtitle="Pour renouveler votre token d'accès"
                    left={() => <Key color="#6200ee" width={24} height={24} />}
                />
                
                <Card.Content style={styles.content}>
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <TextInput
                        label="Email associé"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        left={<TextInput.Icon icon={Mail} />}
                    />

                    <Button
                        mode="contained"
                        onPress={handleGenerateToken}
                        style={styles.button}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? "Génération en cours..." : "Générer le token"}
                    </Button>
                </Card.Content>
            </Card>
        </AppView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    card: {
        borderRadius: 8,
        padding: 16,
    },
    content: {
        marginTop: 16,
    },
    input: {
        marginBottom: 16,
        backgroundColor: "white",
    },
    button: {
        marginTop: 8,
        paddingVertical: 8,
    },
    errorContainer: {
        backgroundColor: "#FFEBEE",
        padding: 12,
        borderRadius: 4,
        marginBottom: 16,
    },
    errorText: {
        color: "#D32F2F",
        textAlign: "center",
    },
});