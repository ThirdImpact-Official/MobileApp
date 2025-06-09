import { useEffect,useState } from "react";
import { useLocalSearchParams, router } from 'expo-router';
import { UnitofAction } from "@/action/UnitofAction";
import AppView from "@/components/ui/AppView";
import { GetAnnonceDto } from "@/interfaces/NotificationInterface/Annonce/getAnnonceDto";
import { Pagination } from "@mui/material";
import { useRouter } from "expo-router";
import {Stack ,Card ,CardContent,CardMedia,CardHeader,CardActionArea,CardActions,Box,Button,Divider} from "@mui/material";
export default function AnnonceOrganisation() {
    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [annonce, setAnnonce] = useState<any[]>([]);
    const [ page,setPage]= useState<number>(1);
    const action = new UnitofAction();
    const fetchAnnonce=async()=>{
        try
        {
            const response= await action.annonceAction.GetAllAnnonceByOrganisationId(Number(id),page,5);
            if(response.Success)
            {
                setAnnonce(response.Data as any[]);
            }

        }
        catch(e)
        {
            console.log(e);
        }
        finally
        {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchAnnonce();
    })
    return (
        <AppView>
            {annonce.map((annonce) => (
                <AnnonceItem key={annonce.id} organisation={annonce} />
            ))}
            <Pagination
                count={annonce.length}
                page={page}
                onChange={(e, page) => {
                    setPage(page);
                }}
            />
            
        </AppView>
    );
}

function AnnonceItem({ organisation }: { organisation: GetAnnonceDto }) {
    const router = useRouter();

    return (
        <Stack className="flex flex-row items-center justify-center">
            <Card className="p-4 m-2">
                <CardHeader title={organisation.name} />
                <CardMedia component="img" image={organisation.image} />
                <CardContent>
                    <Box className="flex flex-col space-x-2 space-y-2">
                        <p>{organisation.description}</p>
                        
                    </Box>
                </CardContent>
                <CardActions className="flex flex-row justify-center space-x-2">
                    <Button variant="outlined" onClick={() => { }}>
                        Escape Game
                    </Button>
                    <Divider orientation="vertical" flexItem />
                    <Button
                        variant="outlined"
                        onClick={() => {
                            router.push({
                                pathname: "/Notification/Annonce/AnnonceOrganisation",
                                params: {
                                    id: String(organisation.id)
                                }
                            })
                        }}
                    >
                        Annonce
                    </Button>
                </CardActions>
            </Card>
        </Stack>
    );
}
