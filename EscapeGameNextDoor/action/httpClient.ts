import { ErrorType, RequestType } from "@/enums/RequestType";
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import axios,{ AxiosInstance} from "axios";


export class HttpClient 
{
    private Axios: AxiosInstance;
    private baseUrl: string ="";
    private url: string= "";
    private requestType: RequestType = RequestType.GET;
    private static instance: HttpClient;
    private Data : unknown = null;
    private jwtCookieName: string = 'jwt';
    // 
    constructor(  )
    {
       this.Axios= axios.create({
           headers:{
                'Content-Type': 'application/json'
           },
           withCredentials: true
       });
    }
    
    // ceci est un expemple d'utilisation
    /*
        public exemples(): void
        {
            dans le cadre d'un get 

            const response = await HttpClient
                .getInstance()
                .setBaseUrl('https://api.example.com')
                .GetRequestType('/users/1')
                .execute<User>();

            if (response.success) {
                console.log(response.data);
                }
        }

        // Exemple POST
        const createUser = async () => {
            const userData = { name: "John" };
            
            const response = await HttpClient
                .getInstance()
                .setBaseUrl('https://api.example.com')
                .PostRequestType('/users')
                .setData(userData)
                .execute<User>();

            if (response.success) {
                console.log(response.data);
    }
};

    */

    /**
    * Sends a request to the server and returns a promise that resolves with a ServiceResponse object.
    * @param {string} url - The URL of the request.
    * @param {RequestType} requestType - The type of the request.
    * @param {T} data - The data to be sent with the request.
    * @returns {Promise<ServiceResponse<T>>} A promise that resolves with a ServiceResponse object.
    */
    private Sendrequest<T>( actionurl: string, requestType: RequestType, data?: T ): Promise<ServiceResponse<T>>
    {

        console.log(data);
        return new Promise<ServiceResponse<T> >((resolve)=>
            {
                let methodes:string;
                switch (requestType) {
                    case RequestType.GET:
                        methodes = "get";
                        break;
                    case RequestType.POST:
                        methodes = "post";
                        break;
                    case RequestType.PUT:
                        methodes = "put";
                        break;
                    case RequestType.DELETE:
                        methodes = "delete";
                        break;
                    default:
                        methodes = "get";
                        break;
                }
                this.Axios
                .request({
                        headers: {
                            'Content-Type':'application/json'
                            ,'Access-Control-Allow-Origin': '*'
                        },
                        url: actionurl, 
                        method: methodes,
                        data: data})
                .then((axiosResponse) => {
                    const res = axiosResponse.data;
                        const standard: ServiceResponse<T> = {
                            Data: res.data,
                            Success: res.success,
                            Message: res.message,
                            ErrorType: res.errorType
                        };
                        resolve(standard);
                    }
                )
                .catch((error) => {
                        resolve({
                            Data: null,
                            Success: false,
                            Message: error.message,
                            ErrorType: ErrorType.Bad});
                })
            });        
    }
    private SendPageRequest<T>( actionurl: string, requestType: RequestType, data?: T ): Promise<PaginationResponse<T>>
    {
        return new Promise<PaginationResponse<T>>((resolve)=>
            {
                let methodes:string;
                switch (requestType) {
                    case RequestType.GET:
                        methodes = "get";
                        break;
                    case RequestType.POST:
                        methodes = "post";
                        break;
                    case RequestType.PUT:
                        methodes = "put";
                        break;
                    case RequestType.DELETE:
                        methodes = "delete";
                        break;
                    default:
                        methodes = "get";
                        break;
                }
                this.Axios
                .request({
                        headers: {
                            'Content-Type':'application/json'
                            ,'Access-Control-Allow-Origin': '*'
                        },
                        url: actionurl, 
                        method: methodes,
                        data: data})
                .then((axiosResponse) => {
                    const res = axiosResponse.data;

                        console.log("res", res);
                        const paginated: PaginationResponse<T> = {
                            Data: res.data,
                            Success: res.success,
                            Message: res.message,
                            ErrorType: res.errorType,
                            Page: res.page,
                            PageSize: res.pageSize,
                            TotalPage: res.totalPage
                        };
                     
                        resolve(paginated);
                  
                })
                .catch((error) => {
                        resolve({
                            Data: null,
                            Success: false,
                            Page: 0,
                            PageSize: 0,
                            TotalPage: 0,
                            Message: error.message,
                            ErrorType: error.errorType});
                })
            
        });
    }
      /**
     * Définit le nom du cookie contenant le JWT
     * 
     * @param {string} cookieName - Le nom du cookie JWT
     * @returns {HttpClient} L'instance HttpClient pour le chaînage de méthodes
     */
      public setJwtCookieName(cookieName: string): HttpClient {
        this.jwtCookieName = cookieName;
        return this;
    }
    
    /**
     * Vérifie si le cookie JWT est présent dans le document
     * 
     * @returns {boolean} true si le cookie JWT est présent
     */
    private hasJwtCookie(): boolean {
        if (typeof document !== 'undefined') {
            const cookies = document.cookie.split(';');
            return cookies.some(cookie => cookie.trim().startsWith(`${this.jwtCookieName}=`));
        }
        return false;
    }
    
    /**
     * Récupère la valeur du cookie JWT
     * 
     * @returns {string|null} La valeur du cookie JWT ou null si non trouvé
     */
    private getJwtCookieValue(): string | null {
        if (typeof document !== 'undefined') {
            const cookies = document.cookie.split(';');
            const jwtCookie = cookies.find(cookie => cookie.trim().startsWith(`${this.jwtCookieName}=`));
            if (jwtCookie) {
                return jwtCookie.split('=')[1].trim();
            }
        }
        return null;
    }

    /**
     * Sets the base URL of the API endpoint for all subsequent requests.
     * 
     * @param {string} baseUrl - The base URL of the API endpoint. This URL
     * is prepended to all request URLs used in the other methods of this class.
     * @returns {HttpClient} The instance of HttpClient for method chaining.
     */
    public setBaseUrl( baseUrl: string ): HttpClient
    {
        this.baseUrl = baseUrl;
        return this;
    }
    
    /**
     * Returns the single instance of HttpClient.
     * This is a singleton method that returns the single instance of HttpClient,
     * creating one if it doesn't already exist. This is useful for when you want
     * to ensure that all requests are made with the same instance of HttpClient.
     * @returns {HttpClient} The single instance of HttpClient.
     */
    public static getInstance(): HttpClient {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    /**
     * Sets the HTTP request type to GET and configures the request URL.
     *
     * @param {string} url - The endpoint URL for the GET request.
     * @returns {HttpClient} The instance of HttpClient for method chaining.
     */
    public GetRequestType( url: string ): HttpClient
    {
        this.requestType = RequestType.GET;
        this.url = url;
        console.log( "this.url : " + this.url );
        return this;
    }
    /**
     * Sets the HTTP request type to POST and configures the request URL.
     *
     * @param {string} url - The endpoint URL for the POST request.
     * @returns {HttpClient} The instance of HttpClient for method chaining.
     */

    public PostRequestType( url: string ): HttpClient
    {
        this.requestType = RequestType.POST;
        this.url = url;
        return this;
    }
/**
 * Sets the HTTP request type to PUT and configures the request URL.
 *
 * @param {string} url - The endpoint URL for the PUT request.
 * @returns {HttpClient} The instance of HttpClient for method chaining.
 */

    public PutRequestType( url: string ): HttpClient
    {
        this.requestType = RequestType.PUT;
        this.url = url;
        return this;
    }
/**
 * Sets the HTTP request type to DELETE and configures the request URL.
 *
 * @param {string} url - The endpoint URL for the DELETE request.
 * @returns {HttpClient} The instance of HttpClient for method chaining.
 */

    public DeleteRequestType( url: string ): HttpClient
    {
        this.requestType = RequestType.DELETE;
        this.url = url;
        return this;
    }
/**
 * Sets the data to be used in an HTTP request.
 *
 * @template T - The type of data to be set.
 * @param {T} data - The data to be used in the request.
 * @returns {HttpClient} The instance of HttpClient for method chaining.
 */

    public setData<T>( data: T ): HttpClient
    {
        this.Data = data;
        return this;
    }
    private ResetState(): void {
        this.url = '';
        this.requestType = RequestType.GET;
        this.Data = null;
    }
/**
 * Executes an HTTP request based on the configured request type and URL.
 * 
 * @template T - The type of data expected in the response.
 * @returns {Promise<ServiceResponse<T>>} A promise that resolves to a service response containing the data, success status, message, and error type.
 * @throws Will return an error response if the base URL is not set or if the request fails.
 */

    public async execute<T>(): Promise<ServiceResponse<T>>
    {
        const currentState= {
            baseUrl: this.baseUrl,
            url: this.url,
            requestType: this.requestType,
            Data: this.Data,
        }

        if (!this.baseUrl) {
            return {
                Data: null,
                Success: false,
                Message: 'Base URL not set',
                ErrorType: ErrorType.Null,
            };
        }

        try {
            let response: ServiceResponse<T> ;
            const fullUrl = `${this.baseUrl}${this.url}`;
            if(!this.hasJwtCookie)
            {
                throw new Error('JWT cookie not found');
            }
            if(this.requestType == RequestType.GET)
            {
                 response = await this.Sendrequest(fullUrl, this.requestType);
                 console.log("Full url :"+fullUrl);
            }
            else
            {
                if(this.Data == null)
                {
                   
                    response = await this.Sendrequest(fullUrl, this.requestType);
                }
                else
                {
                    
                    response = await this.Sendrequest(fullUrl, this.requestType, this.Data as T);
                }
            }
            
            return response as ServiceResponse<T>;
            
        } catch (error:any | Error) {
            return {
                Data: null,
                Success: false,
                Message: error.message,
                ErrorType: ErrorType.Bad,
            };
        }finally
        {
           this.baseUrl = currentState.baseUrl;
           this.url = currentState.url;
           this.requestType = currentState.requestType;
           this.Data = currentState.Data;
        }
    }
    public async executePagination<T>(): Promise<PaginationResponse<T>>
    {
        const currentState= {
            baseUrl: this.baseUrl,
            url: this.url,
            requestType: this.requestType,
            Data: this.Data,
        }

        if (!this.baseUrl) {
            return {
                Data: null,
                Success: false,
                Message: 'Base URL not set',
                TotalPage: 0,
                Page: 0,
                PageSize: 0,
                ErrorType: ErrorType.Null,
            };
        }

        try {
            let response:PaginationResponse<T>;
            const fullUrl = `${this.baseUrl}${this.url}`;
            if(!this.hasJwtCookie)
            {
                throw new Error('JWT cookie not found');
            }
            if(this.requestType == RequestType.GET)
            {
                 response = await this.SendPageRequest(fullUrl, this.requestType);
                 console.log("Full url :"+fullUrl);
            }
            else
            {
                if(this.Data == null)
                {
                   
                    response = await this.SendPageRequest(fullUrl, this.requestType);
                }
                else
                {
                    
                    response = await this.SendPageRequest(fullUrl, this.requestType, this.Data as T);
                }
            }
            
                return response as PaginationResponse<T>;
        } catch (error:any|Error) {
            return {
                Data: null,
                Success: false,
                Message: error.message,
                TotalPage: 0,
                Page: 0,
                PageSize: 0,
                ErrorType: ErrorType.Bad,
            };
        }finally
        {
           this.baseUrl = currentState.baseUrl;
           this.url = currentState.url;
           this.requestType = currentState.requestType;
           this.Data = currentState.Data;
        }
    }
}   