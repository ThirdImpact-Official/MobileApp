import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { HttpClient } from "./httpClient";
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import { AddActivityPlaceDto } from "@/interfaces/EscapeGameInterface/ActivityPlace/addActivityPlaceDto";
import { GetActivityPlaceDto } from "@/interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceDto";
import { GetActivityPlaceTypeDto } from "@/interfaces/EscapeGameInterface/ActivityPlace/getActivityPlaceTypeDto";
import { UpdateActivityPlaceDto } from "@/interfaces/EscapeGameInterface/ActivityPlace/updateActivityPlaceDto";
import { AddEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/addEscapeGameDto";
import { UpdateEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/updateEscapeGameDto";
import { AddEventDto } from "@/interfaces/EscapeGameInterface/Event/addEventDto";
import { GetEventDto } from "@/interfaces/EscapeGameInterface/Event/getEventDto";
import { UpdateEventDto } from "@/interfaces/EscapeGameInterface/Event/updateEventDto";
import { GetDifficultyLevelDto } from '../interfaces/EscapeGameInterface/DifficultyLevel/getDifficultyLevelDto';
import { GetPriceDto } from '../interfaces/EscapeGameInterface/Price/getPriceDto';
import { Update } from 'vite/types/hmrPayload.js';

export class EscapeGameAction {
    private readonly httpClient: HttpClient;
    private readonly apibaseurl: string;

    constructor() {
        this.apibaseurl ="http://localhost:7159/escape-game/";
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl(this.apibaseurl);
    }

    public async getAllEscapeGames(page: number, pageSize: number): Promise<PaginationResponse<GetEscapeGameDto>> {
        const params=`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType("escapegame"+`${params}`)
            .executePagination<GetEscapeGameDto>();
    }
    public async GetAllEscapeGames(catId: number | null, priceId: number | null, diflId: number | null, page: number, pageSize: number): Promise<PaginationResponse<GetEscapeGameDto>> {
        const params = new URLSearchParams();
        
        
        if (catId !== null) {
            params.append('categoryId', catId.toString());
        }
        if (priceId !== null) {
            params.append('priceId', priceId.toString());
        }
        if (diflId !== null) {
            params.append('difficultyLevelId', diflId.toString());
        }
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());
        
        return await this.httpClient
            .GetRequestType(`escapegame/filtered?${params.toString()}`)
            .executePagination<GetEscapeGameDto>();
    }
    public async getAllEscapeGamesFromOrganisation(orgId:number,page:number, pageSize: number ): Promise< PaginationResponse<GetEscapeGameDto>> {
        const params=`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType("escapegame/organisation/"+orgId+`${params}`)
            .executePagination<GetEscapeGameDto>();
    }

    public async getEscapeGameById(id: number): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>> {
        return await this.httpClient
            .GetRequestType(`escapegame/${id}`)
            .execute<GetEscapeGameDto>();
    }

    public async createEscapeGame(escapeGame: AddEscapeGameDto): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>> {
        return await this.httpClient
            .PostRequestType("escapegame")
            .setData(escapeGame)
            .execute<GetEscapeGameDto>();
    }

    public async updateEscapeGame(escapeGame: UpdateEscapeGameDto): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>> {
        return await this.httpClient
            .PutRequestType('escapegame')
            .setData(escapeGame)
            .execute<GetEscapeGameDto>();
    }
    public async UpdateRecommendationEscapeGame(int:number,recommendation:boolean): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>> {
        return await this.httpClient
            .PutRequestType('escapegame/recommendation/'+int)
            .setData(recommendation)
            .execute<GetEscapeGameDto>();
    }

    public async deleteEscapeGame(id: number): Promise<ServiceResponse<GetEscapeGameDto> | PaginationResponse<GetEscapeGameDto>> {
        return await this.httpClient
            .DeleteRequestType(`escapegame/${id}`)
            .execute<GetEscapeGameDto>();
    }

    // Méthodes pour les Activity Places
    public async getAllActivityTypes(): Promise<ServiceResponse<GetActivityPlaceTypeDto[]> | PaginationResponse<GetActivityPlaceTypeDto[]>> {
        return await this.httpClient
            .GetRequestType('escapegame/activityplace/type')
            .executePagination<GetActivityPlaceTypeDto[]>();
    }

    public async getActivityPlaces(page: number, pageSize: number, activityTypeId: number): Promise<ServiceResponse<GetActivityPlaceDto> |PaginationResponse<GetActivityPlaceDto>> {
        const param: string =`?page=${page}&pageSize=${pageSize}&activityTypeId=${activityTypeId}`;
        return await this.httpClient
            .GetRequestType('escapegame/activityplace'+param)
            .execute<GetActivityPlaceDto>();
    }
    public async getActivityPlacesByEscapeGame(id:number,page: number, pageSize: number, activityTypeId: number=0): Promise<ServiceResponse<GetActivityPlaceDto> |PaginationResponse<GetActivityPlaceDto>> {
        const param: string = activityTypeId === 0 ? `?page=${page}&pageSize=${pageSize}` 
                                                      : `?page=${page}&pageSize=${pageSize}&activityTypeId=${activityTypeId}`;
        return await this.httpClient
            .GetRequestType('escapegame/activityplace/escapegame/'+id+param)
            .executePagination<GetActivityPlaceDto>();
    }
    public async getActivityPlaceById(id: number): Promise<ServiceResponse<GetActivityPlaceDto> | PaginationResponse<GetActivityPlaceDto>> {
        return await this.httpClient
            .GetRequestType(`escapegame/activityplace/${id}`)
            .execute<GetActivityPlaceDto>();
    }

    public async createActivityPlace(activityPlace: AddActivityPlaceDto): Promise<ServiceResponse<GetActivityPlaceDto> | PaginationResponse<GetActivityPlaceDto>> {
        return await this.httpClient
            .PostRequestType('escapegame/activityplace')
            .setData(activityPlace)
            .execute<GetActivityPlaceDto>();
    }

    public async updateActivityPlace(activityPlace: UpdateActivityPlaceDto): Promise<ServiceResponse<GetActivityPlaceDto> | PaginationResponse<GetActivityPlaceDto>> {
        return await this.httpClient
            .PutRequestType('escapegame/activityplace')
            .setData(activityPlace)
            .execute<GetActivityPlaceDto>();
    }

    public async deleteActivityPlace(id: number): Promise<ServiceResponse<GetActivityPlaceDto> | PaginationResponse<GetActivityPlaceDto>> {
        return await this.httpClient
            .DeleteRequestType(`escapegame/activityplace/${id}`)
            .execute<GetActivityPlaceDto>();
    }

    // Méthodes pour les Events
    public async getEventsByEscapeGameId(id: number, page: number, pageSize: number): Promise<ServiceResponse<GetEventDto> | PaginationResponse<GetEventDto>> {
        const param: string =`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType(`escapegame/event/escapegame/${id}`+param)
            .executePagination<GetEventDto>();
    }

    public async getEventById(id: number): Promise<ServiceResponse<GetEventDto> | PaginationResponse<GetEventDto>> {
        return await this.httpClient
            .GetRequestType(`escapegame/event/${id}`)
            .execute<GetEventDto>();
    }

    public async createEvent(event: AddEventDto): Promise<ServiceResponse<GetEventDto> | PaginationResponse<GetEventDto>> {
        return await this.httpClient
            .PostRequestType('escapegame/event')
            .setData(event)
            .execute<GetEventDto>();
    }

    public async updateEvent(event: UpdateEventDto): Promise<ServiceResponse<GetEventDto> | PaginationResponse<GetEventDto>> {
        return await this.httpClient
            .PutRequestType('escapegame/event')
            .setData(event)
            .execute<GetEventDto>();
    }

    public async deleteEvent(id: number): Promise<ServiceResponse<GetEventDto> | PaginationResponse<GetEventDto>> {
        return await this.httpClient
            .DeleteRequestType(`escapegame/event/${id}`)
            .execute<GetEventDto>();
    }
    public async GetPriceIndice(): Promise<ServiceResponse<GetPriceDto[]>> {
        return await this.httpClient
            .GetRequestType('escapegame/price')
            .execute<GetPriceDto[]>();
    }
    public async GetDifficultyLevelDto(): Promise<ServiceResponse<GetDifficultyLevelDto[]>> {
        return await this.httpClient
            .GetRequestType('escapegame/difficulty')
            .execute<GetDifficultyLevelDto[]>();
    }
}
