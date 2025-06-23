import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { UnitofAction } from '@/action/UnitofAction';
import { GetSignalementTypeDto } from '@/interfaces/EscapeGameInterface/Moderation/getSignalementTypeDto';
import AppView from '../../components/ui/AppView';
import { Card, TextInput, Button, Text, RadioButton, HelperText  } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { ServiceResponse } from '@/interfaces/ServiceResponse';
import { AddSignalementDto } from '@/interfaces/EscapeGameInterface/Moderation/addSignalementDto';
import { useRouter } from 'expo-router';
import React
 from 'react';
export default function SignalementUser() {
    const { id } = useLocalSearchParams();
    const [signalementTypes, setSignalementTypes] = useState<GetSignalementTypeDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<AddSignalementDto>({
        content: "",
        signalementTypeId: 0,
        signaledUserId: Number(id),
        signalingUserId: 0
    });
    const [validationErrors, setValidationErrors] = useState({
        signalementTypeId: '',
        description: '',
    });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    const action = new UnitofAction();

    useEffect(() => {
        const fetchSignalementTypes = async () => {
            try {
                const response = await action.moderationAction.GetSignalementTypeUser() as ServiceResponse<GetSignalementTypeDto[]>;
                if (response.Success) {
                    setSignalementTypes(response.Data as GetSignalementTypeDto[]);
                } else {
                    setError(response.Message || 'Erreur lors du chargement des types de signalement');
                }
            } catch (err) {
                setError('Une erreur est survenue lors de la connexion au serveur');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchSignalementTypes();
    }, []);

    const handleInputChange = (field: keyof AddSignalementDto, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear validation error when user types
        if (validationErrors[field as keyof typeof validationErrors]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            signalementTypeId: '',
            description: '',
        };

        if (!formData.signalementTypeId) {
            newErrors.signalementTypeId = 'Veuillez sélectionner un type de signalement';
            isValid = false;
        }

        if (!formData.content.trim()) {
            newErrors.description = 'Veuillez décrire le problème';
            isValid = false;
        } else if (formData.content.length < 10) {
            newErrors.description = 'La description doit contenir au moins 10 caractères';
            isValid = false;
        }

        setValidationErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await action.moderationAction.AddSignalementUser(formData );
            if (response.Success) {
                setSubmitSuccess(true);
                // Réinitialiser le formulaire après succès
               
            } else {
                setError(response.Message || 'Erreur lors de l\'envoi du signalement');
            }
        } catch (err) {
            setError('Une erreur est survenue lors de l\'envoi du signalement');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Title title="Chargement..." />
                    <Card.Content style={styles.content}>
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
                    <Card.Content style={styles.content}>
                        <Text style={styles.errorText}>{error}</Text>
                        <Button 
                            mode="contained" 
                            onPress={() => {
                                setError(null);
                                setIsLoading(true);
                                // Recharger les données
                                useEffect(() => {
                                    const fetchSignalementTypes = async () => {
                                        try {
                                            const response = await action.moderationAction.GetSignalementTypeForum() as ServiceResponse<GetSignalementTypeDto[]>;
                                            if (response.Success) {
                                                setSignalementTypes(response.Data as GetSignalementTypeDto[]);
                                            } else {
                                                setError(response.Message || 'Erreur lors du chargement des types de signalement');
                                            }
                                        } catch (err) {
                                            setError('Une erreur est survenue lors de la connexion au serveur');
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    };
                                    
                                    fetchSignalementTypes();
                                }, []);
                            }}
                            style={styles.retryButton}
                        >
                            Réessayer
                        </Button>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    if (submitSuccess) {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Title title="Signalement envoyé" />
                    <Card.Content style={styles.content}>
                        <Text style={styles.successText}>
                            Votre signalement a bien été enregistré. Merci pour votre contribution.
                        </Text>
                        <Button 
                            mode="contained" 
                            onPress={() => setSubmitSuccess(false)}
                            style={styles.successButton}
                        >
                            Nouveau signalement
                        </Button>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    return (
        <AppView>
            <Card style={styles.card}>
                <Card.Title title="Signaler un contenu" />
                <Card.Content style={styles.content}>
                    <Text style={styles.sectionTitle}>Type de signalement</Text>
                    
                  <RadioButton.Group
                        onValueChange={(value: string) => {
                            // Convertir la valeur en number et mettre à jour le state
                            const numericValue = Number(value);
                            setFormData(prev => ({
                                ...prev,
                                signalementTypeId: numericValue
                            }));
                        }}
                        value={formData.signalementTypeId.toString()} // Convertir en string pour le RadioButton.Group
                    >
                        {signalementTypes.map((type: GetSignalementTypeDto) => (
                            <View key={type.id} style={styles.radioItem}>
                                <RadioButton value={type.id.toString()} />
                                <Text>{type.content}</Text>
                            </View>
                        ))}
                    </RadioButton.Group>
                    <HelperText type="error" visible={!!validationErrors.signalementTypeId}>
                        {validationErrors.signalementTypeId}
                    </HelperText>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <TextInput
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        placeholder="Décrivez en détail le problème rencontré..."
                        value={formData.content}
                        onChangeText={text => handleInputChange('content', text)}
                        error={!!validationErrors.description}
                        style={styles.textArea}
                    />
                    <HelperText type="error" visible={!!validationErrors.description}>
                        {validationErrors.description}
                    </HelperText>

                    <Button 
                        mode="contained" 
                        onPress={handleSubmit}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.submitButton}
                    >
                        Envoyer le signalement
                    </Button>
                </Card.Content>
            </Card>
        </AppView>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 16,
        padding: 8,
    },
    content: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    textArea: {
        minHeight: 100,
        marginVertical: 8,
    },
    submitButton: {
        marginTop: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    successText: {
        color: 'green',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
    },
    successButton: {
        marginTop: 16,
        backgroundColor: 'green',
    },
});