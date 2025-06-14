import { HttpClient } from "./httpClient";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { ServiceResponse,PaginationResponse } from "@/interfaces/ServiceResponse";
import { GetRatingDto} from "@/interfaces/EscapeGameInterface/Rating/getRatingDto";

export class AccueilAction
{
    private HttpClient: HttpClient;
    private apibaseurl: string = "http://localhost:7159/escape-game/accueil/";
    constructor()
    {
        
        this.HttpClient = new HttpClient();
        this.HttpClient.setBaseUrl(this.apibaseurl);
    }

    public async GetlastEscapegame(page:number,pageSize:number): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>>
    {
         const params=`?page=${page}&pageSize=${pageSize}`;
        return await this.HttpClient
            .GetRequestType("escapegame/latest"+params)
            .executePagination<GetEscapeGameDto>();
    }

    public async GetTopEscapegame(page:number,pageSize:number): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>>
    {
        const params=`?page=${page}&pageSize=${pageSize}`;
        return await this.HttpClient
            .GetRequestType("escapegame/latest/noted"+params)
            .executePagination<GetEscapeGameDto>();
    }

    public async GetRankedEscapegame(page:number,pageSize:number): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>>
    {
         const params=`?page=${page}&pageSize=${pageSize}`;
        return await this.HttpClient
            .GetRequestType("escapegame/ranked"+params)
            .executePagination<GetEscapeGameDto>();
    }
    /**
     * Get a random escape game
     * @param page the page number
     * @param pageSize the page size
     * @returns a service response containing the random escape game
     */
    public async GetRandomEscapegame(page:number,pageSize:number): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>>
    {
         const params=`?page=${page}&pageSize=${pageSize}`;
        return await this.HttpClient
            .GetRequestType("escapegame/recommanded"+params)
            .executePagination<GetEscapeGameDto>();
    }
    /**
     * Get all escape games ordered by rating
     * @param page the page number
     * @param pageSize the page size
     * @returns a service response containing the escape games ordered by rating
     */
    public async GetAllEscapegame(page:number,pageSize:number): Promise<ServiceResponse<GetRatingDto> | PaginationResponse<GetRatingDto>>
    {
         const params=`?page=${page}&pageSize=${pageSize}`;
        return await this.HttpClient
            .GetRequestType("escapegame/rating"+params)
            .executePagination<GetRatingDto>();
    }
}