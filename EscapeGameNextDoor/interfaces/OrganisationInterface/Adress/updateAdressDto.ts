export interface UpdateAdressDto {
    adressId: number;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}