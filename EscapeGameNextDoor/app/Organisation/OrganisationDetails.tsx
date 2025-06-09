import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { UnitofAction } from "@/action/UnitofAction";
import { GetOrganisationDto } from "@/interfaces/OrganisationInterface/Organisation/getOrganisationDto";
import { useState } from "react";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { Alert } from "react-native";
import { Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, Stack, Skeleton, Button, Divider } from "@mui/material";
import AppView from "@/components/ui/AppView";
import { useRouter } from "expo-router";

export default function OrganisationDetails() {
    const { id } = useLocalSearchParams();
    const action = new UnitofAction();
    const [organisation, setOrganisation] = useState<GetOrganisationDto>();
    const [isLoading, setIsLoading] = useState(true);
    const notif = useToasted();
    const router = useRouter();

    const fetchOrganisation = async () => {
        try {
            const response = await action.organisationAction.GetOrganisationById(Number(id));
            if (response.Success) {
                setOrganisation(response.Data as GetOrganisationDto);
                notif.isvisible = true;
                notif.showToast(response.Message, "success");
            }
            else {
                notif.isvisible = true;
                notif.showToast(response.Message, "error");
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganisation();
    }, [id])
    if (isLoading) {
        <AppView>
            <Stack spacing={2} className='p-4'>
                <Skeleton variant="rectangular" width="100%" height={200} />
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
            </Stack>
        </AppView>
    }
    else {

        return (
            <AppView>

                <Stack className="flex flex-row items-center justify-center ">
                    <Card className="p-4 m-2">
                        <CardHeader title={organisation?.name} />
                        <CardMedia component="img" image={organisation?.logo} />
                        <CardContent >
                            <Box className="flex flex-col space-x-2 space-y-2">
                                <p>{organisation?.description}</p>
                                <p>{organisation?.email}</p>
                                <p>{organisation?.phoneNumber}</p>
                                <p>{organisation?.address}</p>
                            </Box>
                        </CardContent>
                        <CardActionArea className='flex flex-row justify-center space-x-2'>
                            <Button 
                            variant="outlined"

                            onClick={() => { } }>Escape Game</Button>
                            <Divider orientation="vertical" flexItem />
                            <Button variant="outlined" onClick={() => {
                                router.push(
                                     {
                                        pathname: "/Notification/Annonce/AnnonceOrganisation",
                                        params: {
                                            id: String(organisation?.orgId)
                                        }
                                    }
                                )
                             }}>Annonce</Button>
                        </CardActionArea>
                    </Card>
                </Stack>
            </AppView>
        );
    }
}