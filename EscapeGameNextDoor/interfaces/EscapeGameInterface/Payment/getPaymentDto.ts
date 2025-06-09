export interface GetPaymentDto {
  id: number;
  sessionReservedId: number;
  creationDate: string;
  paymentStatus: PaymentStatus;
  paymentLink: string;
  amount: number;
}
export enum PaymentStatus {
  Pending,
  Success,
  Failed,
  Canceled,
}
