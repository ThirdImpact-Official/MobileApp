import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card, Button, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { UnitofAction } from '@/action/UnitofAction';
import { Check, AlertCircle, Mail } from 'react-native-feather';
import { Text } from 'react-native-paper';
import AppView from '@/components/ui/AppView';
type EmailCheckerParams = {
    email: string;
    token?: string;
};

export default function EmailChecker() {
    const action = new UnitofAction();
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const { token, email } = useLocalSearchParams<EmailCheckerParams>();
    const router = useRouter();

    const verifyEmail = async () => {
        console.log(token);
        console.log(email);
        if (!token || !email) {
            setError('Token ou email manquant');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        setIsError(false);

        try {
            const response = await action.CredentialAction.verifyEmail(token, email);
            
            if (response.Success) {
                setIsVerified(true);
                setTimeout(() => router.push('/'), 3000);
            } else {
                throw new Error(response.Message || 'Échec de la vérification');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la vérification');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && email) {
            verifyEmail();
        }
    }, [token, email]);

    if (isLoading) {
        return (
            <AppView>
                <Card>
                    <Card.Content>
                    <View style={styles.centerContainer}>
                        <View style={{flex:1}}>
                            <ActivityIndicator size="large" />
                            <ThemedText style={styles.loadingText}>
                                {isVerified ? 'Email vérifié! Redirection...' : 'Vérification en cours...'}
                            </ThemedText>
                        </View>
                        </View>
                    </Card.Content>
                </Card>  
            </AppView>
        );
    }

    if (isVerified) {
        return (
            <AppView>

            <View style={styles.centerContainer}>
                <Card style={styles.card}>
                    <Card.Title
                        title="Email Vérifié"
                        left={() => <Check stroke="#4CAF50" width={24} height={24} />}
                    />
                    <Card.Content>
                        <Text>
                            Votre email a été vérifié avec succès!
                        </Text>
                    </Card.Content>
                </Card>
            </View>
            </AppView>
        );
    }

    if (isError) {
        return (
            <AppView>
                <View style={styles.centerContainer}>
                    <Card style={styles.card}>
                        <Card.Title
                            title="Erreur"
                            left={() => <AlertCircle stroke="#F44336" width={24} height={24} />}
                        />
                        <Card.Content>
                            <View>
                                <ThemedText style={styles.errorText}>{error}</ThemedText>
                                <Button 
                                    mode="contained" 
                                    onPress={verifyEmail}
                                    style={styles.button}
                                >
                                    Réessayer
                                </Button>
                                </View>
                        </Card.Content>
                    </Card>
                </View>
            </AppView>
        );
    }

    return (
        <AppView>
            <View style={styles.centerContainer}>
                <Card style={styles.card}>
                    <Card.Title
                        title="Vérification Email"
                        left={() => <Mail stroke="#6200ee" width={24} height={24} />}
                    />
                    <Card.Content>
                        <View>
                            <Text>{token}</Text>
                        </View>
                        <ThemedText style={styles.text}>
                            <Text>
                                {email ? `Email: ${email}` : 'Aucun email fourni'}
                            </Text>
                        </ThemedText>
                    </Card.Content>
                </Card>
            </View>

        </AppView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16
    },
    card: {
        margin: 16,
        padding: 16
    },
    loadingText: {
        marginTop: 16,
        textAlign: 'center'
    },
    errorText: {
        color: '#F44336',
        marginVertical: 16,
        textAlign: 'center'
    },
    successText: {
        color: '#4CAF50',
        marginVertical: 16,
        textAlign: 'center'
    },
    text: {
        marginVertical: 16,
        textAlign: 'center'
    },
    button: {
        marginTop: 16
    }
});