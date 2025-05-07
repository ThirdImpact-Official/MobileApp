import { AddSessionReservedDto } from '@/interfaces/EscapeGameInterface/Reservation/addSessionReservedDto';
import { GetSessionReservedDto } from '@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto';
import { AddSessionGameDto } from '@/interfaces/EscapeGameInterface/Session/addSessionGameDto';
import { UpdateSessionReservedDto } from '@/interfaces/EscapeGameInterface/Reservation/updateSessionReservedDto';
import { GetSessionGameDto } from '@/interfaces/EscapeGameInterface/Session/getSessionGameDto';
import { UpdateSessionGameDto } from '@/interfaces/EscapeGameInterface/Session/updateSessionGameDto';
import { HttpClient } from './httpClient'; // Assurez-vous que le chemin est correct
import { ServiceResponse, PaginationResponse } from '@/interfaces/ServiceResponse'; // Assurez-vous que le chemin est correct



// Assurez-vous que les DTOs sont correctement définis

export class SessionAction {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl('http://localhost:7159/escape-game/session'); // Remplacez par l'URL de votre API
    }
    /**
     * get session by id
     * @param id 
     * @returns 
     */
    public async getSessionById(id: number): Promise<ServiceResponse<GetSessionGameDto> | PaginationResponse<GetSessionGameDto>> {
        return await this.httpClient
            .GetRequestType(`/${id}`)
            .execute<GetSessionGameDto>();
    }
    /**
     * get session linked to an escapegame
     * @param id s
     * @param page 
     * @param pageSize 
     * @returns 
     */
    public async getSessionEscapeGameById(id: number, page: number, pageSize: number): Promise<ServiceResponse<GetSessionGameDto> | PaginationResponse<GetSessionGameDto>> {
        return await this.httpClient
            .GetRequestType(`/escapegame/${id}?page=${page}&pageSize=${pageSize}`)
            .executePagination<GetSessionGameDto>();
    }
    /**
     * permte de creer une session
     * @param session 
     * @returns 
     */
    public async createSessionGame(session: AddSessionGameDto): Promise<ServiceResponse<GetSessionGameDto> | PaginationResponse<GetSessionGameDto>> {
        return await this.httpClient
            .PostRequestType('')
            .setData(session)
            .execute<GetSessionGameDto>();
    }
    /**
     * met a jour une sessin de jeu 
     * @param session 
     * @returns 
     */
    public async updateSessionGame(session: UpdateSessionGameDto): Promise<ServiceResponse<GetSessionGameDto> | PaginationResponse<GetSessionGameDto>> {
        return await this.httpClient
            .PutRequestType('')
            .setData(session)
            .execute<GetSessionGameDto>();
    }
    /**
     * supprime une session de la base de donnée
     * @param id 
     * @returns 
     */
    public async deleteSessionGame(id: number): Promise<ServiceResponse<GetSessionGameDto> | PaginationResponse<GetSessionGameDto>> {
        return await this.httpClient
            .DeleteRequestType(`/${id}`)
            .execute<GetSessionGameDto>();
    }
    /**
     * récupère les erservation d'un utilisateur par pagination
     * @param userId 
     * @param page 
     * @param pageSize 
     * @returns 
     */
    public async getSessionReservedByUser(userId: string, page: number, pageSize: number): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
        const param: string = `?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType(`/reserved/user${param}`)
            .executePagination<GetSessionReservedDto>();
    }
    /**
     * recupère les rerservation d'un escapegame par pagination
     * @param escapeGameId 
     * @param page 
     * @param pageSize 
     * @returns 
     */
    public async getSessionReservedByEscapeGameId(escapeGameId: number, page: number, pageSize: number): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
        const param: string = `?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient
            .GetRequestType(`/sessionreserved/escapegame/${escapeGameId}${param}`)
            .executePagination<GetSessionReservedDto>();
         
    }
    /**
     * recupère les rerservation d'une session
     * @param id 
     * @returns 
     */
    public async getSessionReservedBySessionId(id: number): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
        return await this.httpClient
            .GetRequestType(`/reserved/session/${id}`)
            .execute<GetSessionReservedDto>();
    }
    /**
     * ajoute une reservation a une session
     * @param reservation 
     * @returns 
     */
    public async addSessionReserved(reservation: AddSessionReservedDto): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
        return await this.httpClient
            .PostRequestType('/reserved')
            .setData(reservation)
            .execute<GetSessionReservedDto>();
    }
    /**
     * mets a jour une reservation
     * @param reservation 
     * @returns
     */
    public async updateSessionReserved(reservation: UpdateSessionReservedDto) {
        return await this.httpClient
            .PutRequestType('/reserved')
            .setData(reservation)
            .execute<GetSessionReservedDto>();
    }
    /**
     * Annule une reservation
     * @param sessionId 
     * @returns 
     */
    public async cancelSessionReserved(sessionId: number): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
        return await this.httpClient
            .PutRequestType(`/reserved/cancel/${sessionId}`)
            .execute<GetSessionReservedDto>();
    }
    /**
     * reset une session
     * @param sessionId 
     * @returns 
     */
    public async ResetSessionReserved(sessionId: number): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
        return await this.httpClient
            .DeleteRequestType(`/reserved/reset/${sessionId}`)
            .execute<GetSessionReservedDto>();
    }
}
