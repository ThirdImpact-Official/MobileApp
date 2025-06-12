import { UnitofAction } from "@/action/UnitofAction";
import { Card, CardHeader } from "@mui/material";
import { useRouter } from "expo-router";
import { useEffect , useState } from "react";
import {useLocalSearchParams} from "expo-router";
import { GetAnnonceDto } from "@/interfaces/NotificationInterface/Annonce/getAnnonceDto";
export default function AnnonceDetails()
{
    const {id}=useLocalSearchParams();

    const router =useRouter();
    const action= new UnitofAction();
    const [annonce,setAnnonce]= useState<GetAnnonceDto>();
    const fetchActionDetails= async()=> {
        const response = await action.annonceAction.getAnnonceById(Number(id));
        if(response.Success)
        {

            console.log(response.Data);
        }
    };

    useEffect(()=> {

    });
    return(
        <>
            <Card>
                <CardHeader
                    title="Annonce"
                  />
            </Card>
        </>
    )
}