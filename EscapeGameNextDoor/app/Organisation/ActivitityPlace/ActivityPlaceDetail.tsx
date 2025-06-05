import { GetActivityPlaceDto } from "@/interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto";
import { Label } from "@mui/icons-material";
import { CardHeader,Card, CardMedia, CardContent, Skeleton, CardActions } from '@mui/material';
import { FC, useEffect, useState } from "react";
import { testActivityPlace } from "@/TestData/ActivityPlacetestData";
import { useLocalSearchParams } from "expo-router";
import { UnitofAction } from "@/action/UnitofAction";
import AppView from "@/components/ui/AppView";
import { useToasted } from "@/context/ContextHook/ToastedContext";

interface ActivityDetailProps {
    data?: GetActivityPlaceDto;
}

const ActivityPlaceDetail: FC<ActivityDetailProps> = ({ data }) => {
    const [activity, setActivity] = useState<GetActivityPlaceDto | null | undefined>(data !== undefined ? data : testActivityPlace);
    const { id} =useLocalSearchParams();
    const toasted = useToasted();
    const httpAction = new UnitofAction();
    const buttonList = [
        { label: "", url: "", icon: () => <></> },
        { label: "", url: "", icon: () => <></> },
        { label: "", url: "", icon: () => <></> },
    ];
    //useeffect
    const fetchActivity = async ()=> {
        try {
            const response = await httpAction.escapeGameAction.getActivityPlaceById(Number(id));
            if (response.Success) {
                setActivity(response.Data as GetActivityPlaceDto);
                toasted.showToast(response.Message, "success");
            }
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        fetchActivity();
    },[id]);
    //rendreing
    if (activity) {
        return (
            <AppView>

            <Card>
                <CardHeader title={activity.name} />
                <CardMedia 
                    component="img"
                    image={activity.imgressources} />
                <CardContent>
                    {[
                        { label: "Name", value: activity.name }, 
                        { label: "Description", value: activity.description },
                        { label: "Address", value: activity.address },
                    ].map((item, index) => (
                        <div key={index}>{item.label} : {item.value}</div>
                    ))}
                </CardContent>
                <CardActions>
                    {buttonList.map((item, index) => (
                        <div key={index}>{item.label}</div>
                    ))}
                </CardActions>
            </Card>
        </AppView>
        );
    } else {
        return (
            <AppView>

            <Card>
                <CardHeader title={<Skeleton />} />
                <CardMedia />
                <CardContent>
                    {[
                        { label: "Description", value: <Skeleton /> },
                        { label: "Address", value: <Skeleton /> },
                    ].map((item, index) => (
                        <div key={index}>{item.label} : {item.value}</div>
                    ))}
                </CardContent>
            </Card>
        </AppView>
        );
    }
};

export default ActivityPlaceDetail;