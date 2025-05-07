export interface UpdateNotificationDto extends UpdateDto {
    id: number;
    title: string;
    content: string;
    isRead: boolean;
    notificationTypeId: number;
    notificationType: NotificationType;
    userId: number;
}