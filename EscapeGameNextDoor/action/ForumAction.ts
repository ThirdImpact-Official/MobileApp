import { AddForumDto } from '@/interfaces/PublicationInterface/Forum/addForumDto';
import { GetForumDto } from '@/interfaces/PublicationInterface/Forum/getForumDto';
import { UpdateForumDto } from '@/interfaces/PublicationInterface/Forum/updateForumDto';
import { HttpClient } from './httpClient'; // Assurez-vous que le chemin est correct
import { ServiceResponse, PaginationResponse } from '@/interfaces/ServiceResponse'; // Assurez-vous que le chemin est correct
import { AddHasLikeDto } from '@/interfaces/PublicationInterface/Haslike/addHasLikeDto';
import { GetlikeDto } from '@/interfaces/PublicationInterface/Haslike/getlikes';
import { GetTypeLikeDto } from '@/interfaces/PublicationInterface/TypeLike/gettypeLikeDto';
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
    public async getOrganisationById(id:number,page: number, pageSize: number) : Promise<PaginationResponse<GetForumDto>>
    {
          const param: string =`?page=${page}&pageSize=${pageSize}&organisationId=${id}`;
        return await this.httpClient
            .GetRequestType(param)
            .executePagination<GetForumDto>();
    }
      /**
     * Get Forum by name 
     * @param page 
     * @param pageSize 
     * @returns 
     */
    public async getForumByName(name:string, page: number, pageSize: number) : Promise<PaginationResponse<GetForumDto>>
    {
          const param: string =`?page=${page}&pageSize=${pageSize}&=name${name}`;
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
    public async AddlikeToForum(item:AddHasLikeDto): Promise<ServiceResponse<GetForumDto> | PaginationResponse<GetForumDto>> {
        return await this.httpClient
            .PostRequestType(`/haslike`)
            .setData(item)
            .execute<GetForumDto>();
    }
     public async GetTypeLIke(): Promise<ServiceResponse<GetTypeLikeDto> | PaginationResponse<GetTypeLikeDto> >{
        return await this.httpClient
            .GetRequestType(`/haslike`)
            .execute<GetTypeLikeDto>();
    }
     public async RemovelikeToForum(item:AddHasLikeDto): Promise<ServiceResponse<GetForumDto> | PaginationResponse<GetForumDto>> {
        return await this.httpClient
            .DeleteRequestType(`/haslike`)
            .setData(item)
            .execute<GetForumDto>();
    }
     public async GetlikeToForum(id:number): Promise<ServiceResponse<GetlikeDto> | PaginationResponse<GetlikeDto>> {
        return await this.httpClient
            .GetRequestType(`/haslike/${id}`)
            .execute<GetlikeDto>();
    }
    public async Verifylike(id: number): Promise<ServiceResponse<boolean> | PaginationResponse<boolean>> {
            return await this.httpClient
                .GetRequestType(`/haslike/verify/${id}`)
                .execute<boolean>();
        }
}