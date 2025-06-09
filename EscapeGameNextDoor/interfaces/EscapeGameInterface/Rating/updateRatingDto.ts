export interface UpdateRatingDto extends UpdateDto {
    rateId: number;
    rateTitle: string;
    rateContent: string;
    userId: number;
    notes: number;
}