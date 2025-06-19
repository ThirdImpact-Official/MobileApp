import { HttpClient } from "./httpClient";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { ServiceResponse,PaginationResponse } from "@/interfaces/ServiceResponse";
import { GetRatingDto} from "@/interfaces/EscapeGameInterface/Rating/getRatingDto";

export class AccueilAction
{
    private HttpClient: HttpClient;
    private apibaseurl: string = "http://localhost:7159/escape-game/completegame/";
    constructor()
    {
        
        this.HttpClient = new HttpClient();
        this.HttpClient.setBaseUrl(this.apibaseurl);
    }

    public async GetCompleteEscapegame(page:number,pageSize:number): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>>
    {
         const params=`?page=${page}&pageSize=${pageSize}`;
        return await this.HttpClient
            .GetRequestType("user"+params)
            .executePagination<GetEscapeGameDto>();
    }

    public async checked(id:number): Promise<ServiceResponse<boolean> | PaginationResponse<boolean>>
    {
      
        return await this.HttpClient
            .GetRequestType("check/escapegame/"+id)
            .execute<boolean>();
    }
}