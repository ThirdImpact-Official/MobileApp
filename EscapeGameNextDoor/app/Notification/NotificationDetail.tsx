import { Card, CardContent, CardHeader, Skeleton, Typography } from "@mui/material";
import { GetNotificationDto } from "@/interfaces/NotificationInterface/Notification/getNotificationDto";
import React from "react";
import { ThemedText } from '../../components/ThemedText';
import FormUtils from "@/classes/FormUtils";


interface Props {
    data: GetNotificationDto | undefined | null;
}

export default function NotificationDetail(item:Props) {
    const [notif, setNotif] = React.useState<GetNotificationDto | undefined | null>(item.data);

    console.log(notif);
    if(notif === null || notif === undefined){ 
        return (
            <Card elevation={3} className="flex justify-center items-center md:w-1/2 w-full">
                <CardHeader title={"Loading..."}
                    action={<React.Fragment>
                                <Typography>
                                    <Skeleton></Skeleton>
                                </Typography>
                        </React.Fragment>} />
                <CardContent>
                    <ThemedText>
                        <Typography>
                            <Skeleton></Skeleton>
                        </Typography>
                    </ThemedText>
                </CardContent>
            </Card>
        )
    }
    else {     
        return (
            <Card elevation={3}>
                <CardHeader title={notif.title }
                    action={<React.Fragment>
                                <Typography>
                                {FormUtils.FormatDate(notif.creationDate)}
                                </Typography>
                        </React.Fragment>} />
                <CardContent>
                    <ThemedText>
                        <Typography>
                            {notif.content}
                        </Typography>
                    </ThemedText>
                </CardContent>
            </Card>
        )
    }
}; 