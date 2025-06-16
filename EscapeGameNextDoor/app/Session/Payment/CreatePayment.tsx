import { useLocalSearchParams } from "expo-router"
import AppView from '@/components/ui/AppView';
import { ActivityIndicator, Button, Card,Text, } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { UnitofAction } from "@/action/UnitofAction";
import { GetPaymentDto } from '@/interfaces/EscapeGameInterface/Payment/getPaymentDto';

const action = new UnitofAction();
/**
 * component pour 
 * @returns 
 */
export default function Createpayment(){

    const {id} = useLocalSearchParams(); 
    const [isloading,setIsloading] = useState<boolean>(false);
    const [isError,setIsError] = useState<boolean>(false);
    const [error,setError]= useState<string>("");
    const [payment,setPayment] =useState<GetPaymentDto>();

    const retrievePayment = async () => {
        try
        {
            const response = await action.paymentAction.CreatePayment(Number(id))
            if(response.Success)
            {
                    setPayment(response.Data as GetPaymentDto);
                  setIsError(false);
            }
            else{
                setError(response.Message);
                setIsError(true);
            }
        }
        catch(err)
        {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
            setIsError(true);
        }
    }
    useEffect(() => {
        retrievePayment();
    }, []);
    if (isloading) {
        return (
            <AppView>
                <Card>
                    <Card.Content>
                        <ActivityIndicator />
                    </Card.Content>
                </Card>
            </AppView>
        );
    }
    if (isError) {
        return (
            <AppView>
                <Card>
                    <Card.Content>
                        <Text>
                            {error}
                        </Text>
                    </Card.Content>
                </Card>
            </AppView>
        );
    }
    return (
        <AppView>
            <Card>
                <Card.Content>
                    <Text>
                        vous pouvez proceder au paiement pour confirmer votre reservation
                    </Text>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={() => {
                        // TODO: Implement payment logic here
                        console.log('Payment button pressed');
                    }}>Payment</Button>
                </Card.Actions>
            </Card>
        </AppView>
    );
}
