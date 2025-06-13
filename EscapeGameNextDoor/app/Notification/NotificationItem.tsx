import React from 'react';
import { GetNotificationDto } from "@/interfaces/NotificationInterface/Notification/getNotificationDto";
import { FC, useState } from 'react';
import { Card, Text, Button, Divider, Layout } from '@ui-kitten/components';
import { UnitofAction } from "@/action/UnitofAction";
import FormUtils from '@/classes/FormUtils';

interface NotificationItemProps {
    data: GetNotificationDto;
    onDetails: (item: GetNotificationDto) => void;
}

export const UserNotificationItem: FC<NotificationItemProps> = (props) => {
    const action = new UnitofAction();
    const [isRead, setIsRead] = useState<boolean>(props.data.isRead);

    const handleOnDetails = (item: GetNotificationDto) => {
        console.log("notif log", item);
        props.onDetails(item);
    };
    // const handleVisibility = async () => {
    //     setIsRead(!isRead);
    //     await action.notificationAction.setNotificationVisibility(props.data.id);
    // };

    return (
        <Card>
            <Layout>
                <Text category='h6'>
                    {props.data.title}
                </Text>
                
                <Layout>
                    <Text>
                        {FormUtils.FormatDate(props.data.creationDate)}
                        <Text>{" : " + (isRead ? "Read" : "unread")}</Text>
                    </Text>
                </Layout>

                <Layout>
                    <Button onPress={() => handleOnDetails(props.data)}>
                        Details
                    </Button>
                </Layout>
            </Layout>
            <Divider />
        </Card>
    );
}

interface UserNotificationComponentProps {
    dataTable: GetNotificationDto[];
    onDetails: (item: GetNotificationDto) => void;
}

const UserNotificationComponent: FC<UserNotificationComponentProps> = (props) => {
    const handleOndetails = (item: GetNotificationDto) => {
        console.log("Component list : ", item);
        props.onDetails(item);
    };

    if (props.dataTable.length === 0) {
        return (
            <Layout style={{ height: 300, width: 500 }}>
                {/* Implémenter un loader ici */}
            </Layout>
        );
    }

    return (
        <Layout style={{ gap: 16 }}>
            {props.dataTable.map((notification) => (
                <UserNotificationItem
                    key={notification.id}
                    onDetails={handleOndetails}
                    data={notification}
                />
            ))}
        </Layout>
    );
};

export default UserNotificationComponent;
