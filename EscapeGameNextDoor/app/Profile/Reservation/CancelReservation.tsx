import { ThemedText } from "@/components/ThemedText";
import React, { useEffect } from "react"
import { Card } from "react-native-paper";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { UnitofAction } from "@/action/UnitofAction";
import { ActivityIndicator } from "react-native";
import { StyleSheet ,Text} from "react-native";
import AppView from "@/components/ui/AppView";
export default function Cancelreservation()
{
    const action=new UnitofAction();
    const router=useRouter();
    const {id}=useLocalSearchParams();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const [isCancellable, setIsCancellable] = React.useState(false);
    const cancelReservation=async()=>{
        setLoading(true);
        const response=await action.sessionAction.cancelSessionReserved(Number(id));
        if(response.Success){
            setSuccess(response.Message);

        }
        else{
            setError(response.Message);
        }
        setLoading(false);
    }
    const verifyIfisCancellable= async () => {
        try {
            setLoading(true);
      
            const response = await action.sessionAction.Iscancellable(Number(id));
            if (response.Success) {
                setIsCancellable(response.Data as boolean);
            } else {
                setError(response.Message || "Failed to fetch activity");
            }
        } catch (e) {
            setError("An error occurred while fetching activity");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        (async () => {
           await verifyIfisCancellable();
            if (!isCancellable) {
                router.back();
            }
        })();
    }, []);

    if(loading){
        return(
            <AppView>
                <Card>
                    <Card.Content>
                        <View style={styles.container}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    </Card.Content>
                </Card>

            </AppView>
           
        )
    }
    if(error)
    {
        return(
            <AppView>
                <Card>
                    <Card.Content>
                        <View style={styles.container}>
                            <Text>{error}</Text>
                        </View>
                    </Card.Content>
                </Card>

            </AppView>
        
        )
    }
    if(success)
    {
        return(
            <AppView>
                <Card>
                    <Card.Content>
                        <View style={styles.container}>
                            <Text>{success}</Text>
                            <ThemedText>Votre reservation a ete annuler </ThemedText>
                        </View>
                    </Card.Content>
                </Card>
            </AppView>
        )
    }
    if(isCancellable){
        return(
            <Card>
                <Card.Content>
                    <View style={styles.container}>
                        <ThemedText>Vous pouvez annuler votre reservation</ThemedText>
                        <ThemedText onPress={cancelReservation}>Annuler la reservation</ThemedText>
                    </View>
                </Card.Content>
            </Card>
        )
    }
    else
    {
        return(
            <Card>
                <Card.Content>
                    <View style={styles.container}>
                        <ThemedText>Vous ne pouvez pas annuler votre reservation</ThemedText>
                    </View>
                </Card.Content>
            </Card>
        )
    }
}

const styles= StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });