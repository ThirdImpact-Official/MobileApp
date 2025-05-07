import { ErrorType } from "@/enums/RequestType";


export interface ServiceResponse<T>
{
    Data: T | null;
    Success: boolean;
    Message: string;
    ErrorType: ErrorType;
}

export interface PaginationResponse<T>
{
    Data: T[] | null;
    Page:number;
    PageSize:number;
    TotalPage:number;
    Success: boolean;
    Message: string;
    ErrorType: ErrorType;
}