import { Text, View,Image } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { styles } from "../../constants/styles";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Grid } from "@mui/material";
import { useMemo, useState,useRef, useEffect } from "react";
import GenericTabs, { TabItem } from '../../components/factory/GenericComponent/TabGénéric';
import UserNotificationComponent from "../Notification/NotificationItem";
import { GetNotificationDto } from "@/interfaces/NotificationInterface/Notification/getNotificationDto";
import NotificationDetail from "../Notification/NotificationDetail";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { UnitofAction } from "@/action/UnitofAction";
import { useToasted } from "@/context/ContextHook/ToastedContext";
export const FakeNotifications: GetNotificationDto[] = [
    {
      id: 1,
      title: 'Bienvenue sur notre plateforme !',
      content: 'Merci de vous être inscrit. Profitez de toutes nos fonctionnalités.',
      isRead: false,
      notificationTypeId: 1,
      notificationType: {} as GetNotificationDto,
      userId: 101,
      creationDate: '2025-04-10T10:00:00.000Z',
      updatedDate: '2025-04-10T10:00:00.000Z',
    },
    {
      id: 2,
      title: 'Mise à jour disponible',
      content: 'Une nouvelle version de l’application est disponible. Découvrez les nouveautés !',
      isRead: true,
      notificationTypeId: 2,
      notificationType: {} as GetNotificationDto,
      userId: 102,
      creationDate: '2025-04-11T12:30:00.000Z',
      updatedDate: '2025-04-11T12:30:00.000Z',
    },
    {
      id: 3,
      title: 'Rappel de sécurité',
      content: 'Pensez à mettre à jour votre mot de passe régulièrement pour sécuriser votre compte.',
      isRead: false,
      notificationTypeId: 3,
      notificationType: {} as GetNotificationDto,
      userId: 103,
      creationDate: '2025-04-12T09:15:00.000Z',
      updatedDate: '2025-04-12T09:15:00.000Z',
    },
  ];

export default function Notification() {

    const tabsRef = useRef<{ changeTab: (index: number) => void } | null>(null);
    const [NotificationTab,setNotificationTab] = useState<GetNotificationDto[]>(FakeNotifications);
    const [selectNotification,setSelectNotification] = useState<GetNotificationDto| undefined>(undefined);
    const [page,setPage] = useState<number>(1);
    const [pageSize,setPageSize] = useState<number>(5);
    const httpAction= new UnitofAction();
    const Toasted=useToasted();
    const goToTab = (index: number) => {
        if (tabsRef.current) {
          tabsRef.current.changeTab(index);
        }
      };
    const handleOndetails = (item:GetNotificationDto) => {
        console.log("notification page : ", item);
        setSelectNotification(item);
        console.log("item setted",selectNotification);
        goToTab(1);
    }
    const Tab:TabItem[] = [
        
            {
                label : (<>
                <ThemedText className="space-x-2">
                    <NotificationsIcon/>
                    <Text>
                        Notification
                    </Text>
                </ThemedText>
                </>),
                content : <>
                   <UserNotificationComponent 
                    onDetails={handleOndetails}
                    dataTable={NotificationTab } />
                </>   
            },
            {
                label : (
                <ThemedText>
                    Notification Details,
                </ThemedText>
                ),
                content : <><NotificationDetail data={selectNotification} /></>
            }
        
    ];

    const fetchNotifications = async () => {
        const response = await httpAction.notificationAction.getAllNotifications(page, 5);

        if (response.Success) {
            setNotificationTab(response.Data as GetNotificationDto[]);
            Toasted.showToast('Notifications fetched successfully', 'success');
        } else {
            Toasted.showToast(`Failed to fetch notifications: ${response.Message}`,"error");
            console.error('Error fetching notifications:', response.Message);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [page]);
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.headerImage} />}>
            <ThemedView>
                <ThemedText>
                    <Text className="text-3xl text-center text-outline">Notification</Text>
                </ThemedText>
            </ThemedView>
            <Grid>
                <ThemedView>
                    <ThemedText>
                        <Text className="text-xl text-center text-outline">Notification</Text>
                    </ThemedText>
                </ThemedView>
                <Grid>
                    <GenericTabs tabs={Tab}
                        ref={tabsRef} 
                        defaultTab={0} 
                        ariaLabel="generic tabs" 
                        ChangeTab={goToTab} />
                </Grid>
            </Grid>
        </ParallaxScrollView>
    );
}