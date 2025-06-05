import { HttpClient } from './httpClient';
import { GetAdminDemandDto } from '../interfaces/AdminDemand/GetAdminDemand';
import { ServiceResponse,PaginationResponse } from '@/interfaces/ServiceResponse';
import { CreateAdminDemandDto } from '@/interfaces/AdminDemand/CreateAdminDemand';
import { ResponseAdminDemandDto } from '@/interfaces/AdminDemand/ResponseAdminDemand';

export class AdminDemandAction{
    private HttpClient: HttpClient ;

    constructor() {
        this.HttpClient = new HttpClient();
        this.HttpClient.setBaseUrl('http://localhost:7159/escape-game/demand');
    }
    /**
     * 
     * @param id 
     * @returns 
     */
    public async GetDemandById(id: number): Promise<ServiceResponse<GetAdminDemandDto> | PaginationResponse<GetAdminDemandDto>> {
        return await this.HttpClient
            .GetRequestType(`${id}`)
            .execute<GetAdminDemandDto>();
    }
    /** 
     * 
        get all the admin demand for the user
        @param page 
        @param pageSize
        @returns  
     */
    public async GetAdminDemandPage(page:number, pageSize: number) : Promise<ServiceResponse<GetAdminDemandDto> | PaginationResponse<GetAdminDemandDto>> {
        return this.HttpClient
            .GetRequestType("?page="+page+"&pageSize="+pageSize)
            .execute<GetAdminDemandDto>();
    }
    /** 
    * Create a new demand Fot the user 
    * @param demand
    */ 
    public async CreateDemand(demand: CreateAdminDemandDto) : Promise<ServiceResponse<GetAdminDemandDto> | PaginationResponse<GetAdminDemandDto>> {
        return this.HttpClient
            .PostRequestType("")
            .setData(demand)
            .execute<GetAdminDemandDto>();
    }
    /**
     * Delete the demand
     * @param demandId
     ****/
    public async DeleteDemand(demandId: number): Promise<ServiceResponse<GetAdminDemandDto> | PaginationResponse<GetAdminDemandDto>> {
        return this.HttpClient
            .DeleteRequestType("/"+demandId)
            .execute<GetAdminDemandDto>();

    }
    /**
     * update the Adminpage
     * @param demand 
     * @returns ServiceResponse<GetAdminDemandDto>
     */
    public async UpdateDemand(demand: any): Promise<ServiceResponse<GetAdminDemandDto> | PaginationResponse<GetAdminDemandDto>> {
        return this.HttpClient
            .PutRequestType("")
            .setData(demand)
            .execute<GetAdminDemandDto>();
    }
    /**
     * 
     * @param demandresponse 
     * @returns 
     */
    public async ValidDemand(demandresponse: ResponseAdminDemandDto): Promise<ServiceResponse<GetAdminDemandDto> | PaginationResponse<GetAdminDemandDto>> {
        return this.HttpClient
            .PutRequestType("/validated")
            .setData(demandresponse)
            .execute<GetAdminDemandDto>();
    }
    /**
     * 
     * @param demandresponse
     * @returns
     */
    public async RefuseDemand(demandresponse: ResponseAdminDemandDto): Promise<ServiceResponse<GetAdminDemandDto> | PaginationResponse<GetAdminDemandDto>> {
        return this.HttpClient
            .PutRequestType("/refused")
            .setData(demandresponse)
            .execute<GetAdminDemandDto>();
    }

}