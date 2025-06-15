
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import { HttpClient } from "./httpClient";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { ErrorType } from "@/enums/RequestType";
import { LoginCredentials } from "@/interfaces/login/loginCredentials";
import { RegisterDto } from "@/interfaces/Credentials/RegisterDto";
import { AuthResponse } from "@/interfaces/User/Authresponse";
import { UpdateLoginDto } from "@/interfaces/Credentials/updateLogindto";
import { UpdatePasswordDto } from '../interfaces/User/UpdatePassword';



export class CreadentialAction
{
    private _httpClient: HttpClient
    private apibaseurl: string
    constructor(apibaseurl: string = "http://localhost:7159/escape-game/") { 
        this.apibaseurl = apibaseurl;
        this._httpClient = new HttpClient();
        this._httpClient.setBaseUrl(this.apibaseurl);
    }

    public async Login(credentials: LoginCredentials): Promise<ServiceResponse<AuthResponse> |PaginationResponse<AuthResponse>> {
    
            return await this._httpClient
                                       .PostRequestType("account/login/mobile")
                                        .setData(credentials)
                                        .execute<AuthResponse>();
       
    }

    /**
     * Logs out from the server and updates the authentication state.
     *
     * Throws an error if the logout request fails.
     *
     * @param {any} credentials - The credentials to be passed to the server.
     * @returns {Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>>} A promise that resolves with a ServiceResponse object.
     *          If the request is successful, the data property of the ServiceResponse object will contain the
     *          newly logged out user. If the request fails, the data property will be null and the success property will
     *          be false.
     * @throws {Error} If the request to log out fails.
     */
    public async Logout(): Promise<ServiceResponse<AuthResponse> | PaginationResponse<AuthResponse>> {
         
        
            return await this._httpClient
                                       .PostRequestType("account/logout")
                                       .execute<AuthResponse>();
       
    }
    /**
     * Registers a new user with the given credentials.
     * @param {RequestCredentials} credentials - The details of the user to be registered.
     * @returns {Promise<ServiceResponse<GetUserDto>>} A promise that resolves with a ServiceResponse object.
     *          If the request is successful, the data property of the ServiceResponse object will contain the
     *          newly created user. If the request fails, the data property will be null and the success property will
     *          be false.
     * @throws {Error} If the request to register the user fails.
     */
    public async Register(login : RegisterDto): Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
        
            return await this._httpClient
                                       .PostRequestType("account/register")
                                       .setData(login)
                                       .execute<GetUserDto>();
    }
        /**
         * Verifies the email address of a user with the given token.
         * @param {string} token - The token received in the email to verify the email address.
         * @returns {Promise<ServiceResponse<GetUserDto>>} A promise that resolves with a ServiceResponse object.
         *          If the request is successful, the data property of the ServiceResponse object will contain the
         *          newly created user. If the request fails, the data property will be null and the success property will
         *          be false.
         * @throws {Error} If the request to verify the email fails.
         */
    public async verifyEmail (token: string,email:string): Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
            type verification={
                email:string;
                token:string;
            }
            const verif: verification = 
            {
                email: email,
                token: token
            }
            return await this._httpClient
                .PostRequestType("account/emailverification")
                .setData(verif)
                .execute<GetUserDto>();            
         
     
    }
    /**
     * allow the application to check for the user 
     * @returns 
     */
    public async Checkauth():Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
       return  await this._httpClient
                .GetRequestType("user/checkauth")
                .execute<GetUserDto>();
    }
    /**
     * generate Email token
     * @returns 
     */
    public async GenerateEmailToken(email:string): Promise<ServiceResponse<GetUserDto>> 
    {
        return await this._httpClient.GetRequestType(`account/emailverification?email${email}`).execute<GetUserDto>()
    }
    public async resetPasswordDemande(email: string): Promise<ServiceResponse<GetUserDto>> 
    {
        return await this._httpClient
            .PutRequestType(`account/credential/demand?email=${email}`)
            .execute();
    }
    /**
     * envoie une demande de reset passwor
     * @param update 
     * @returns 
     */
    public async resetpassword(update:UpdateLoginDto) : Promise<ServiceResponse<GetUserDto>>
    {
        return await this._httpClient
            .PutRequestType("account/credential/demand/response")
            .setData(update)
            .execute();
    }
    /**
     * annule le reset de password
     * 
     */
    public async CancelpassWord(email:string) :Promise<ServiceResponse<GetUserDto>>
    {
        return await this._httpClient.PutRequestType(`/escape-game/account/credential/cancel?email=${email}`).execute()
    }
    /**
     * mets a jout le password
     * @param Update 
     * @returns 
     */
    public async UpdatePasswor(Update:UpdatePasswordDto): Promise<ServiceResponse<GetUserDto>>
    {
        return await this._httpClient.PutRequestType(`/escape-game/account/credential`).setData(Update)
              .execute()
    }
}