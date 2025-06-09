export interface AddAdressDto{
    street: string;
    postalCode: string;
    city: string;
    country: string;
    escapeGameId: number | null;
    organisationId: number | null;
    activityPlaceId: number | null;
}