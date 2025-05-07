import { AddDayOfTheWeekDto } from '@/interfaces/EscapeGameInterface/DayoftheWeek/addDayOfTheWeekDto';
import { GetDayOftheWeekDto } from '@/interfaces/EscapeGameInterface/DayoftheWeek/getDayOftheWeekDto';
import { UpdateDayOfTheWeekDto } from '@/interfaces/EscapeGameInterface/DayoftheWeek/updateDayOfTheWeekDto';
import { HttpClient } from './httpClient'; // Assurez-vous que le chemin est correct
import { PaginationResponse, ServiceResponse } from '@/interfaces/ServiceResponse'; // Assurez-vous que le chemin est correct
import { AddEscapeGameSeanceDto } from '@/interfaces/EscapeGameInterface/Seance/addEscapeGameSeanceDto';
import { GetEscapeGameSeanceDto } from '@/interfaces/EscapeGameInterface/Seance/getEscapeGameSeanceDto';
import { UpdateEscapeGameSeanceDto } from '@/interfaces/EscapeGameInterface/Seance/updateEscapeGameSeanceDto';


export class SeanceService {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl('http://localhost:7159/escape-game/seance'); // Remplacez par l'URL de votre API
    }

    // Méthodes pour les Séances
    /**
     * 
     * @param id 
     * @returns 
     */
    public async getSeanceById(id: number): Promise<ServiceResponse<GetEscapeGameSeanceDto> | PaginationResponse<GetEscapeGameSeanceDto>> {
        return await this.httpClient
            .GetRequestType(`/${id}`)
            .execute<GetEscapeGameSeanceDto>();
    }
    /**
     * 
     * @param escapeGameId 
     * @returns 
     */
    public async getSeanceByEscapeGameId(escapeGameId: number): Promise<ServiceResponse<GetEscapeGameSeanceDto[]> | PaginationResponse<GetEscapeGameSeanceDto[]>> {
        return await this.httpClient
            .GetRequestType(`/escapeGame/${escapeGameId}`)
            .executePagination<GetEscapeGameSeanceDto[]>();
    }
    /**
     * 
     * @param seance 
     * @returns 
     */
    public async createSeance(seance: AddEscapeGameSeanceDto): Promise<ServiceResponse<GetEscapeGameSeanceDto> | PaginationResponse<GetEscapeGameSeanceDto>> {
        return await this.httpClient
            .PostRequestType('')
            .setData(seance)
            .execute<GetEscapeGameSeanceDto>();
    }
    /**
     * 
     * @param seance    
     * @returns
     *  
     */
    public async updateSeance(seance: UpdateEscapeGameSeanceDto): Promise<ServiceResponse<GetEscapeGameSeanceDto> | PaginationResponse<GetEscapeGameSeanceDto>> {
        return await this.httpClient
            .PutRequestType('')
            .setData(seance)
            .execute<GetEscapeGameSeanceDto>();
    }
    /** 
     * 
     * 
     * @param id
     * @returns
     */
    public async deleteSeance(id: number): Promise<ServiceResponse<GetEscapeGameSeanceDto> | PaginationResponse<GetEscapeGameSeanceDto>> {
        return await this.httpClient
            .DeleteRequestType(`/${id}`)
            .execute<GetEscapeGameSeanceDto>();
    }

    // Méthodes pour les Jours de la Semaine
    /**
     * 
     * @returns 
     */
    public async getDayOfTheWeek(): Promise<ServiceResponse<GetDayOftheWeekDto[]> | PaginationResponse<GetDayOftheWeekDto[]>> {
        return await this.httpClient
            .GetRequestType('/dayoftheweek')
            .execute<GetDayOftheWeekDto[]>();
    }
    /**
     * 
     * @param day 
     * @returns 
     */
    public async createDayOfTheWeek(day: AddDayOfTheWeekDto): Promise<ServiceResponse<GetDayOftheWeekDto> | PaginationResponse<GetDayOftheWeekDto>> {
        return await this.httpClient
            .PostRequestType('/dayoftheweek')
            .setData(day)
            .execute<GetDayOftheWeekDto>();
    }
    /**
     * 
     * @param day 
     * @returns
     */
    public async updateDayOfTheWeek(day: UpdateDayOfTheWeekDto): Promise<ServiceResponse<GetDayOftheWeekDto> | PaginationResponse<GetDayOftheWeekDto>> {
        return await this.httpClient
            .PutRequestType('/dayoftheweek')
            .setData(day)
            .execute<GetDayOftheWeekDto>();
    }
}