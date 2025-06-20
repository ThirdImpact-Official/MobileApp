import { HttpClient } from './httpClient';
import { ServiceResponse, PaginationResponse } from '@/interfaces/ServiceResponse';

// You may need to create specific DTOs for statistics based on your API response structure


export interface StatisticDataDto {
    periode: string;
    data: number;
}

export class StatisticAction {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
        this.httpClient.setBaseUrl('http://localhost:7159/escape-game/statistic');
    }

    /**
     * Get statistics for a specific escape game
     * @param escapeGameId - The escape game ID
     * @returns Promise with escape game statistics
     */
    public async getEscapeGameStatistics(escapeGameId: number): Promise<ServiceResponse<StatisticDataDto[]> | PaginationResponse<StatisticDataDto[]>> {
        return await this.httpClient
            .GetRequestType(`/escapegame/${escapeGameId}`)
            .execute<StatisticDataDto[]>();
    }

    /**
     * Get statistics for a specific organisation
     * @param id - The organisation ID
     * @returns Promise with organisation statistics
     */
    public async getOrganisationStatistics(id: number): Promise<ServiceResponse<StatisticDataDto[]> | PaginationResponse<StatisticDataDto[]>> {
        return await this.httpClient
            .GetRequestType(`/organisation/${id}`)
            .execute<StatisticDataDto[]>();
    }

    /**
     * Get statistics for the current user
     * @returns Promise with user statistics
     */
    public async getUserStatistics(): Promise<ServiceResponse<StatisticDataDto[]> | PaginationResponse<StatisticDataDto[]>> {
        return await this.httpClient
            .GetRequestType('/user')
            .execute<StatisticDataDto[]>();
    }
}