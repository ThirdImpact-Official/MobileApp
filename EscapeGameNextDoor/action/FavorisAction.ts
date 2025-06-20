import { HttpClient } from "./httpClient";
import { GetEscapeGameDto } from "@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto";
import { ServiceResponse, PaginationResponse } from "@/interfaces/ServiceResponse";
import { AddFavorisDto } from "@/interfaces/EscapeGameInterface/Favoris/addFavoris";
import { RemoveFavorisDto } from "@/interfaces/EscapeGameInterface/Favoris/removeFavoris";

export class FavorisAction {
    private httpClient: HttpClient
    private apibaseurl: string = "http://localhost:7159/escape-game/favoris"
    constructor()
    {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl(this.apibaseurl);
    }
     /**
     * Récupère la liste paginée des escape games favoris de l'utilisateur
     * @param page - Numéro de la page (commence à 1)
     * @param pageSize - Nombre d'éléments par page
     * @returns Promise<PaginationResponse<GetEscapeGameDto>>
     */
    public async getFavoris(page: number = 1, pageSize: number = 10): Promise<PaginationResponse<GetEscapeGameDto>> {
        const url = `$page=${page}&pageSize=${pageSize}`;
        
        return await this.httpClient
            .GetRequestType(url)
            .executePagination<GetEscapeGameDto>();
    }
    /**
     * 
     * @param escapeGameId 
     * @returns 
     */
    public async Isfavoris(escapeGameId: number): Promise<ServiceResponse<boolean>> {
      
        return await this.httpClient
            .GetRequestType("/check/escapegame/"+escapeGameId)
            .execute<boolean>();
    }
    /**
     * Ajoute un escape game aux favoris de l'utilisateur
     * @param escapeGameId - ID de l'escape game à ajouter
     * @returns Promise<ServiceResponse<boolean>>
     */
    public async addFavoris(escapeGameId: number): Promise<ServiceResponse<boolean>> {
        const addFavorisDto: AddFavorisDto = {
            escapeGameId: escapeGameId,
            userId: 0

        };

        return await this.httpClient
            .PostRequestType("")
            .setData(addFavorisDto)
            .execute<boolean>();
    }

    /**
     * Supprime un escape game des favoris de l'utilisateur
     * @param escapeGameId - ID de l'escape game à supprimer
     * @returns Promise<ServiceResponse<boolean>>
     */
    public async removeFavoris(escapeGameId: number): Promise<ServiceResponse<boolean>> {
        const removeFavorisDto: RemoveFavorisDto = {
            escapeGameId: escapeGameId,
            userId: 0
        };

        return await this.httpClient
            .DeleteRequestType("")
            .setData(removeFavorisDto)
            .execute<boolean>();
    }
}