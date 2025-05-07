import FormUtils from "@/classes/FormUtils";
export interface GetNotificationDto {
    id: number;
    title: string;
    content: string;
    isRead: boolean;
    notificationTypeId: number;
    notificationType: GetNotificationDto;
    userId: number;
    creationDate: string | null;
    updatedDate: string | null;
}
export const NotificationColumns: Array<{ label: string; accessor: keyof GetNotificationDto }> = [
    FormUtils.TableMapper("Id", "id"),
    FormUtils.TableMapper("Name", "title"),
    FormUtils.TableMapper("Content", "content"),
    FormUtils.TableMapper("isRead", "isRead"),
    FormUtils.TableMapper("Date", "creationDate"),
];