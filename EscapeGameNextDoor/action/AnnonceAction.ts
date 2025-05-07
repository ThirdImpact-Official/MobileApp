import { AddAnnonceDto } from '@/interfaces/NotificationInterface/Annonce/addAnnonceDto';
import { GetAnnonceDto } from '@/interfaces/NotificationInterface/Annonce/getAnnonceDto';
import { UpdateAnnonceDto } from '@/interfaces/NotificationInterface/Annonce/updateAnnonceDto';
import { HttpClient } from './httpClient'; // Assurez-vous que le chemin est correct
import { ServiceResponse, PaginationResponse } from '@/interfaces/ServiceResponse'; // Assurez-vous que le chemin est correct


export class AnnonceService {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl('http://localhost:7159/notification/annonce'); // Remplacez par l'URL de votre API
    }

    // Méthodes pour les Annonces
    public async getAllAnnonces(page: number, pageSize: number): Promise<ServiceResponse<GetAnnonceDto> | PaginationResponse<GetAnnonceDto>> {
        const param: string =`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType(param)
            .executePagination<GetAnnonceDto>();
    }

    public async getAnnonceById(id: number): Promise<ServiceResponse<GetAnnonceDto> | PaginationResponse<GetAnnonceDto>> {
        return await this.httpClient
            .GetRequestType(`/${id}`)
            .execute<GetAnnonceDto>();
    }

    public async addAnnonce(annonce: AddAnnonceDto): Promise<ServiceResponse<GetAnnonceDto> | PaginationResponse<GetAnnonceDto>> {
        return await this.httpClient
            .PostRequestType("")
            .setData(annonce)
            .execute<GetAnnonceDto>();
    }

    public async updateAnnonce(annonce: UpdateAnnonceDto): Promise<ServiceResponse<GetAnnonceDto> | PaginationResponse<GetAnnonceDto>> {
        return await this.httpClient
            .PutRequestType("")
            .setData(annonce)
            .execute<GetAnnonceDto>();
    }

    public async deleteAnnonce(id: number): Promise<ServiceResponse<GetAnnonceDto> | PaginationResponse<GetAnnonceDto>> {
        return await this.httpClient
            .DeleteRequestType(`/${id}`)
            .execute<GetAnnonceDto>();
    }
}