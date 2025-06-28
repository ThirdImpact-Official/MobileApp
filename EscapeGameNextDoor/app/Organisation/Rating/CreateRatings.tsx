import { View, Text,StyleSheet,Alert  } from "react-native";
import { Button, Card, TextInput, } from 'react-native-paper';
import AppView from '../../../components/ui/AppView';
import React from "react";
import { AirbnbRating } from "react-native-ratings";
import LinearGradientWrapSynthwave from "@/components/ui/synthwaveGradienbt";
import { UnitofAction } from "@/action/UnitofAction";
import { useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useCallback } from "react";
import { AddRatingDto } from "@/interfaces/EscapeGameInterface/Rating/addRatingDto";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { GetCompleteGameDto } from "@/interfaces/EscapeGameInterface/CompleteGame/getCompleteGameDto";
import { ServiceResponse } from "@/interfaces/ServiceResponse";
export default function CreateRatings() {
    const{ id} = useLocalSearchParams();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const action= new UnitofAction();
    const router= useRouter();
    const[Userrating,setUserRating]=React.useState<number>(0);
    const [newrating ,setNewRating]=React.useState<AddRatingDto>({
       notes: 0,
       rateTitle: "",
       rateContent: "",
       completedgameId:0,
       userId: 0  
    });
    const [validationErrors, setValidationErrors] = React.useState<{ [key: string]: string | undefined }>({});
    const CreateRating=async()=>{
        if(newrating.rateTitle.length<3){
            setError('Title must be at least 3 characters long.');
            return;
        }
        if(newrating.rateContent.length<3){
            setError('Content must be at least 3 characters long.');
            return;
        }
        if(Userrating<1){
            setError('Rating must be at least 1.');
            return;
        }
        const updatedRating = { ...newrating, notes: Userrating };
        setNewRating(updatedRating);
        setLoading(true);
        console.log(newrating);
        const response=await action.ratingAction.CreateRating(newrating);
        if(response.Success){
            router.back();
        }
        setLoading(false);
    }

    const fetchHandleCompletedGame=async()=> 
    {
        const response = await action.completegameAction.getCompletedGameBysessionId(Number(id)) as ServiceResponse<GetCompleteGameDto>;
        if(response.Success)
        {
            if(response.Data !== null)
            {
                setNewRating((prev) => ({
                  ...prev,
                  completedgameId: response.Data.id,
                  userId: response.Data.userId // si tu veux assigner l'utilisateur aussi ici
              }));

            }
        }
        else{
            setError(response.Message)
        }
    }
    const handleRatingChange = (rating: number) => {
        fetchHandleCompletedGame()
        setUserRating(rating);
        console.log('Selected rating:', rating);
    }
    if(loading){
        return(
            <AppView>
                <Card>
                    <Card.Title title="Create Rating" />
                    <Card.Content>
                        <View style={{flex:1}}>
                              <ActivityIndicator size="large" color="#6200ee" />
                          
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
                    <Card.Title title="Create Rating" />
                    <Card.Content>
                        <View style={{flex:1}}>
                            <Alert />
                          
                        </View>
                    </Card.Content>
                </Card>
            </AppView>
        )
    }
    return (
        <AppView>
            <Card>
            <LinearGradientWrapSynthwave>
            <Card.Title title="Create Rating" />
            </LinearGradientWrapSynthwave>
            <Card.Content>
                 {/* General error message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessageText}>{error}</Text>
              </View>
            )}
            <View>
                    <View style={styles.inputContainer}>
                        <ThemedText>Envie de partager votre expérience de jeu ?</ThemedText>
                          <ThemedText>n'hésitez pas à laisser un avis</ThemedText>
                            <ThemedText></ThemedText>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput 
                        label="Title"  
                        mode="outlined"
                        value={newrating.rateTitle}
                        onChangeText={(e)=>setNewRating({ ...newrating, rateTitle: e })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                         label="Description"
                          mode="outlined"   
                        value={newrating.rateContent}
                        onChangeText={(e)=>setNewRating({ ...newrating, rateContent: e })}
                        />
                    </View>
                  
                    <View style={styles.inputContainer}>

                        <AirbnbRating count={5} defaultRating={Userrating} onFinishRating={handleRatingChange} size={20}  />
                    </View>
                  
               </View>
            </Card.Content>
                <LinearGradientWrapSynthwave>
            <Card.Actions>
                <Button mode="outlined" onPress={CreateRating}>Envoyer</Button>
            </Card.Actions>
            </LinearGradientWrapSynthwave>
            </Card>
    </AppView>
    );
}

const styles=StyleSheet.create({
    inputText:{
        width:'100%',
        marginTop:10,
        marginBottom:10
    },
    inputContainer:{
         marginTop:10,
        marginBottom:10,
        display:'flex',
        textAlign:'center',
        alignItems:'center',
    },
      errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorMessageText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  validationError: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 12,
  },
})