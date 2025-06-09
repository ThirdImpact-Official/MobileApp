import { HttpClient } from "./httpClient";
import { GetRatingDto } from "@/interfaces/EscapeGameInterface/Rating/getRatingDto";
import { ServiceResponse, PaginationResponse } from "@/interfaces/ServiceResponse";

export class RatingAction 
{
    private HttpClient: HttpClient;
    private apibaseurl: string = "http://localhost:7159/escape-game/rating";
    constructor()
    {
        this.HttpClient = new HttpClient();
        this.HttpClient.setBaseUrl(this.apibaseurl);
    }

    public async GetAllRating(page:number,pageSize:number): Promise<ServiceResponse<GetRatingDto> | PaginationResponse<GetRatingDto>>
    {
        const params=`?page=${page}&pageSize=${pageSize}`; 
        return await this.HttpClient
        .GetRequestType("escapegame/rating"+params)
        .executePagination<GetRatingDto>();
    }
    public async GetRatingbyId(id:number): Promise<ServiceResponse<GetRatingDto> | PaginationResponse<GetRatingDto>>
    {
        
        return await this.HttpClient
        .GetRequestType(`${id}`)
        .execute<GetRatingDto>();
    }   

    public async GetallratingByUserId(page:number,pagesize:number): Promise<ServiceResponse<GetRatingDto> | PaginationResponse<GetRatingDto>>
    {
        const params=`?page=${page}&pageSize=${pagesize}`;
        return await this.HttpClient
        .GetRequestType(`user`+params)
        .executePagination<GetRatingDto>();
    }
    public async CreateRating(rating: GetRatingDto): Promise<ServiceResponse<GetRatingDto> | PaginationResponse<GetRatingDto>> {
        return this.HttpClient
            .PostRequestType("")
            .setData(rating)
            .execute<GetRatingDto>();
    }
    public async UpdateRating(rating: GetRatingDto): Promise<ServiceResponse<GetRatingDto> | PaginationResponse<GetRatingDto>> {
        return this.HttpClient
            .PutRequestType("")
            .setData(rating)
            .execute<GetRatingDto>();
    }
    public async GetAllRatingbyEscapeGameId(id:number ,page:number,pageSize:number): Promise<ServiceResponse<GetRatingDto> | PaginationResponse<GetRatingDto>>
    {
        const params=`?page=${page}&pageSize=${pageSize}`;
        
        return await this.HttpClient
        .GetRequestType(`escapegame/${id}`+params)
        .executePagination<GetRatingDto>();
    }

}