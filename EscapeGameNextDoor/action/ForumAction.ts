import { AddForumDto } from '@/interfaces/PublicationInterface/Forum/addForumDto';
import { GetForumDto } from '@/interfaces/PublicationInterface/Forum/getForumDto';
import { UpdateForumDto } from '@/interfaces/PublicationInterface/Forum/updateForumDto';
import { HttpClient } from './httpClient'; // Assurez-vous que le chemin est correct
import { ServiceResponse, PaginationResponse } from '@/interfaces/ServiceResponse'; // Assurez-vous que le chemin est correct
// Assurez-vous que les DTOs sont correctement définis

export class ForumAction {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl('http://localhost:7159/publication/forum'); // Remplacez par l'URL de votre API
    }

    // Méthodes pour les Forums
    /**
     * get all Forum 
     * @param page 
     * @param pageSize 
     * @returns 
     */
    public async getAllForums(page: number, pageSize: number): Promise<ServiceResponse<GetForumDto> | PaginationResponse<GetForumDto>> {
        const param: string =`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType(param)
            .executePagination<GetForumDto>();
    }
    /**
     * Get Forum by organisation
     * @param page 
     * @param pageSize 
     * @returns 
     */
    public async getOrganisationById(page: number, pageSize: number) : Promise<PaginationResponse<GetForumDto>>
    {
          const param: string =`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType("/organisation"+param)
            .executePagination<GetForumDto>();
    }
      /**
     * Get Forum by name 
     * @param page 
     * @param pageSize 
     * @returns 
     */
    public async getOrganisationByName(page: number, pageSize: number) : Promise<PaginationResponse<GetForumDto>>
    {
          const param: string =`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType("/byname"+param)
            .executePagination<GetForumDto>();
    }
    /**
     * GetForumById
     * @param id 
     * @returns 
     */
    public async getForumById(id: number): Promise<ServiceResponse<GetForumDto> | PaginationResponse<GetForumDto>> {
        return await this.httpClient
            .GetRequestType(`/${id}`)
            .execute<GetForumDto>();
    }
    /**
     * Create a forum 
     */
    public async createForum(forum: AddForumDto): Promise<ServiceResponse<GetForumDto> | PaginationResponse<GetForumDto>> {
        return await this.httpClient
            .PostRequestType('')
            .setData(forum)
            .execute<GetForumDto>();
    }
    /**
     * 
     * @param forum 
     * @returns 
     */
    public async updateForum(forum: UpdateForumDto): Promise<ServiceResponse<GetForumDto> | PaginationResponse<GetForumDto>> {
        return await this.httpClient
            .PutRequestType('')
            .setData(forum)
            .execute<GetForumDto>();
    }
    /**
     * Delete 
     * @param id 
     * @returns 
     */
    public async deleteForum(id: number): Promise<ServiceResponse<GetForumDto> | PaginationResponse<GetForumDto>> {
        return await this.httpClient
            .DeleteRequestType(`/${id}`)
            .execute<GetForumDto>();
    }
}