import { UnitofAction } from "@/action/UnitofAction";
import FormUtils from "@/classes/FormUtils";
import { ThemedText } from "@/components/ThemedText";
import AppView from "@/components/ui/AppView";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { AddSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/addSessionReservedDto";
import { GetSessionGameDto } from "@/interfaces/EscapeGameInterface/Session/getSessionGameDto";
import { ServiceResponse } from "@/interfaces/ServiceResponse";
import { useLocalSearchParams, Redirect } from 'expo-router';
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity, Alert,Linking } from "react-native";
import { ChevronLeft, ChevronRight } from "react-native-feather";
import { Card, Divider, TextInput, Button } from "react-native-paper";
import { GetPaymentDto } from "@/interfaces/EscapeGameInterface/Payment/getPaymentDto";
import { GetSessionReservedDto } from "@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto";
import PaymentSuccess from '../../Session/Payment/PaymentSucess';
import { SecureStoreApp } from "@/classes/SecureStore";
const unitOfAction = new UnitofAction();

const PAYMENT="PAYMENT";

export default function PaymentPageredirect() {
    const [isLoading, setIsLoading] = useState(false);
    const {id}= useLocalSearchParams();
    const [error,setError]=useState(""); 
    const [Getpayment,setPayment] = useState<GetPaymentDto>();
    const [paiementid,setpaiement]=useState<number|null>(null);
    const storage=new SecureStoreApp();

    const handleStockData= async (value:number)=> {
       await storage.save(PAYMENT,id);
    }
    const FetchPaiement= async()=> {
        try{
            const response = await unitOfAction.paymentAction.CreatePayment(Number(id));
            if(response.Success)
            {
                setPayment(response.Data as GetPaymentDto);
                if(response.Data?.paymentLink)
                {
                    await handleStockData(response.Data.id);
                    Linking.openURL(response.Data.paymentLink);
                }
                else{
                    console.log(response.Message);
                    setError("une erreur est survenue,le service de paiment est indisponible");
                }
            }
            else{
                setError(response.Message);
            }
        }
        catch{

        }
    }

    const handlePayment = () => {
        if (Getpayment?.paymentLink) {
            window.location.href = Getpayment.paymentLink;
        }
    }

    if(isLoading)
    {
        return (
            <AppView>
                <Card>
                    <Card.Content>
                        <View><ThemedText>
                                Chargement en cours 
                            </ThemedText>
                        
                            </View>
                    </Card.Content>
                    <Card.Content>
                       <ActivityIndicator />
                    </Card.Content>
                </Card>
            </AppView>
        );
    }
    if( error)
    {
        return(
            <AppView>
                <Card style={styles.card}>
                    <Card.Content>
                        <ThemedText>{error}</ThemedText>
                    </Card.Content>
                </Card>
            </AppView>
        )
    }
    if(Getpayment?.paymentLink)
    {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Content style={styles.errorContainer}>
                        <Text>an error occured during the Process</Text>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }
    return (
        <AppView>
            <Card style={styles.card}>
                <Card.Title title="Paiement" titleStyle={styles.gameTitle} />
                <Card.Content style={styles.errorContainer}>
                    <ThemedText>une erreur est survenue,le service de paiment est indisponible</ThemedText>
                    <Button onPress={FetchPaiement}>Recharger</Button>
                </Card.Content>
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
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '600',
      
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
