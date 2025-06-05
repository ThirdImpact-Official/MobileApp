import { CardHeader,Card,CardContent,CardActions, Skeleton, Typography, CardMedia, Button, Divider, Icon } from "@mui/material";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { FC, useEffect, useState } from "react";
import { UnitofAction } from "@/action/UnitofAction";
import { ServiceResponse,PaginationResponse } from "@/interfaces/ServiceResponse";
import { useToasted } from "@/context/ContextHook/ToastedContext";
import { Title } from "@mui/icons-material";
interface EscapeGameDetailProps {
    Id?: number | null | undefined;
}
const EscapeGameDetail :FC<EscapeGameDetailProps>= (props) =>{
    const action = new UnitofAction();
    const [escapeGame,setEscapeGame]= useState<GetEscapeGameDto | null>(null);
    const notif= useToasted();  
    const buttonlst=[
        {label:"Session",url:"../SessionGame/SessionGameList.tsx",icon:()=>{}},
        {label:"Activity place",url:"../../ActivitityPlace/ActivitityPlaceList",icon:()=>{}},
        {label:"Organisation",url:"",icon:()=>{}},
        {label:"Avis ",url:"../Rating/RatingList",icon:()=>{}},
    ]
    const fetchEscape= async(id:number)=>{
        try {
            const response : ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto> = await action.escapeGameAction.getEscapeGameById(id);
            if(response.Success){
                setEscapeGame(response.Data as GetEscapeGameDto);
                notif.showToast(response.Message,"success");
                notif.isvisible=true;
            }
            else{
                notif.showToast(response.Message,"success");
                notif.isvisible=true;
            }
        }
        catch(e) {
            console.log(e);
        }
    }
    useEffect(()=>{
        if(props.Id !== undefined && props.Id !== null && props.Id < 0)
        {
            fetchEscape(props.Id);
        }
    },[props.Id]);

    if(props.Id===null || props.Id===undefined || props.Id>0 ) {
        return (
        <>
          <Card>
                <CardHeader title={<><Skeleton></Skeleton></>} />
                <CardContent>
                    <Skeleton></Skeleton>
                </CardContent>
                <CardActions>
                    {
                        buttonlst.map(item=>(
                            <Button key={item.label} href={item.url}>{item.label}</Button>
                        ))
                    }
                </CardActions>
            </Card>
        </>
        )
    }
    else
    {
        return (
        <>
            <Card>
                <CardHeader 
                    title={<>
                        <Typography>
                            { escapeGame?.esgTitle}
                        </Typography>
                    </>} />
                <CardMedia
                    component="img"
                    height="194"
                    image={escapeGame?.esgImgResources}
                    alt="Paella dish"
                />
                <CardContent>
                    {
                        escapeGame && 
                        [
                            { label: "Id", value: escapeGame.esgId?.toLocaleString() },
                            { label: "Title", value: escapeGame.esgTitle },
                            { label: "Description", value: escapeGame.esgContent},
                            { label: "PhoneNumber", value: escapeGame?.esgPhoneNumber },
                            { label: "Difficulty", value: escapeGame?.esg_DILE_Id },
                            { label: "Price", value: escapeGame?.esg_Price_Id },
                            { label: "Pour Enfants", value: escapeGame?.esg_IsForChildren },
                        ].map(item => (
                            <Typography key={item.label}>{`${item.label}: ${item.value || ""}`}</Typography>
                        ))
                    }
                </CardContent>
                <CardActions>
                    {
                        buttonlst.map(item=>(
                            <Button key={item.label} href={item.url}>{item.label}</Button>
                        ))
                    }
                </CardActions>
            </Card>
        </>)

    } 

}
