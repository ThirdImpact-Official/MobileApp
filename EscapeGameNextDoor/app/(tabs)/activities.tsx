import React, { useEffect } from 'react';
import AppView from '@/components/ui/AppView';
import { useState } from 'react';
import { ActivityIndicator, Card, List } from 'react-native-paper';
import { View, Text } from 'react-native'
import { GetForumDto } from '@/interfaces/PublicationInterface/Forum/getForumDto';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import { UnitofAction } from '@/action/UnitofAction';
import { ServiceResponse } from '@/interfaces/ServiceResponse';
export default function ForumList()
{
    const [error,setError] =useState<string>("");
    const [isloading,setIsloading]=useState<boolean>(true);
    const [forum,setForum]=useState<GetForumDto[] | null>([]);
    const [page,setpage] =useState<number>(1);
    const PAGE_SIZE=5;
    const action = new UnitofAction();

    /**
     * recupération des escapeGame present sur l'application
     */
    const FetchAllforumSelection=async()=> {
        try
        {
            const response= await action.forumAction.getAllForums(page,PAGE_SIZE)
            if(response.Success)
            {
                setForum(response.Data as GetForumDto[]);
                
            }
            else{
            
                setError(response.Message)
            }
            setIsloading(false);
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        }
    }
    const FetchByOrganisation = async ()=> {
          try
        {
            const response= await action.forumAction.getAllForums(page,PAGE_SIZE)
            if(response.Success)
            {
                setForum(response.Data as GetForumDto[]);
                
            }
            else{
            
                setError(response.Message)
            }
            setIsloading(false);
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        }
    }
    useEffect(()=> {
        
        FetchAllforumSelection();
    },[])
    if(isloading)
    {
        return(
            <AppView>
                <Card>
                    <Card.Title title="Loading" />
                    <Card.Content>
                        <View>
                            <ActivityIndicator></ActivityIndicator>
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
                    <Card.Title title="" />
                  
                    <Card.Content>
                        {/* Add content here if needed */}
                        <View>
                            <Text>{error}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </AppView>)
    }

    if(!isloading)
    {
        return (<AppView>
            <Card>
                <Card.Title  title="" />
                <Card.Content>
                    <View>
                        
                    </View>
                </Card.Content>
                <Card.Content>
                    <View>
                        <List.Section>
                            {
                                forum?.map((item, idx) => (
                                    <List.Item
                                        key={item.id ?? idx}
                                        title={item.title}
                                        left={(prop)=><Text>{item.creationDate}</Text> }
                                    />
                                ))
                            }
                        </List.Section>
                    </View>
                </Card.Content>
            </Card>
        </AppView>)
    }
}