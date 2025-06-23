import { GetRatingDto } from "@/interfaces/EscapeGameInterface/Rating/getRatingDto";
import React, { useState } from "react";
import { UnitofAction } from "@/action/UnitofAction";
import  AppView  from "@/components/ui/AppView";
import { Avatar, Button } from "react-native-paper";
import { Card, Text } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams, router } from 'expo-router';
import { mockRatings } from "./Ratinglist";
import FormUtils from "@/classes/FormUtils";
import { Rating,AirbnbRating } from "react-native-ratings";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/ContextHook/AuthContext";

export default function RatingDetails() {
    
    const action =new  UnitofAction();
    const [getRating,setRating]=React.useState<GetRatingDto |null>(mockRatings[0]);
    const [getUser,SetUser]=React.useState<GetUserDto|null>(null);
    const {id}= useLocalSearchParams();
    const [isLoading,setLoading]=React.useState<boolean>(false);
    const [error,setError]=React.useState<string|null>(null);
    const router=useRouter();
    const Auth=useAuth();
    const user=Auth.user;
    const IsAutheur= useState<boolean>(user?.id==getRating?.userId)
    const fecthRating=async()=>{
        setLoading(true);
        const response=await action.ratingAction.GetRatingbyId(Number(id));
        if(response.Success){
            setRating(response.Data as GetRatingDto);
        }
        setLoading(false);
    }
    const fecthUser=async()=>{
        setLoading(true);
        const response=await action.userAction.GetUserById(getRating?.userId as number);
        if(response.Success){
            SetUser(response.Data as GetUserDto);
        }
        setLoading(false);
    }
    React.useEffect(() => {
        fecthRating();
        fecthUser();
    })
    if(isLoading){
        return(
            <AppView>
                <Card>
                    <Card.Content>
                            <ActivityIndicator size="large" color="#6200ee" />
                    </Card.Content>
                    </Card>
            </AppView>
        )
    }
    if(error){
        return(
            <AppView>
                <Text>{error}</Text>
            </AppView>
        )
    }
    if(getRating==null){
        return(
            <AppView>
                <Text>Rating not found</Text>
            </AppView>
        )
    }
    return (
        <AppView>
            <Card>
                <Card.Title title={getRating?.rateTitle} titleStyle={{fontSize:30, textAlign:"center",margin:16}} />
                <Card.Content>
                    <ThemedText type="title" style={{fontSize:20,textAlign: "center"}}>Notes</ThemedText>
                    <Avatar.Image size={100} source={getUser !=null? getUser?.picture : require("@/assets/images/react-logo.png")} />
                   <ThemedText type="default"><Text>Auteur</Text>: {getUser?.username}</ThemedText>
                    <AirbnbRating
                    count={5}
                    reviews={["Terrible", "Bad", "Meh", "OK", "Good"]}
                    defaultRating={getRating?.notes}
                    size={20}
                    />
                    </Card.Content>
                <Card.Content>
                 
                
                   <ThemedText type="default">Creation Date: {FormUtils.FormatDate(getRating?.creationDate)}</ThemedText>
                </Card.Content>
                <Card.Content>
                   <ThemedText type="default"><Text>Description</Text>: {getRating?.rateContent}</ThemedText>
                </Card.Content>
                <Card.Actions>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Button onPress={() => router.back()}>Retour</Button>
                        {IsAutheur && <Button onPress={() => console.log("Edit Rating")}>Edit Rating</Button>}
                        
                    </View>
                </Card.Actions>
            </Card>
        </AppView>
        
    );
}