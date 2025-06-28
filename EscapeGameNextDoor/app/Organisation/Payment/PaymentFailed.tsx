import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import AppView from '@/components/ui/AppView';
import React, { useState, useEffect } from 'react';
import { SecureStoreApp } from "@/classes/SecureStore";
import { UnitofAction } from "@/action/UnitofAction";
import { useRouter } from "expo-router";

const unitOfAction = new UnitofAction();
const PAYMENT = "PAYMENT";

export default function PaymentFailed() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<number | null>(null);
    const storage = new SecureStoreApp();
    const router = useRouter();

    const handleGetPaymentData = async () => {
        try {
            const getid = await storage.getValueFor(PAYMENT);
            setPaymentId(getid);
            console.log('Payment ID:', getid);
        } catch (err) {
            console.error('Error getting payment data:', err);
        }
    };

    const handleRetryPayment = async () => {
        if (!paymentId) {
            setError("ID de paiement introuvable");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            // Tentative de nouveau paiement
            const response = await unitOfAction.paymentAction.RetryPayment(
                Number(paymentId)
            );
            
            if (response.Success) {
                // Rediriger vers la page de succès ou profil
               
                await storage.removeValueFrom(PAYMENT);
            } else {
                setError(response.Message || "Échec du paiement");
            }
        } catch (err) {
            setError("Une erreur est survenue lors du paiement");
            console.error('Payment retry error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToProfile = () => {
        router.replace("/profile");
    };

    const handleCancelPayment = async () => {
        try {
            await storage.removeValueFrom(PAYMENT);
            router.replace("/profile");
        } catch (err) {
            console.error('Error canceling payment:', err);
            router.replace("/profile");
        }
    };

    useEffect(() => {
        handleGetPaymentData();
    }, []);

    if (isLoading) {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Title title="Traitement..." titleStyle={styles.sectionTitle} />
                    <Divider style={styles.divider} />
                    <Card.Content style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6200ee" />
                        <Text style={styles.loadingText}>Tentative de paiement en cours...</Text>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    return (
        <AppView>
            <Card style={styles.card}>
                <Card.Title 
                    titleStyle={[styles.sectionTitle, styles.failedTitle]} 
                    title="Paiement Échoué" 
                />
                <Divider style={styles.divider} />
                
                <Card.Content style={styles.sectionContainer}>
                    <View style={styles.failedIconContainer}>
                        <Text style={styles.failedIcon}>❌</Text>
                    </View>
                    
                    <Text style={styles.failedText}>
                        Votre paiement n'a pas pu être traité.
                    </Text>
                    
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}
                    
                    <Text style={styles.helpText}>
                        Veuillez vérifier vos informations de paiement et réessayer.
                    </Text>
                </Card.Content>

                <Card.Actions style={styles.actionsContainer}>
                    <View style={styles.buttonContainer}>
                        <Button 
                            mode="contained"
                            onPress={handleRetryPayment}
                            style={styles.retryButton}
                            labelStyle={styles.buttonLabel}
                            disabled={isLoading}
                        >
                            Réessayer le paiement
                        </Button>
                        
                        <Button 
                            mode="outlined"
                            onPress={handleCancelPayment}
                            style={styles.cancelButton}
                            labelStyle={styles.cancelButtonLabel}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        
                        <Button 
                            mode="text"
                            onPress={handleBackToProfile}
                            style={styles.backButton}
                            labelStyle={styles.backButtonLabel}
                        >
                            Retour au profil
                        </Button>
                    </View>
                </Card.Actions>
            </Card>
        </AppView>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 16,
        borderRadius: 8,
        elevation: 3,
    },
    divider: {
        marginVertical: 8,
    },
    loadingContainer: {
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
    },
    sectionContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50',
        textAlign: 'center',
    },
    failedTitle: {
        color: '#d32f2f',
    },
    failedIconContainer: {
        marginBottom: 16,
    },
    failedIcon: {
        fontSize: 48,
        textAlign: 'center',
    },
    failedText: {
        fontSize: 18,
        marginBottom: 16,
        color: '#d32f2f',
        textAlign: 'center',
        fontWeight: '600',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%',
    },
    errorText: {
        fontSize: 14,
        color: '#c62828',
        textAlign: 'center',
    },
    helpText: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 20,
    },
    actionsContainer: {
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    retryButton: {
        backgroundColor: '#6200ee',
        paddingVertical: 8,
    },
    cancelButton: {
        borderColor: '#d32f2f',
        paddingVertical: 8,
    },
    backButton: {
        paddingVertical: 4,
    },
    buttonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButtonLabel: {
        color: '#d32f2f',
        fontSize: 16,
        fontWeight: '600',
    },
    backButtonLabel: {
        color: '#6200ee',
        fontSize: 14,
    },
});