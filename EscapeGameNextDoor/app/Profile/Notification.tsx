import AppView from "@/components/ui/AppView";
import React, { useEffect, useState } from "react";
import { View, Text, Touchable, TouchableOpacity ,Linking} from "react-native";
import { ScrollView } from "react-native";
import {Button, Surface } from "react-native-paper";
import {Card ,List, Modal} from "react-native-paper";
import { GetNotificationDto } from "@/interfaces/NotificationInterface/Notification/getNotificationDto";
import { UnitofAction } from "@/action/UnitofAction";
import { FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ActivityIndicator } from "react-native";
import { PaginationResponse } from "@/interfaces/ServiceResponse";
import FormUtils from "@/classes/FormUtils";
import { ServiceResponse } from "@/interfaces/ServiceResponse";
import { router } from "expo-router";
const PAGE_SIZE = 5;
export default function NotificationComponent() {

    const [Error,setError]= useState<string|null>(null);
    const [isLoading,setLoading]= useState<boolean>(false);
    const [isEmpty,setEmpty]= useState<boolean>(false);
    const [notificationsList,setNotificationsList]= useState<GetNotificationDto[]>([]);
    const [notification,setNotification]= useState<GetNotificationDto | null>(null);
    const [notificationCount,setNotificationCount]= useState<number>(0);
    const [totalPages,setTotalPages]= useState<number>(1);
    const [page,setPage]= useState<number>(1);
    const action= new UnitofAction();
    const [visibility,setVisibility]= useState<boolean>(false);
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await action.notificationAction.getAllNotifications(page,PAGE_SIZE) as PaginationResponse<GetNotificationDto>; ;
            if (response.Success) {
                setNotificationsList(response.Data as GetNotificationDto[]);
                setNotificationCount(response.TotalPage);
                setTotalPages(response.TotalPage);
            } else {
                setError(response.Message);
            }
        } catch (e) {
            console.log(e);
            setError("an error has occured during the request");
        } finally {
            setLoading(false);
        }
    }
    const handleOpenModal=()=> setVisibility(true);
    const handleCloaseModal=()=> setVisibility(false);
    const handleNotificationPress = (notification: GetNotificationDto | null) => {
  if (!notification) return;
  
  setNotification(notification);
  handleOpenModal();
  handleSetVisisbiliTy(notification.id as number);
};

const handleLinkPress = () => {
  if (!notification?.link) {
    console.log("no link");
    return;
  }
  if (notification.link.startsWith('http')) {
    Linking.openURL(notification.link);
    return;
  }

  try {
    router.push(notification.link);
  } catch (e) {
    console.error("Navigation error:", e);
    // Fallback si la navigation échoue
    Linking.openURL(notification.link).catch(err => 
      console.error("Failed to open link:", err)
    );
  }
};

    const handleSetVisisbiliTy= async(id: number)=> {
        try
        {
            const response= await action.notificationAction.setNotificationVisibility(id) as ServiceResponse<GetNotificationDto>;
            setNotification(prev => prev ? { ...prev, isRead: true } : prev);
            if(response.Success)
            {
                fetchNotifications();
            }

        }
        catch(err)
        {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchNotifications();
    },[])
    if(Error)
    {
        <AppView>
            <Card>
                <Card>
                    <Card.Title title="Error" />
                    <Card.Content>
                        <View>
                            <h1>Error</h1>
                            <p>{Error}</p>
                        </View>
                    </Card.Content>
                </Card>
             
            </Card>
        </AppView>
    }
    if(isLoading)
    {
        <AppView>
            <Card>
                <Card.Title title="Loading" />
                <Card.Content>
                    <View>
                        <h1>Loading</h1>
                        <p>Loading...</p>
                    </View>
                </Card.Content>
            </Card>
        
        </AppView>  
    }

    return (
        <AppView>
            <Surface style={{marginBottom:10,textAlign:"center" }}>
                <Card>
                    <Card.Title title="Notifications" />
                    <Card.Content>
                    <View>
                      <ThemedText>
                         <h1>Notification Component</h1>
                        <p>This is a placeholder for the Notification component.</p>
                        </ThemedText> 
                    </View>
                    </Card.Content>
                </Card>

            </Surface>
            <Card>
                <List.Section>
                <List.Subheader>Notifications</List.Subheader>
                    {
                        notificationsList.map((notification) => (
                            <TouchableOpacity onPress={()=>{
                                setNotification(notification)
                                handleOpenModal();
                                handleSetVisisbiliTy(notification.id as number);
                            }

                            }>
                              
                                <List.Item
                                    key={notification.id}
                                    title={notification.title}
                                    description={notification.content}
                                />
                            </TouchableOpacity>
                        ))
                    }
                </List.Section>
            </Card>
            <Modal visible={visibility} onDismiss={handleCloaseModal} >
                <Card>
                    <Card.Title title={notification?.title} titleStyle={{textAlign:"center"}}  right={()=> <ThemedText>

                        <Text>{notification?.isRead ? "Read" : "Unread"} {FormUtils.FormatDate(notification?.creationDate)}</Text>
                    </ThemedText>
                        }
                         />
                    <Card.Content>
                        <TouchableOpacity onPress={()=>notification?.link !=null ? handleLinkPress() : console.log("no link")}>
                            <View>
                            <ThemedText>
                                    <Text>{notification?.content}</Text>
                                </ThemedText> 
                            </View>
                          
                        </TouchableOpacity>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={handleCloaseModal}>Close</Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </AppView>
    );
}