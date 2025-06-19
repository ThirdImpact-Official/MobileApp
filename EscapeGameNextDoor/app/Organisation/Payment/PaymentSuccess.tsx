import AppView from "@/components/ui/AppView";
import React, { useEffect } from "react";
import { Button, Card, Text } from 'react-native-paper';
import { SecureStoreApp } from "@/classes/SecureStore";
import { UnitofAction } from "@/action/UnitofAction";
import { useRouter } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Divider } from "react-native-paper";
const unitOfAction = new UnitofAction();
const PAYMENT = "PAYMENT";

export default function PaymentSuccess() {
    const [error, setError] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);
    const [paymentId, setPayment] = React.useState<number | null>(null);
    const storage = new SecureStoreApp();
    const router = useRouter();

    const handleStockData = async () => {
        const getid = await storage.getValueFor(PAYMENT);
        setPayment(getid);
        console.log(getid);
        await storage.getValueFor(PAYMENT);
    }

    const HandleProfilesredirection = () => {
        router.replace("/profile");
    }
    const handleSuccessPayment = async () => {
        try {
            setLoading(true);
            const response = await unitOfAction.paymentAction.SuccessPayment(
                Number(paymentId)
            );
            if (response.Success) {
                HandleProfilesredirection();
                await storage.removeValueFrom(PAYMENT);
            } else {
                setError(response.Message);
            }
        } finally {

            setLoading(false);
        }
    };
    useEffect(() => {
        handleStockData();
    })
    if (isLoading) {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Title title="Loading" titleStyle={styles.sectionTitle} />
                     <Divider style={styles.divider} />
                    <Card.Content style={styles.sectionContainer}>
                        <ActivityIndicator />
                    </Card.Content>
                </Card>
            </AppView>
        )
    }
    if (error) {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Title title="Error" titleStyle={styles.sectionTitle} />
                    <Divider style={styles.divider} />
                    <Card.Content style={styles.sectionContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </Card.Content>
                    <Card.Actions style={styles.actionsContainer}>
                        <View>
                            <Button onPress={handleSuccessPayment} style={styles.retryButton}>ReCharger</Button>
                        </View>
                    </Card.Actions>
                </Card>
            </AppView>
        )
    }
    return (
        <AppView>
            <Card style={styles.card}>
                <Card.Title titleStyle={styles.sectionTitle} title="Payment Success" />
                <Card.Content style={styles.sectionContainer}>
                    <Text style={styles.confirmationText}>Votre paiement a été validé.</Text>
                </Card.Content>
                <Card.Actions style={styles.confirmationContainer}>
                    <View>
                        <Button onPress={handleSuccessPayment}>Confirmer</Button>
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
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 28,
        color: '#d32f2f',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        borderColor: '#6200ee',
    },
    sectionContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50',
        textAlign: 'center',
    },
    gameInfoContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
    },
    gameDescription: {
        fontSize: 14,
        color: '#495057',
        marginBottom: 12,
        lineHeight: 20,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    gameDetail: {
        fontSize: 14,
        color: '#6c757d',
    },
    formContainer: {
        gap: 12,
    },
    input: {},
    actionsContainer: {
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    submitButton: {
        backgroundColor: '#050505',
        width: '100%',
    },
    successButton: {
        backgroundColor: '#28a745',
        width: '100%',
    },
    text: {
        fontSize: 16,
        color: '#6c757d',
    },
    textTitle: {
        textAlign: 'center',
    },
    confirmationContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        borderRadius: 8,
    },
    confirmationText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#2e7d32',
        textAlign: 'center',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 1,
    },
    editButtonText: {
        color: '#6200ee',
        marginLeft: 4,
    },
});