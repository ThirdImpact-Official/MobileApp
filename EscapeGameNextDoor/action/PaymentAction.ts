import { Public } from "@mui/icons-material";
import { HttpClient } from "./httpClient";
import { ServiceResponse } from "@/interfaces/ServiceResponse";

import { GetPaymentDto } from "@/interfaces/EscapeGameInterface/Payment/getPaymentDto";
export class PaymentAction{

    private httpclient : HttpClient
    private apibaseurl : string = "http://localhost:7159/escape-game/payment"
    constructor() {
        this.httpclient = new HttpClient();
        this.httpclient.setBaseUrl(this.apibaseurl);
    }

    public async CreatePayment(reservationId: number): Promise<ServiceResponse<GetPaymentDto>> {
        const res = await this.httpclient
        .PostRequestType("/createPayment/"+reservationId)
        .execute<GetPaymentDto>();
        return res;
    }
    public async RetryPayment(reservationId: number): Promise<ServiceResponse<GetPaymentDto>> {
        const res = await this.httpclient
        .PutRequestType("/retrypayment/"+reservationId)
        .execute<GetPaymentDto>();
        return res;
    }
    public async CancelPayment(reservationId: number): Promise<ServiceResponse<GetPaymentDto>> {
        const res = await this.httpclient
        .PutRequestType("/cancelpayment/"+reservationId)
        .execute<GetPaymentDto>();
        return res;
    }
    public async FailedPayment(reservationId: number): Promise<ServiceResponse<GetPaymentDto>> {
        const res = await this.httpclient
        .PutRequestType("/failedpayment/"+reservationId)
        .execute<GetPaymentDto>();
        return res;
    }
    public async SuccessPayment(reservationId: number): Promise<ServiceResponse<GetPaymentDto>> {
        const res = await this.httpclient
        .PutRequestType("/successpayment/"+reservationId)
        .execute<GetPaymentDto>();
        return res;
    }

}