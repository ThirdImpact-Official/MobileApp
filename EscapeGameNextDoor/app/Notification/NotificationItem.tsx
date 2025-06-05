
import { GetNotificationDto } from "@/interfaces/NotificationInterface/Notification/getNotificationDto";
import { Box, Card, CardContent, Skeleton, Divider, CardActions, Button, CardHeader } from '@mui/material';
import { Dashboard, Home, MoreVert, Settings } from '@mui/icons-material';
import { FC, useEffect, useState ,useMemo } from 'react';
import Typography from '@mui/material/Typography';
import ModalComponent from '@/components/factory/GenericComponent/Modal';
import { UnitofAction } from "@/action/UnitofAction";
import FormUtils from '@/classes/FormUtils';
import GenericMenu, { GenericMenuItemProps } from '@/components/factory/GenericComponent/GenericMenu';
import { NotificationAction } from '../../action/NotificationAction';
import { Text} from "react-native";

interface NotificationItemProps {
    data :GetNotificationDto;
    onDetails:(item:GetNotificationDto)=>void;
}
export const UserNotificationItem:FC<NotificationItemProps> = (props)=>{
    const action=new UnitofAction();
    const [Isread, setIsread] = useState<boolean>(props.data.isRead);

    const handleonDetails = (item:GetNotificationDto) => 
    { 
        console.log("notif log",item);
        props.onDetails(item);
    };

    const HandleVisisbility = async() => {
        setIsread(!Isread);
        await action.notificationAction
            .setNotificationVisibility(props.data.id)
    }
    const menupost: GenericMenuItemProps[] = useMemo(() => [
        {
            label: "Settings",
            icon: <Settings />,
            onClick: () => console.log("Modification"),
            modalTitle: "Modify the post",
            modalContent: (
                <>
                    <img src={""} alt="Illustration" style={{ maxWidth: "100%" }} />
                    <p>Do you want to modify this post?</p>
                </>
            )
        }
    ], []);
    return (
    <>
        <Card className='flex justify-evenly flex-grid rounded-lg md:w-1/2 w-full bg-white hover:shadow-lg transition-all'>
            <CardHeader className="items-start m-1 p-1"
                title={
                    <>
                    <Box>
                        <Typography
                            variant='h6' 
                            className="items-center p-2">
                        {props.data.title}
                        </Typography>
                    </Box>
                    </>
                } />
                
            <CardContent className="text-end p-2 float-end items-end">
                
                <Box>
                    <Typography>
                        {FormUtils.FormatDate(props.data.creationDate)}
                        <></>
                        <Text>{ " : "+Isread ? "Read" : "unread" }</Text>
                        <GenericMenu  
                            items={menupost} menuIcon={<MoreVert />} />
                    </Typography>
                </Box>
 
              <CardActions className='flex justify-end items-end'>
                <Button onClick={()=>handleonDetails(props.data)}>details</Button>
              
              </CardActions>
            </CardContent>
            <Divider />
        </Card>
    </>
    )
}

interface UserNotificationComponentProps{
    dataTable: GetNotificationDto[];
    onDetails:(item:GetNotificationDto)=>void;
}
const UserNotificationComponent: FC<UserNotificationComponentProps> = (props) => {
    
    const handleOndetails = (item:GetNotificationDto) => { 
        console.log("Component list : ", item);
        props.onDetails(item);
    };

    if(props.dataTable.length === 0){
        return(
        <>
            <Skeleton width={500} height={300}> </Skeleton>
        </>)
    }
    else{
        return (
            <>
              <section className='flex flex-col space-y-4'>
                    {props.dataTable.map((notification) => (
                        
                        <UserNotificationItem 
                            key={notification.id} 
                            onDetails={handleOndetails}
                            data={notification} />
                    ))}
              </section>
            </>
        );
    }
};

export default UserNotificationComponent;