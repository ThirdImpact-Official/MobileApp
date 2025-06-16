import React from 'react';
import AppView from '@/components/ui/AppView';
import { useState } from 'react';
import { ActivityIndicator, Card, List } from 'react-native-paper';
import { View, Text } from 'react-native'
import { GetForumDto } from '@/interfaces/PublicationInterface/Forum/getForumDto';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
export default function ForumList()
{
    const [error,setError] =useState<string>("");
    const [isloading,setIsloading]=useState<boolean>(true);
    const [forum,setForum]=useState<GetForumDto[] | null>([]);
    if(isloading)
    {
        return(
            <AppView>
                <Card>
                    <Card.Title title="" />
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