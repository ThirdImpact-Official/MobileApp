import { AddCategoryDto } from '@/interfaces/EscapeGameInterface/Category/addCategoryDto';
import { GetCategoryDto } from '@/interfaces/EscapeGameInterface/Category/getCategoryDto';
import { UpdateCategory } from '@/interfaces/EscapeGameInterface/Category/updateCategory';
import { HttpClient } from './httpClient'; // Assurez-vous que le chemin est correct
import { PaginationResponse, ServiceResponse } from '@/interfaces/ServiceResponse'; // Assurez-vous que le chemin est correct
import { AddEscapeGameDto } from '../../../Webclient/webclient/src/interfaces/EscapeGameInterface/EscapeGame/addEscapeGameDto';
import { GetEscapeGameDto } from '@/interfaces/EscapeGameInterface/EscapeGame/getEscapeGameDto';
import { GetCompleteGameDto } from '@/interfaces/EscapeGameInterface/CompleteGame/getCompleteGameDto';

 // Assurez-vous que les DTOs sont correctement définis

export class CompletegameAction {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl('http://localhost:7159/escape-game/completegame'); // Remplacez par l'URL de votre API
    }

       /**
     * Check if a user has completed a specific escape game
     * @param id - The escape game ID
     * @returns Promise with the completion status
     */
    async checkEscapeGameCompletion(id: number): Promise<ServiceResponse<boolean>> {
       
            return await this.httpClient.GetRequestType(`/check/escapegame/${id}`).execute<boolean>();
       
    }

    /**
     * Get completed games for the current user
     * @returns Promise with the list of completed games for the user
     */
    public async getUserCompletedGames(page:number,pageSize:number): Promise<PaginationResponse<GetEscapeGameDto>> {
        const params=`?page=${page}&pageSize=${pageSize}`;
        return await this.httpClient.GetRequestType('/user'+params).executePagination<GetEscapeGameDto>();
       
    }
      /**
     * Get completed games for the current user
     * @returns Promise with the list of completed games for the user
     */
    public async getCompletedGameBysessionId(item: number): Promise<ServiceResponse<GetCompleteGameDto>> {
      
        return await this.httpClient.GetRequestType('/reserved/'+item).execute<GetCompleteGameDto>();
       
    }
}
