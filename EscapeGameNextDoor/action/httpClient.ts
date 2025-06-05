import { ErrorType, RequestType } from "@/enums/RequestType";
import { PaginationResponse, ServiceResponse } from "@/interfaces/ServiceResponse";
import axios, { AxiosInstance } from "axios";
import { SecureStoreApp } from "@/classes/SecureStore";
import { Platform } from "react-native";

export class HttpClient {
    private Axios: AxiosInstance;
    private baseUrl: string = "";
    private url: string = "";
    private requestType: RequestType = RequestType.GET;
    private static instance: HttpClient;
    private Data: unknown = null;
    private jwtCookieName: string = 'Token';
    private skipAuthCheck: boolean = false; // New property to skip JWT check for login/register
    private secureStore = new SecureStoreApp();
    constructor() {
     
        this.Axios = axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        this.Axios.interceptors.request.use(async (config) => {
            const token = await this.secureStore.getValueFor(this.jwtCookieName);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        })
    }

    /**
     * Sends a request to the server and returns a promise that resolves with a ServiceResponse object.
     * @param {string} url - The URL of the request.
     * @param {RequestType} requestType - The type of the request.
     * @param {T} data - The data to be sent with the request.
     * @returns {Promise<ServiceResponse<T>>} A promise that resolves with a ServiceResponse object.
     */
    private Sendrequest<T>(actionurl: string, requestType: RequestType, data?: T): Promise<ServiceResponse<T>> {
        return new Promise<ServiceResponse<T>>((resolve) => {
            let methodes: string;
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
            
            console.log(`Sending ${methodes} request to: ${actionurl}`, data);
            
            this.Axios
                .request({
                    url: actionurl,
                    method: methodes,
                    data: data
                })
                .then((axiosResponse) => {
                    const res = axiosResponse.data;
                    const standard: ServiceResponse<T> = {
                        Data: res.data,
                        Success: res.success,
                        Message: res.message,
                        ErrorType: res.errorType
                    };
                    resolve(standard);
                })
                .catch((error) => {
                    console.error(`Request failed to ${actionurl}:`, error);
                    resolve({
                        Data: null,
                        Success: false,
                        Message: error.message || 'Request failed',
                        ErrorType: ErrorType.Bad
                    });
                });
        });
    }

    private SendPageRequest<T>(actionurl: string, requestType: RequestType, data?: T): Promise<PaginationResponse<T>> {
        return new Promise<PaginationResponse<T>>((resolve) => {
            let method: string;
            switch (requestType) {
                case RequestType.GET:
                    method = "get";
                    break;
                case RequestType.POST:
                    method = "post";
                    break;
                case RequestType.PUT:
                    method = "put";
                    break;
                case RequestType.DELETE:
                    method = "delete";
                    break;
                default:
                    method = "get";
                    break;
            }
            
            this.Axios.request({
                url: actionurl,
                method: method,
                data: data
                // Don't override withCredentials or headers here
            })
            .then((axiosResponse) => {
                const res = axiosResponse.data;
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
                    ErrorType: error.errorType || ErrorType.Bad
                });
            });
        });
    }

    /**
     * Sets the option to skip authentication check for login/register endpoints
     * 
     * @returns {HttpClient} L'instance HttpClient pour le chaînage de méthodes
     */
    public skipAuth(): HttpClient {
        this.skipAuthCheck = true;
        return this;
    }

    /**
     * Vérifie si le cookie JWT est présent dans le document
     * 
     * @returns {boolean} true si le cookie JWT est présent
     */
    private hasJwtCookie(): boolean {
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
            const cookies = document.cookie.split(';');
            return cookies.some(cookie => cookie.trim().startsWith(`${this.jwtCookieName}=`));
        } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
            // For mobile, we'd need to check SecureStore asynchronously
            // This is a simplification - ideally you'd make this method async
            // and properly await the SecureStore check
            return true; // Skip this check for non-web platforms for now
        }
        return false;
    }

    /**
     * Sets the base URL of the API endpoint for all subsequent requests.
     * 
     * @param {string} baseUrl - The base URL of the API endpoint.
     * @returns {HttpClient} The instance of HttpClient for method chaining.
     */
    public setBaseUrl(baseUrl: string): HttpClient {
        this.baseUrl = baseUrl;
        return this;
    }

    /**
     * Returns the single instance of HttpClient.
     * @returns {HttpClient} The single instance of HttpClient.
     */
    public static getInstance(): HttpClient {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    // Request type setters
    public GetRequestType(url: string): HttpClient {
        this.requestType = RequestType.GET;
        this.url = url;
        return this;
    }

    public PostRequestType(url: string): HttpClient {
        this.requestType = RequestType.POST;
        this.url = url;
        return this;
    }

    public PutRequestType(url: string): HttpClient {
        this.requestType = RequestType.PUT;
        this.url = url;
        return this;
    }

    public DeleteRequestType(url: string): HttpClient {
        this.requestType = RequestType.DELETE;
        this.url = url;
        return this;
    }

    public setData<T>(data: T): HttpClient {
        this.Data = data;
        return this;
    }

    /**
     * Executes an HTTP request based on the configured request type and URL.
     * 
     * @template T - The type of data expected in the response.
     * @returns {Promise<ServiceResponse<T>>} A promise that resolves to a service response.
     */
    public async execute<T>(): Promise<ServiceResponse<T>> {
        const currentState = {
            baseUrl: this.baseUrl,
            url: this.url,
            requestType: this.requestType,
            Data: this.Data,
            skipAuthCheck: this.skipAuthCheck
        };

        if (!this.baseUrl) {
            return {
                Data: null,
                Success: false,
                Message: 'Base URL not set',
                ErrorType: ErrorType.Null,
            };
        }

        try {
            let response: ServiceResponse<T>;
            const fullUrl = `${this.baseUrl}${this.url}`;
         
            if (this.requestType == RequestType.GET) {
                response = await this.Sendrequest(fullUrl, this.requestType);
            } else {
                if (this.Data == null) {
                    response = await this.Sendrequest(fullUrl, this.requestType);
                } else {
                    response = await this.Sendrequest(fullUrl, this.requestType, this.Data as T);
                }
            }
            
            return response as ServiceResponse<T>;
            
        } catch (error: any | Error) {
            return {
                Data: null,
                Success: false,
                Message: error.message,
                ErrorType: ErrorType.Bad,
            };
        } finally {
            // Reset the skipAuthCheck flag and restore state
            this.skipAuthCheck = false;
            this.baseUrl = currentState.baseUrl;
            this.url = currentState.url;
            this.requestType = currentState.requestType;
            this.Data = currentState.Data;
        }
    }

    // Additional methods unchanged...

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