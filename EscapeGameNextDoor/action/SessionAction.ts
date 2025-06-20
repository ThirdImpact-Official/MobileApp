import { AddSessionReservedDto } from '@/interfaces/EscapeGameInterface/Reservation/addSessionReservedDto';
import { GetSessionReservedDto } from '@/interfaces/EscapeGameInterface/Reservation/getSessionReservedDto';
import { AddSessionGameDto } from '@/interfaces/EscapeGameInterface/Session/addSessionGameDto';
import { UpdateSessionReservedDto } from '@/interfaces/EscapeGameInterface/Reservation/updateSessionReservedDto';
import { GetSessionGameDto } from '@/interfaces/EscapeGameInterface/Session/getSessionGameDto';
import { UpdateSessionGameDto } from '@/interfaces/EscapeGameInterface/Session/updateSessionGameDto';
import { GetSessionTemplateDto,UpdateSessionTemplateDto,AddSessionTemplateDto } from '@/interfaces/EscapeGameInterface/SessionTemplate/Sessiontempalte';
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
    //#region reservation
    /**
     * 
     * @param id 
     * @returns 
     */
    public async getSessionReserved(id: number): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
        return await this.httpClient
            .GetRequestType('/reserved/'+id)
            .executePagination<GetSessionReservedDto>();
    }
    public async Iscancellable(id: number): Promise<ServiceResponse<boolean> | PaginationResponse<boolean>> {
        return await this.httpClient
            .GetRequestType(`/reserved/cancellable/${id}`)
            .execute<boolean>();
    }

    /**
     * récupère les erservation d'un utilisateur par pagination
     * @param userId 
     * @param page 
     * @param pageSize 
     * @returns 
     */
    public async getSessionReservedByUser( page: number, pageSize: number): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
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
     * 
     * @param sessionId 
     * @returns 
     */
    public async cancelAdmin(sessionId: number): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
        return await this.httpClient
            .PutRequestType(`/reserved/cancel/admin/${sessionId}`)
            .execute<GetSessionReservedDto>();
    }
    //#endregion
    /**
     * 
     * @param sessionId 
     * @returns 
     */
    public async Completereservation(sessionId: number): Promise<ServiceResponse<GetSessionReservedDto> | PaginationResponse<GetSessionReservedDto>> {
        return await this.httpClient
            .PutRequestType(`/reserved/completed/${sessionId}`)
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
    // #region
  

    /**
     * Get all session templates
     * @returns Promise with list of session templates
     */
    public async getSessionTemplates(): Promise<ServiceResponse<GetSessionTemplateDto[]> | PaginationResponse<GetSessionTemplateDto[]>> {
        return await this.httpClient
            .GetRequestType('/template')
            .execute<GetSessionTemplateDto[]>();
    }

    /**
     * Get a specific session template by ID
     * @param id - Template ID
     * @returns Promise with session template data
     */
    public async getSessionTemplateById(id: number): Promise<ServiceResponse<GetSessionTemplateDto> | PaginationResponse<GetSessionTemplateDto>> {
        return await this.httpClient
            .GetRequestType(`/template/${id}`)
            .execute<GetSessionTemplateDto>();
    }   
    /**
     * 
     * @param id 
     * @returns 
     */
    public async getSessionTemplateByEscapeGameId(id: number): Promise<ServiceResponse<GetSessionTemplateDto> | PaginationResponse<GetSessionTemplateDto>> {
        return await this.httpClient
            .GetRequestType(`/template/escapegame/${id}`)
            .execute<GetSessionTemplateDto>();
    }
    /**
     * Create a new session template
     * @param template - Template data to create
     * @returns Promise with created template data
     */
    public async addSessionTemplate(template: AddSessionTemplateDto): Promise<ServiceResponse<GetSessionTemplateDto> | PaginationResponse<GetSessionTemplateDto>> {
        return await this.httpClient
            .PostRequestType('/template')
            .setData(template)
            .execute<GetSessionTemplateDto>();
    }

    /**
     * Update an existing session template
     * @param template - Template data to update
     * @returns Promise with updated template data
     */
    public async updateSessionTemplate(template: UpdateSessionTemplateDto): Promise<ServiceResponse<GetSessionTemplateDto> | PaginationResponse<GetSessionTemplateDto>> {
        return await this.httpClient
            .PutRequestType('/template')
            .setData(template)
            .execute<GetSessionTemplateDto>();
    }

    /**
     * Delete/deactivate a session template
     * @param id - Template ID to delete
     * @returns Promise with deletion result
     */
    public async deleteSessionTemplate(id: number): Promise<ServiceResponse<GetSessionTemplateDto> | PaginationResponse<GetSessionTemplateDto>> {
        return await this.httpClient
            .DeleteRequestType(`/template/${id}`)
            .execute<GetSessionTemplateDto>();
    }

    /**
     * Reactivate a session template
     * @param id - Template ID to reactivate
     * @returns Promise with reactivated template data
     */
    public async reactivateSessionTemplate(id: number): Promise<ServiceResponse<GetSessionTemplateDto> | PaginationResponse<GetSessionTemplateDto>> {
        return await this.httpClient
            .PutRequestType(`/template/reactivate/${id}`)
            .execute<GetSessionTemplateDto>();
    }
    // #endregion
}
