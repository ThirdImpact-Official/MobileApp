import { AddNotificationDto } from '@/interfaces/NotificationInterface/Notification/addNotificationDto';
import { GetNotificationDto } from '@/interfaces/NotificationInterface/Notification/getNotificationDto';
import { UpdateNotificationDto } from '@/interfaces/NotificationInterface/Notification/updateNotificationDto';
import { HttpClient } from './httpClient'; // Assurez-vous que le chemin est correct
import { ServiceResponse, PaginationResponse } from '@/interfaces/ServiceResponse'; // Assurez-vous que le chemin est correct


export class NotificationAction {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl('http://localhost:7159/notification/notification'); // Remplacez par l'URL de votre API
    }

    // Méthodes pour les Notifications
    public async getAllNotifications(page: number, pageSize: number): Promise<ServiceResponse<GetNotificationDto> | PaginationResponse<GetNotificationDto>> {
        const param: string =`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType(param)
            .executePagination<GetNotificationDto>();
    }

    public async getNotificationById(id: number): Promise<ServiceResponse<GetNotificationDto> | PaginationResponse<GetNotificationDto>> {
        return await this.httpClient
            .GetRequestType(`/${id}`)
            .execute<GetNotificationDto>();
    }

    public async addNotification(notification: AddNotificationDto): Promise<ServiceResponse<GetNotificationDto> | PaginationResponse<GetNotificationDto>> {
        return await this.httpClient
            .PostRequestType('')
            .setData(notification)
            .execute<GetNotificationDto>();
    }

    public async updateNotification(notification: UpdateNotificationDto): Promise<ServiceResponse<GetNotificationDto> | PaginationResponse<GetNotificationDto>> {
        return await this.httpClient
            .PutRequestType('')
            .setData(notification)
            .execute<GetNotificationDto>();
    }

    public async setNotificationVisibility(id: number): Promise<ServiceResponse<GetNotificationDto> | PaginationResponse<GetNotificationDto>> {
        return await this.httpClient
            .PutRequestType(`/visibility/${id}`)
            .execute<GetNotificationDto>();
    }
}