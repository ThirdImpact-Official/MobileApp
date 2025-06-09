import { HttpClient } from './httpClient';

import { ServiceResponse } from '@/interfaces/ServiceResponse';
import { GetSignalementTypeDto } from '@/interfaces/EscapeGameInterface/Moderation/getSignalementTypeDto';
import { GetSignalementDto } from '@/interfaces/Moderation/getSignalementDto';
import { AddSignalementDto } from '@/interfaces/Moderation/addSignalementDto';
export class ModerationAction{
    private httpclient : HttpClient
    private apibaseurl : string = "http://localhost:7159"
    constructor() {
        this.httpclient = new HttpClient();
        this.httpclient.setBaseUrl(this.apibaseurl);
    }
    // #region EscapeGame
    
    /**
     * Gets the signalement types for a user.
     * @returns {Promise<ServiceResponse<GetSignalementTypeDto>>} A promise that resolves to a ServiceResponse containing
     *          a list of the signalement types for the user. If the request fails, the data property will be null and the
     *          success property will be false.
     */
    public async GetSignalementTypeUser(): Promise<ServiceResponse<GetSignalementTypeDto>> {
        const res = await this.httpclient.GetRequestType("/escape-game/moderation/typer").execute<GetSignalementTypeDto>();
        return res;
    }
/**
 * Adds a signalement for a user.
 * @param {AddSignalementDto} dto - The signalement data to be added.
 * @returns {Promise<ServiceResponse<GetSignalementDto>>} A promise that resolves to a ServiceResponse containing
 *          the details of the added signalement. If the request fails, the data property will be null and the
 *          success property will be false.
 */

    public async AddSignalementUser(dto: AddSignalementDto): Promise<ServiceResponse<GetSignalementDto>> {
        const res = await this.httpclient.PostRequestType("/escape-game/moderation").setData(dto).execute<GetSignalementDto>();
        return res;
    }

    // #endregion   
    // #region forum 
    public async GetSignalementTypeForum(): Promise<ServiceResponse<GetSignalementTypeDto>> {
        const res = await this.httpclient.GetRequestType("/escape-game/moderation/type").execute<GetSignalementTypeDto>();
        return res;
    }
    public async CreateSignalementForum(dto: AddSignalementDto): Promise<ServiceResponse<GetSignalementDto>> {
        const res = await this.httpclient.PostRequestType("/publication/moderation").setData(dto).execute<GetSignalementDto>();
        return res;
    }
    // #endregion
}