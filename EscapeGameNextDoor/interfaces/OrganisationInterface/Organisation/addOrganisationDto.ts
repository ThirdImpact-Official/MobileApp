import { AddAdressDto } from "../Adress/addAdressDto";

export interface AddOrganisationDto {
    email: string;
    phoneNumber: string;
    description: string;
    name: string;
    address: AddAdressDto | null;
    formFile: File | null;
}