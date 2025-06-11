import { GetActivityPlaceDto } from "@/interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto";
import { CardHeader, Card, CardMedia, CardContent, Skeleton, CardActions } from '@mui/material';
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
    const [activity, setActivity] = useState<GetActivityPlaceDto | null>(data || null);
    const [isLoading, setIsLoading] = useState<boolean>(!data);
    const { id } = useLocalSearchParams();
    const toasted = useToasted();
    const httpAction = new UnitofAction();

    const buttonList = [
        { label: "Book Now", url: "/booking", icon: () => <></> },
        { label: "Share", url: "", icon: () => <></> },
        { label: "Favorite", url: "", icon: () => <></> },
    ];

    const fetchActivity = async () => {
        if (!id) return;
        
        try {
            setIsLoading(true);
            console.log(id);
            const response = await httpAction.escapeGameAction.getActivityPlaceById(Number(id));
            
            if (response.Success) {
                setActivity(response.Data as GetActivityPlaceDto);
                console.log(response.Data);
                toasted.showToast(response.Message, "success");
            } else {
                // Handle API error response
                toasted.showToast("Failed to load activity details", "error");
                // Fallback to test data if available
                setActivity(testActivityPlace || null);
            }
        } catch (error) {
            console.error("Error fetching activity:", error);
            toasted.showToast("An error occurred while loading activity details", "error");
            // Fallback to test data if available
            setActivity(testActivityPlace || null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch if we don't have data prop and we have an id
        if (!data && id) {
            fetchActivity();
        } else if (data) {
            setIsLoading(false);
        }
    }, [id, data]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <Card>
                    <CardHeader title={<Skeleton variant="text" width="60%" />} />
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                        {[
                            { label: "Description" },
                            { label: "Address" },
                        ].map((item, index) => (
                            <div key={index} style={{ marginBottom: 8 }}>
                                <strong>{item.label}:</strong> <Skeleton variant="text" width="80%" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            );
        }

        if (!activity) {
            return (
                <Card>
                    <CardContent>
                        <div>No activity data available</div>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card className="flex flex-col justify-center  ">
                <CardHeader title={activity.name} />
                <CardMedia 
                    component="img"
                    height="200"
                    image={activity.imgressources}
                    alt={activity.name}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                    {[
                        { label: "Name", value: activity.name }, 
                        { label: "Description", value: activity.description },
                        { label: "Address", value: activity.address },
                        
                    ].map((item, index) => (
                        <div key={index} style={{ marginBottom: 8 }}>
                            <strong>{item.label}:</strong> {item.value}
                        </div>
                    ))}
                </CardContent>
                <CardActions>
                    {buttonList.map((item, index) => (
                        <button key={index} style={{ marginRight: 8 }}>
                            {item.label}
                        </button>
                    ))}
                </CardActions>
            </Card>
        );
    };

    return (
        <AppView>
            {renderContent()}
        </AppView>
    );
};

export default ActivityPlaceDetail;