export interface AddNotificationDto  {
    title: string;
    content: string;
    isRead: boolean;
    notificationTypeId: number;
    userId: number;
}