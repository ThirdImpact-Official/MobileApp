import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Card, Button, Text, RadioButton, HelperText, TextInput } from 'react-native-paper';
import { UnitofAction } from '@/action/UnitofAction';
import { GetSignalementTypeDto } from '@/interfaces/EscapeGameInterface/Moderation/getSignalementTypeDto';
import { useLocalSearchParams } from 'expo-router';
import { ServiceResponse } from '@/interfaces/ServiceResponse';
import AppView from '../../components/ui/AppView';
import { AddSignalementForumDto } from '@/interfaces/Moderation/addSignalementDto';

export default function SignalementPostForum() {
    const { id } = useLocalSearchParams();
    const [signalementTypes, setSignalementTypes] = useState<GetSignalementTypeDto[]>([]);
    const [formData, setFormData] = useState<AddSignalementForumDto>({
        forumId: null ,
        postForumId: Number(id),
        signalementTypeId: 0,
        content: '',
        userId: 0,
      
    });
    const [validationErrors, setValidationErrors] = useState({
        signalementTypeId: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const action = new UnitofAction();

    const handleretry = () => {
        setIsLoading(true);
        setError(null);
        fetchSignalementTypes();
    }

    const fetchSignalementTypes = async () => {
        try {
            const res = await action.moderationAction.GetSignalementTypeForum() as ServiceResponse<GetSignalementTypeDto[]>;
            if (res.Success) {
                setSignalementTypes(res.Data as GetSignalementTypeDto[]);
            } else {
                setError(res.Message || "Erreur lors du chargement des types de signalement");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la connexion au serveur");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSignalementTypes();
    }, []);

    const handleInputChange = (field: keyof AddSignalementForumDto, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

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
            const response = await action.moderationAction.CreateSignalementForum(formData);
            if (response.Success) {
                setSubmitSuccess(true);
            } else {
                setError(response.Message || "Erreur lors de l'envoi du signalement");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de l'envoi du signalement");
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
                            onPress={handleretry}
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
                            onPress={() => {
                                setSubmitSuccess(false);
                                setFormData({
                                    ...formData,
                                    signalementTypeId: 0,
                                    content: ''
                                });
                            }}
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
                        onChangeText={(text: string) => handleInputChange('content', text)}
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
        borderRadius: 8,
    },
    content: {
        paddingVertical: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    successText: {
        color: 'green',
        marginBottom: 16,
    },
    retryButton: {
        marginTop: 16,
    },
    successButton: {
        marginTop: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    textArea: {
        marginTop: 8,
        marginBottom: 8,
    },
    submitButton: {
        marginTop: 16,
    },
});