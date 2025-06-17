import React, { useCallback, useEffect } from 'react';
import AppView from '@/components/ui/AppView';
import { useState } from 'react';
import { ActivityIndicator, Button, Card, Divider, List } from 'react-native-paper';
import { View, Text } from 'react-native'
import { GetForumDto } from '@/interfaces/PublicationInterface/Forum/getForumDto';
import ItemDisplay from '@/components/factory/GenericComponent/ItemDisplay';
import { UnitofAction } from '@/action/UnitofAction';
import { PaginationResponse, ServiceResponse } from '@/interfaces/ServiceResponse';
import { StyleSheet } from 'nativewind';

import { SettingsAccessibility } from '@mui/icons-material';
import Organisation from '../../../../Webclient/webclient/src/pages/app/UserOrganisation';
import { GetOrganisationDto } from '@/interfaces/OrganisationInterface/Organisation/getOrganisationDto';
import { Picker } from '@react-native-picker/picker';
import FormatUtils from '@/classes/FormUtils';
import { useRouter } from 'expo-router';
export default function ForumList()
{
    const [error,setError] =useState<string>("");
    const [isloading,setIsloading]=useState<boolean>(true);
    const [forum,setForum]=useState<GetForumDto[] | null>([]);
    const [organisation,setOrganisation]=useState<GetOrganisationDto[]>([]);
    const [selectOrganisation,setSelectOrganisation] =useState<GetOrganisationDto | null>();
    const [page,setpage] =useState<number>(1);
    const [totalpage,setTotalPage]= useState<number>(1)
    const PAGE_SIZE=5;
    const action = new UnitofAction();
    const router =useRouter(); 
    /**
     * recupération des escapeGame present sur l'application
     */
    const FetchAllforumSelection=async()=> {
        try
        {
            const response= await action.forumAction.getAllForums(page,PAGE_SIZE) as PaginationResponse<GetForumDto>
            if(response.Success)
            {
                setForum(response.Data as GetForumDto[]);
                setTotalPage(response.TotalPage)
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
            const response= await action.forumAction.getOrganisationById(selectOrganisation?.orgId as number,page,PAGE_SIZE) as PaginationResponse<GetForumDto>
            if(response.Success)
            {
                setForum(response.Data as GetForumDto[]);
                
            }
            else
            {
                setForum([]);
            }
           
            setIsloading(false);
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
               setIsloading(false)
        }
    }
    const fetchallOrganisation=async ()=> {
        try
        {
            //nécéssite de creer une méthodes spécifiquemment conçu pour cela plus tard 
            const response= await action.organisationAction.GetAllOrganisation(1,20) as PaginationResponse<GetOrganisationDto>;

            if(response.Success)
            {
                setOrganisation(response.Data as GetOrganisationDto[])

            }
            else{
                setError(response.Message)
            }
            setIsloading(false)
        }
        catch
        {

        }
    };
    const HandleOrganisation= useCallback((value: GetOrganisationDto | null )=> {
        console.log(value as GetOrganisationDto)
        console.log(value?.orgId)
        setSelectOrganisation(value);
        setpage(1);
        if(value?.orgId)
        {
            FetchByOrganisation()
        }
        else{
            FetchAllforumSelection();
        }
    },[FetchAllforumSelection,FetchByOrganisation]);

    useEffect(()=> {
        
        FetchAllforumSelection();
        fetchallOrganisation();
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
                <Card.Title  title="List des Forums"  titleStyle={style.forumtitle}/>
                <Card.Content>
                    <View>
                        <Text>Filtrer par organisation</Text>
                        <Picker 
                        
                        selectedValue={selectOrganisation}

                        onValueChange={HandleOrganisation}>

                        <Picker.Item label="organisation" value={null} />
                            {
                                organisation.map((item) => (
                                    <Picker.Item key={item.orgId} label={item.name} value={item} />
                                ))
                            }
                        </Picker>
                    </View>
                </Card.Content>
                <Card.Content>
                    <View>
                        <List.Section>
                            {
                                forum?.map((item, idx) => (
                                    <React.Fragment>
                                        <List.Item
                                            key={item.id ?? idx}
                                            title={item.title}
                                            className='text-center p-2 hover:'
                                            onPress={() =>
                                                router.push({
                                                    pathname: '/Forum/Forum',
                                                    params: { id: item.id },
                                                })
                                            }
                                            right={(prop)=><Text>{FormatUtils.FormatDate(item.creationDate)}</Text> }
                                        />
                                        <Divider></Divider>
                                    </React.Fragment>
                                ))
                            }
                        </List.Section>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <View className='text-center items-center justify-center '>
                        <Text>
                            <Button 
                            onPress={()=> setpage(page-1)} >precedentes</Button>
                       {page} page / {totalpage}
                            <Button
                              onPress={()=> setpage(page+1)}
                            >Suivant</Button>
                        </Text>
                    </View>
                </Card.Actions>
            </Card>
        </AppView>)
    }
}
/**
 * 
 */
const style=StyleSheet.create({
    
    forumtitle:{
        textAlign:"center"
    }
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  listContainer: {
    flex: 1,
  },
  forumItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#aabbcc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  forumContent: {
    flex: 1,
  },
  forumTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  forumDescription: {
    fontSize: 14,
    color: "#444",
  },
  forumImage: {
    width: 80,
    height: 60,
    marginLeft: 12,
    borderRadius: 6,
    backgroundColor: "#ece6f0", // placeholder background
  },
});
