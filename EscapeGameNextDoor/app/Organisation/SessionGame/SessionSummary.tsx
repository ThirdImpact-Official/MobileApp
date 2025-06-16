import { UnitofAction } from "@/action/UnitofAction";
import FormUtils from "@/classes/FormUtils";
import { ThemedText } from "@/components/ThemedText";
import AppView from "@/components/ui/AppView";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { AddSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/addSessionReservedDto";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import { ServiceResponse } from "@/interfaces/ServiceResponse";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ChevronLeft, ChevronRight } from "react-native-feather";
import { Card, Divider, TextInput, Button } from "react-native-paper";

const unitOfAction = new UnitofAction();

async function fetchSessionReservationById(params: string): Promise<ServiceResponse<GetSessionGameDto>> {
    try {
        return await unitOfAction.sessionAction.getSessionById(Number(params)) as ServiceResponse<GetSessionGameDto>;
    } catch (error) {
        return {
            Success: false,
            Data: null,
            Message: "An error occurred while fetching the session."
        } as ServiceResponse<GetSessionGameDto>;
    }
}

async function fetchEscapeGame(params: number): Promise<ServiceResponse<GetEscapeGameDto>> {
    try {
        return await unitOfAction.escapeGameAction.getEscapeGameById(params) as ServiceResponse<GetEscapeGameDto>;
    } catch (error) {
        return {
            Success: false,
            Data: null,
            Message: "An error occurred while fetching the escape game."
        } as ServiceResponse<GetEscapeGameDto>;
    }
}

const SessionSummary: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [session, setSession] = useState<GetSessionGameDto | null>(null);
    const [reservation, setReservation] = useState<AddSessionReservedDto>({
        content: "",
        userId: 0,
        placeReserved: 1,
        sessionGameId: id ? Number(id) : 0
    });
    const [escapeGame, setEscapeGame] = useState<GetEscapeGameDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hasReserved, setHasReserved] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!id) {
                    setError("Session ID is missing");
                    return;
                }

                const sessionResponse = await fetchSessionReservationById(id);
                if (!sessionResponse.Success || !sessionResponse.Data) {
                    setError(sessionResponse.Message || "Failed to load session");
                    return;
                }

                setSession(sessionResponse.Data);

                if (sessionResponse.Data.escapeGameId) {
                    const gameResponse = await fetchEscapeGame(sessionResponse.Data.escapeGameId);
                    if (gameResponse.Success && gameResponse.Data) {
                        setEscapeGame(gameResponse.Data);
                    }
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleReservationSubmit = async () => {
        if (!reservation.content.trim()) {
            Alert.alert("Erreur", "Veuillez saisir un titre pour votre réservation");
            setError("Veuillez saisir un titre pour votre réservation");
            return;
        }
        if (
            reservation.placeReserved < 1 ||
            (session?.placeMaximum !== undefined && reservation.placeReserved > session.placeMaximum)
        ) {
            Alert.alert(
                "Erreur",
                session?.placeMaximum !== undefined
                    ? `Le nombre de participants doit être entre 1 et ${session.placeMaximum}`
                    : "Le nombre de participants doit être au moins 1"
            );
            setError("veuillez saisir un nombre acceptable de place pour cette reservation")
            return;
        }

        setLoading(true);
        try {
            // TODO: Implement actual reservation submission
            // const response = await unitOfAction.reservationAction.addReservation(reservation);
            // if (!response.Success) throw new Error(response.Message);

            setHasReserved(true);
            Alert.alert("Succès", "Votre réservation a été enregistrée avec succès");
        } catch (err) {
            Alert.alert("Erreur", "Échec de la réservation. Veuillez réessayer.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateReservation = () => {
        setHasReserved(false);
    };

    const handleCOnfirmation = async () => {
        try
         {
            const response = await unitOfAction.sessionAction.addSessionReserved(reservation) as ServiceResponse<AddSessionReservedDto>;
            if(response.Success)
            {
                
            }
            else{
                setError(response.Message);
                setLoading(false)
            }
         }
         catch(error)
         {

         }
    }
    if (loading) {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Title title="Chargement..." />
                    <Card.Content style={styles.loadingContainer}>
                        <ActivityIndicator size="large" />
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    if (error) {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Title title="Erreur" />
                    <Card.Content style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <Button
                            mode="outlined"
                            onPress={() => setError("")}
                            style={styles.retryButton}
                        >
                            Réessayer
                        </Button>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    if (!hasReserved) {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Title title="Détails de la session" />

                    <Divider style={styles.divider} />
                    <Card.Content>
                        {escapeGame && (

                            <View style={styles.detailsRow}>
                                {escapeGame.esgDuree && (
                                    <Text style={styles.gameDetail}>⏱️ {escapeGame.esgDuree} minutes</Text>
                                )}
                                {session?.placeMaximum && (
                                    <Text style={styles.gameDetail}>👥 Max {session.placeMaximum} personnes</Text>
                                )}
                            </View>
                        )

                        }
                    </Card.Content>
                    <Card.Content>
                        <View style={styles.sectionContainer}>
                            <ThemedText style={styles.sectionTitle}>Votre réservation</ThemedText>
                            <View style={styles.formContainer}>
                                <TextInput
                                    label="Titre de votre réservation"
                                    value={reservation.content}
                                    onChangeText={(text) =>
                                        setReservation(prev => ({ ...prev, content: text }))
                                    }
                                    mode="outlined"
                                    style={styles.input}
                                    disabled={loading}
                                />
                                <TextInput
                                    label="Nombre de participants"
                                    value={reservation.placeReserved.toString()}
                                    onChangeText={(text) => {
                                        const num = Math.max(1, parseInt(text) || 1);
                                        setReservation(prev => ({ ...prev, placeReserved: num }));
                                    }}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    style={styles.input}
                                    disabled={loading}
                                />
                            </View>
                        </View>
                    </Card.Content>

                    <Card.Actions style={styles.actionsContainer}>
                        <Button
                            mode="contained"
                            onPress={handleReservationSubmit}
                            style={styles.submitButton}
                            loading={loading}
                            disabled={loading}
                        >
                            Confirmer la réservation
                        </Button>
                    </Card.Actions>
                </Card>
            </AppView>
        );
    }

    return (
        <AppView>
            <Card style={styles.card}>
                <Card.Title
                
                    title="Réservation confirmée"
                    titleStyle={styles.textTitle}
                    left={() => (
                        <TouchableOpacity onPress={handleUpdateReservation} style={styles.editButton}>
                            <ChevronRight color="#6200ee" />
                            <Text style={styles.editButtonText}>Modifier</Text>
                        </TouchableOpacity>
                    )}
                />
                <Divider style={styles.divider} />

                <Card.Content>
                    <View style={styles.confirmationContainer}>
                        <Text style={styles.confirmationText}>Votre reservation est préte à être valider</Text>
                    </View>
                    <View style={styles.sectionContainer}>
                        <ThemedText style={styles.sectionTitle}>Détails de votre réservation</ThemedText>

                        {escapeGame ? (
                            <View style={styles.gameInfoContainer}>
                                <Text style={styles.gameTitle}>{escapeGame.esgTitle}</Text>

                                <View style={styles.detailsRow}>
                                    {escapeGame.esgDuree && (
                                        <Text style={styles.gameDetail}>⏱️ {escapeGame.esgDuree} minutes</Text>
                                    )}
                                   
                                </View>
                                <View>
                                    <Text style={styles.gameDetail}>Titre: {reservation.content}</Text>
                                    <Text style={styles.gameDetail}>Participants: {reservation.placeReserved}</Text>
                                    {session && (
                                        <Text style={styles.gameDetail}>
                                            Date: {FormUtils.FormatDate(String(session.gameDate))}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.text}>Informations du jeu non disponibles</Text>
                        )}
                    </View>


                </Card.Content>

                <Divider style={styles.divider} />
                <Card.Actions style={styles.actionsContainer}>
                    <Button
                        mode="contained"
                        onPress={handleReservationSubmit}
                        style={styles.successButton}
                    >
                        Voir les détails
                    </Button>
                </Card.Actions>
            </Card>
        </AppView>
    );
};

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
        fontSize: 16,
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
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50',
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
    input: {
        backgroundColor: 'white',
    },
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
    textTitle:{
        textAlign:'center',
    
    },
    confirmationContainer: {
        backgroundColor: '#e8f5e9',
        padding: 16,
        borderRadius: 8,
    },
    confirmationText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#2e7d32',
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

export default SessionSummary;