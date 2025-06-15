import React, { useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import { Card, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from "expo-router";
import { Lock } from "react-native-feather";
import AppView from '../../../components/ui/AppView';
import { UnitofAction } from '../../../action/UnitofAction';

type ResetTokenParams = {
    token?: string;
    email?: string;
};

interface UpdateLoginDto {
    Email: string;
    Password: string;
    Token: string;
}

export default function ResetToken() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { token, email } = useLocalSearchParams<ResetTokenParams>();
    const router = useRouter();
    const action = new UnitofAction();

    const handlePasswordReset = async () => {
        if (!token || !email) {
            setError("Lien de réinitialisation invalide");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        const updateData: UpdateLoginDto = {
            Email: email as string,
            Password: password,
            Token: token as string
        };

        setIsLoading(true);
        setError("");

        try {
            const response = await action.CredentialAction.resetpassword(updateData);

            if (response.Success) {
                Alert.alert(
                    "Succès",
                    "Votre mot de passe a été réinitialisé avec succès",
                    [{ text: "OK", onPress: () => router.replace("/login") }]
                );
            } else {
                throw new Error(response.Message || "Échec de la réinitialisation");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppView >
            <Card style={styles.card}>
                <Card.Title
                    title="Réinitialisation du mot de passe"
                    left={() => <Lock color="#6200ee" width={24} height={24} />}
                />
                
                <Card.Content style={styles.content}>
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <TextInput
                        label="Nouveau mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="lock" />}
                        placeholder="Minimum 6 caractères"
                    />

                    <TextInput
                        label="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="lock-check" />}
                    />

                    <Button
                        mode="contained"
                        onPress={handlePasswordReset}
                        style={styles.button}
                        loading={isLoading}
                        disabled={isLoading || !password || !confirmPassword}
                        contentStyle={styles.buttonContent}
                    >
                        {isLoading ? "Traitement..." : "Réinitialiser"}
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
        backgroundColor: '#f5f5f5'
    },
    card: {
        borderRadius: 8,
        padding: 16,
        margin: 16,
        elevation: 3,
    },
    content: {
        marginTop: 16,
    },
    input: {
        marginBottom: 16,
        backgroundColor: "white",
    },
    button: {
        marginTop: 16,
    },
    buttonContent: {
        height: 48,
        justifyContent: 'center'
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
        fontSize: 14
    },
});