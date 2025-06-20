import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import { HttpClient } from "./httpClient";
import { ErrorType } from "@/enums/RequestType";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { UpdatePictureDto, UpdateUserDto } from "@/interfaces/User/UpdateUserDto";

export class UserAction
{

    private _httpClient: HttpClient;
    private apibaseurl: string;
    constructor(apibaseurl: string = "http://localhost:7159/escape-game/user") { 
        this.apibaseurl = apibaseurl;
        this._httpClient = new HttpClient();
        this._httpClient.setBaseUrl(this.apibaseurl);
    }

    /**
     * Retrieves all users from the server.
     * @returns {Promise<ServiceResponse<GetUserDto[]>>} A promise that resolves with a ServiceResponse object.
     *          If the request is successful, the data property of the ServiceResponse object will contain an array of
     *          all users. If the request fails, the data property will be null and the success property will
     *          be false.
     * @throws {Error} If the request to retrieve the users fails.
     */ 
    public async GetAllUser(): Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
        try {
            const response = await this._httpClient.GetRequestType("").execute<GetUserDto>();

            if(response.Success)
            {
                return response;
            }
            throw new Error(response.Message);
        } catch (error) {
            return {
                Data: null,
                Success: false,
                Message: error instanceof Error ? error.message : 'An error occurred',
                ErrorType: ErrorType.Bad,
            }
        }
    }
    
    /**
     * Retrieves a user by its ID from the server.
     * @param {number} id - The ID of the user to be retrieved.
     * @returns {Promise<ServiceResponse<GetUserDto>>} A promise that resolves with a ServiceResponse object.
     *          If the request is successful, the data property of the ServiceResponse object will contain the
     *          organisation. If the request fails, the data property will be null and the success property will
     *          be false.
     * @throws {Error} If the request to retrieve the organisation fails.
     */ 
    public async GetUserById(id: number): Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
        try 
        {
            const response = await this._httpClient.GetRequestType("/" + id).execute<GetUserDto>();
            if(response.Success)
            {
                return response;
            }
            throw new Error(response.Message);
        }
        catch(error)
        {
            return {
                Data: null,
                Success: false,
                Message: error instanceof Error ? error.message : 'An error occurred',
                ErrorType: ErrorType.Bad,
            }
        }
    }
    public async GetCurrentUser(): Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
        try 
        {
            const response = await this._httpClient.GetRequestType("").execute<GetUserDto>();
            if(response.Success)
            {
                return response;
            }
            throw new Error(response.Message);
        }
        catch(error)
        {
            return {
                Data: null,
                Success: false,
                Message: error instanceof Error ? error.message : 'An error occurred',
                ErrorType: ErrorType.Bad,
            }
        }
    }
    public async UpdateUser(update:UpdateUserDto): Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
        try 
        {
            const response = await this._httpClient.PutRequestType("").setData(update).execute<GetUserDto>();
            if(response.Success)
            {
                return response;
            }
            throw new Error(response.Message);
        }
        catch(error)
        {
            return {
                Data: null,
                Success: false,
                Message: error instanceof Error ? error.message : 'An error occurred',
                ErrorType: ErrorType.Bad,
            }
        }
    }
    public async UpdatePicture(update:UpdatePictureDto): Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
        try 
        {
            const response = await this._httpClient.PutRequestType("/picture").setData(update).execute<GetUserDto>();
            if(response.Success)
            {
                return response;
            }
            throw new Error(response.Message);
        }
        catch(error)
        {
            return {
                Data: null,
                Success: false,
                Message: error instanceof Error ? error.message : 'An error occurred',
                ErrorType: ErrorType.Bad,
            }
        }
    }
    public async DeleteUser(id: number): Promise<ServiceResponse<GetUserDto> | PaginationResponse<GetUserDto>> {
        try 
        {
            const response = await this._httpClient.DeleteRequestType("/" + id).execute<GetUserDto>();
            if(response.Success)
            {
                return response;
            }
            throw new Error(response.Message);
        }
        catch(error)
        {
            return {
                Data: null,
                Success: false,
                Message: error instanceof Error ? error.message : 'An error occurred',
                ErrorType: ErrorType.Bad,
            }
        }
    }
}