
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import { HttpClient } from "./httpClient";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { ErrorType } from "@/enums/RequestType";
import { LoginCredentials } from "@/interfaces/login/loginCredentials";
import { RegisterDto } from "@/interfaces/Credentials/RegisterDto";
import { AuthResponse } from "@/interfaces/User/Authresponse";



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
      
            return await this._httpClient
                .PostRequestType("account/emailverification?token="+token+"&email="+email)
                .execute<GetUserDto>();            
         
     
    }
    public async Checkauth():Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
       return  await this._httpClient
                .GetRequestType("user/checkauth")
                .execute<GetUserDto>();
    }
}