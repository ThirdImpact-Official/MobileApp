import { UnitofAction } from "@/action/UnitofAction";
import { Typography,Card,CardContent,CardHeader } from "@mui/material";
import { useLocalSearchParams } from "expo-router";
export default function Cancelreservation()
{
    const {id} =useLocalSearchParams();
    const action = new UnitofAction()

    
    return(
        <>
            <Card>
                <CardHeader 
                    title="Cancel Reservation"
                />
                <CardContent>
                    <Typography>
                        Are you sure you want to cancel this reservation?
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}